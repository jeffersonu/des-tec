/**
 * api/verify-contact.ts
 * ---------------------------------------------------------------------------
 * Función serverless de Vercel para `POST /api/verify-contact`.
 *
 * NOTA ARQUITECTÓNICA IMPORTANTE PARA VERCEL ESM ("type": "module"):
 * Este archivo es 100% autónomo (sin imports relativos a fuera de /api ni
 * extensiones .ts) para evitar el error `ERR_UNKNOWN_FILE_EXTENSION` /
 * `ERR_MODULE_NOT_FOUND` en el runtime Serverless de Node.js en Vercel.
 * ---------------------------------------------------------------------------
 */
import type { VercelRequest, VercelResponse } from '@vercel/node';

export const config = {
  maxDuration: 15,
};

interface ContactPayload {
  nombre: string;
  empresa?: string;
  correo: string;
  whatsapp?: string;
  ciudad?: string;
  servicio?: string;
  presupuesto?: string;
  mensaje: string;
  turnstileToken?: string;
  honeypot?: string;
  isOfflineSync?: boolean;
  aceptaHabeasData?: boolean;
}

// 1. SANITIZACIÓN / ANTI-INYECCIÓN (XSS, Header Injection & Sanitización Canónica)
function sanitizeAndFilter(val: any, isLongMessageField = false): any {
  if (typeof val !== 'string') {
    if (val && typeof val === 'object') {
      for (const key in val) {
        if (Object.prototype.hasOwnProperty.call(val, key)) {
          val[key] = sanitizeAndFilter(val[key], key === 'mensaje');
        }
      }
    }
    return val;
  }

  let clean = val.replace(/\0/g, '');

  if (!isLongMessageField) {
    clean = clean.replace(/[\r\n]+/g, ' ');
  }

  clean = clean
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');

  const scriptPatterns = [
    /javascript:/gi,
    /vbscript:/gi,
    /data:\s*text\/html/gi,
    /onerror\s*=/gi,
    /onload\s*=/gi,
    /onclick\s*=/gi,
    /eval\s*\(/gi,
    /<script/gi,
    /<\/script>/gi,
  ];
  scriptPatterns.forEach((pattern) => {
    clean = clean.replace(pattern, '[BLOCKED_SCRIPT_PATTERN]');
  });

  return clean.trim();
}

// 2. RATE LIMITING EN MEMORIA CON PROTECCIÓN DE MEMORIA
const ipRequests = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 5;
const MAX_TRACKED_IPS = 1000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();

  if (ipRequests.size > MAX_TRACKED_IPS) {
    for (const [k, ts] of ipRequests.entries()) {
      const valid = ts.filter((t) => now - t < RATE_LIMIT_WINDOW);
      if (valid.length === 0) ipRequests.delete(k);
      else ipRequests.set(k, valid);
    }
  }

  const existing = ipRequests.get(ip);
  if (!existing) {
    ipRequests.set(ip, [now]);
    return false;
  }

  const timestamps = existing.filter((t) => now - t < RATE_LIMIT_WINDOW);
  if (timestamps.length === 0) {
    ipRequests.set(ip, [now]);
    return false;
  }

  if (timestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    ipRequests.set(ip, timestamps);
    return true;
  }

  timestamps.push(now);
  ipRequests.set(ip, timestamps);
  return false;
}

// 3. VERIFICACIÓN DE ORIGEN (anti-CSRF compatible con Vercel y PWA instalada)
function isOriginTrusted(
  method: string,
  headers: Record<string, string | string[] | undefined>,
  isProd: boolean
): boolean {
  if (!['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) return true;
  if (!isProd) return true;

  const getHeader = (name: string) => {
    const v = headers[name];
    return Array.isArray(v) ? v[0] : v;
  };

  const normalizeHost = (h: string) => h.trim().toLowerCase().replace(/^www\./, '');

  const origin = getHeader('origin');
  const referer = getHeader('referer');
  const rawHost = getHeader('x-forwarded-host') || getHeader('host') || '';
  const allowedHosts = [
    getHeader('host'),
    getHeader('x-forwarded-host'),
    'des-tec.co',
    'www.des-tec.co',
  ]
    .filter(Boolean)
    .flatMap((h) => h!.split(','))
    .map((h) => normalizeHost(h));

  if (!origin && !referer) {
    return Boolean(rawHost);
  }

  try {
    if (origin) {
      const originHost = normalizeHost(new URL(origin).host);
      if (allowedHosts.includes(originHost) || originHost.endsWith('.vercel.app') || originHost.endsWith('.run.app')) {
        return true;
      }
    }
    if (referer) {
      const refererHost = normalizeHost(new URL(referer).host);
      if (allowedHosts.includes(refererHost) || refererHost.endsWith('.vercel.app') || refererHost.endsWith('.run.app')) {
        return true;
      }
    }
  } catch {
    return false;
  }

  return false;
}

// 4. ENVÍO DEL LEAD A HUBSPOT (Forms API)
async function submitToHubSpot(params: {
  portalId: string;
  formGuid: string;
  nombre: string;
  correo: string;
  empresa?: string;
  whatsapp?: string;
  ciudad?: string;
  servicio?: string;
  presupuesto?: string;
  mensaje: string;
  pageUri?: string;
}): Promise<{ ok: boolean; error?: string }> {
  try {
    const hubspotUrl = `https://api.hsforms.com/submissions/v3/integration/submit/${params.portalId}/${params.formGuid}`;

    const hubspotPayload = {
      fields: [
        { name: 'firstname', value: params.nombre },
        { name: 'email', value: params.correo },
        { name: 'company', value: params.empresa || '' },
        { name: 'phone', value: params.whatsapp || '' },
        { name: 'city', value: params.ciudad || '' },
        { name: 'servicio', value: params.servicio || '' },
        { name: 'presupuesto', value: params.presupuesto || '' },
        { name: 'message', value: params.mensaje },
      ],
      context: {
        pageUri: params.pageUri || 'https://des-tec.co',
        pageName: 'Des-Tec — Formulario de contacto',
      },
    };

    const hubspotResponse = await fetch(hubspotUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(hubspotPayload),
    });

    if (!hubspotResponse.ok) {
      const errorText = await hubspotResponse.text();
      return { ok: false, error: `HTTP ${hubspotResponse.status}: ${errorText}` };
    }

    return { ok: true };
  } catch (err: any) {
    return { ok: false, error: err?.message || String(err) };
  }
}

function getClientIp(req: VercelRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  const raw = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  if (raw) return raw.split(',')[0].trim();
  return req.socket?.remoteAddress || '127.0.0.1';
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, message: 'Método no permitido.' });
  }

  const isProd = process.env.NODE_ENV === 'production';

  try {
    // 1. Verificación de origen (anti-CSRF)
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

    // 3. Parseo seguro del cuerpo JSON
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        return res.status(400).json({ success: false, message: 'Cuerpo de la solicitud inválido.' });
      }
    }

    if (!body || typeof body !== 'object') {
      return res.status(400).json({ success: false, message: 'No se recibieron datos en la solicitud.' });
    }

    // 4. Sanitización
    const sanitized = sanitizeAndFilter({ ...body }) as ContactPayload;
    const { nombre, empresa, correo, whatsapp, ciudad, servicio, presupuesto, mensaje, honeypot } = sanitized;

    // A. Honeypot
    if (honeypot) {
      return res.status(200).json({ success: true, message: 'Solicitud enviada correctamente.' });
    }

    // B. Validación estricta del backend
    if (!nombre || !correo || !mensaje) {
      return res.status(400).json({ success: false, message: 'Por favor, rellena todos los campos requeridos.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
      return res.status(400).json({ success: false, message: 'La dirección de correo electrónico no cumple con un formato válido.' });
    }

    if (nombre.length > 100 || correo.length > 100 || mensaje.length > 2500) {
      return res.status(400).json({ success: false, message: 'La longitud de los datos proporcionados supera los límites de seguridad permitidos.' });
    }

    // C. Filtro heurístico anti-spam
    const blockWords = ['viagra', 'cialis', 'bitcoin', 'lottery', 'sex', 'casino', 'free money'];
    const textToAnalyze = `${nombre} ${mensaje}`.toLowerCase();
    if (blockWords.some((word) => textToAnalyze.includes(word))) {
      return res.status(400).json({ success: false, message: 'La solicitud contiene patrones de contenido bloqueados por seguridad.' });
    }

    // D. Envío del lead a HubSpot (si está configurado en variables de entorno)
    const hubspotPortalId = process.env.HUBSPOT_PORTAL_ID;
    const hubspotFormGuid = process.env.HUBSPOT_FORM_GUID;

    if (hubspotPortalId && hubspotFormGuid) {
      const hubspotResult = await submitToHubSpot({
        portalId: hubspotPortalId,
        formGuid: hubspotFormGuid,
        nombre,
        correo,
        empresa,
        whatsapp,
        ciudad,
        servicio,
        presupuesto,
        mensaje,
        pageUri: (req.headers['referer'] as string) || 'https://des-tec.co',
      });

      if (!hubspotResult.ok) {
        console.error('[HubSpot] El envío del lead falló:', hubspotResult.error);
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Tu solicitud ha sido recibida correctamente. Nos pondremos en contacto contigo de forma inmediata.',
    });
  } catch (error: any) {
    console.error('[Error] Excepción en /api/verify-contact:', error?.message || error);
    return res.status(500).json({
      success: false,
      message: 'Ocurrió un error inesperado al procesar tu solicitud. Por favor, reinténtalo más tarde.',
    });
  }
}

