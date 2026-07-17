/**
 * api/verify-contact.ts
 * ---------------------------------------------------------------------------
 * Función serverless de Vercel — reemplaza, en producción, a la ruta
 * Express `POST /api/verify-contact` que vive en server.ts.
 *
 * Vercel detecta automáticamente cualquier archivo dentro de /api como un
 * endpoint propio: este queda disponible en producción exactamente en
 * `/api/verify-contact`, la misma ruta que el frontend ya usa
 * (src/components/sections/Contact.tsx y src/context/PWAContext.tsx no
 * necesitan ningún cambio).
 *
 * Toda la lógica de validación / Turnstile / HubSpot vive en
 * lib/contactSecurity.ts y se reutiliza tal cual desde aquí, para que el
 * comportamiento sea idéntico al de server.ts (usado en desarrollo local).
 * ---------------------------------------------------------------------------
 */
import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  sanitizeAndFilter,
  isRateLimited,
  isOriginTrusted,
  processContactSubmission,
  type ContactPayload,
} from '../lib/contactSecurity';

export const config = {
  // Los eventos de Turnstile/HubSpot pueden tardar un poco: evitamos timeouts cortos.
  maxDuration: 15,
};

function getClientIp(req: VercelRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  const raw = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  if (raw) return raw.split(',')[0].trim();
  return req.socket?.remoteAddress || '127.0.0.1';
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Solo se acepta POST — cualquier otro método queda rechazado.
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, message: 'Método no permitido.' });
  }

  const isProd = process.env.NODE_ENV === 'production';

  try {
    // 1. Verificación de origen (anti-CSRF) — igual que en server.ts
    if (!isOriginTrusted(req.method, req.headers as Record<string, string | string[] | undefined>, isProd)) {
      console.warn('[Security Alert] Verificación de origen (CSRF) fallida.');
      return res.status(403).json({
        success: false,
        message: 'Falla en la verificación del origen seguro. Solicitud denegada.',
      });
    }

    const clientIp = getClientIp(req);

    // 2. Rate limiting
    if (isRateLimited(clientIp)) {
      console.warn(`[Security alert] Rate limit excedido por IP: ${clientIp}`);
      return res.status(429).json({
        success: false,
        message: 'Has realizado demasiados intentos en poco tiempo. Por favor, espera un momento antes de reintentar.',
      });
    }

    // 3. Body: Vercel ya parsea JSON automáticamente si el Content-Type es application/json.
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        return res.status(400).json({ success: false, message: 'Cuerpo de la solicitud inválido.' });
      }
    }

    // 4. Sanitización (misma lógica anti XSS/SQL/header-injection que en server.ts)
    const sanitized = sanitizeAndFilter(body) as ContactPayload;

    // 5. Procesamiento central (validación + Turnstile + HubSpot)
    const result = await processContactSubmission(sanitized, {
      clientIp,
      pageUri: (req.headers['referer'] as string) || 'https://des-tec.co',
      turnstileSecretKey: process.env.TURNSTILE_SECRET_KEY || '1x00000000000000000000000000000000AA',
      hubspotPortalId: process.env.HUBSPOT_PORTAL_ID,
      hubspotFormGuid: process.env.HUBSPOT_FORM_GUID,
    });

    return res.status(result.status).json(result.body);
  } catch (error: any) {
    console.error('[Error] Excepción en /api/verify-contact:', error?.message || error);
    return res.status(500).json({
      success: false,
      message: 'Ocurrió un error inesperado al procesar tu solicitud. Por favor, reinténtalo más tarde.',
    });
  }
}
