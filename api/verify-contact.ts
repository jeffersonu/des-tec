/**
 * api/verify-contact.ts
 * ---------------------------------------------------------------------------
 * Función serverless de Vercel para `POST /api/verify-contact`.
 *
 * Envía las solicitudes del formulario de contacto directamente a los dos
 * correos oficiales:
 *   - informacion.destec@gmail.com
 *   - jeffersonurbina20@gmail.com
 * utilizando la API REST v3 moderna de Brevo sobre HTTPS (`https://api.brevo.com/v3/smtp/email`),
 * sin exponer ni requerir acceso a las contraseñas de las cuentas de Google.
 * ---------------------------------------------------------------------------
 */
import type { VercelRequest, VercelResponse } from '@vercel/node';

export const config = {
  maxDuration: 15,
};

// Destinatarios oficiales por defecto
const DEFAULT_RECEIVER_EMAILS = [
  'informacion.destec@gmail.com',
  'jeffersonurbina20@gmail.com',
];

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

// 4. ENVÍO TRANSACCIONAL MODERNO VÍA BREVO REST API v3 (HTTPS)
async function sendEmailViaBrevo(params: {
  apiKey: string;
  senderEmail: string;
  recipients: string[];
  payload: ContactPayload;
}): Promise<{ ok: boolean; error?: string }> {
  try {
    const { nombre, empresa, correo, whatsapp, ciudad, servicio, presupuesto, mensaje } = params.payload;
    const cleanWhatsappDigits = (whatsapp || '').replace(/[^\d]/g, '');
    const bogotaTime = new Intl.DateTimeFormat('es-CO', {
      dateStyle: 'full',
      timeStyle: 'medium',
      timeZone: 'America/Bogota',
    }).format(new Date());

    const subject = `🚀 Nueva Cotización Des-Tec: ${nombre} — ${servicio || 'Consulta General'}`;

    const textContent = [
      'NUEVA SOLICITUD DE COTIZACIÓN — DES-TEC',
      '========================================',
      `Fecha (Colombia): ${bogotaTime}`,
      `Nombre completo: ${nombre}`,
      `Empresa: ${empresa || 'No especificada'}`,
      `Correo electrónico: ${correo}`,
      `WhatsApp: ${whatsapp || 'No especificado'}`,
      `Ciudad / País: ${ciudad || 'No especificada'}`,
      `Servicio requerido: ${servicio || 'No especificado'}`,
      `Presupuesto estimado: ${presupuesto || 'No especificado'}`,
      '',
      'DETALLES DEL REQUERIMIENTO:',
      mensaje,
      '',
      '----------------------------------------',
      'Autorización Ley 1581 de 2012 (Habeas Data): Aceptada por el titular.',
    ].join('\n');

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 620px; margin: 0 auto; background-color: #0f172a; color: #f8fafc; border-radius: 16px; overflow: hidden; border: 1px solid #334155;">
        <div style="background: linear-gradient(90deg, #7c3aed, #2563eb, #06b6d4); padding: 20px 24px;">
          <h2 style="margin: 0; font-size: 18px; color: #ffffff;">🚀 Nueva Solicitud de Cotización — Des-Tec</h2>
          <p style="margin: 4px 0 0 0; font-size: 12px; color: #e2e8f0;">Recibida el ${bogotaTime}</p>
        </div>
        <div style="padding: 24px; background-color: #1e293b;">
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr>
              <td style="padding: 8px 0; color: #94a3b8; width: 160px; font-weight: bold;">Nombre Completo:</td>
              <td style="padding: 8px 0; color: #ffffff; font-weight: bold;">${nombre}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #94a3b8; font-weight: bold;">Empresa:</td>
              <td style="padding: 8px 0; color: #e2e8f0;">${empresa || 'No especificada'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #94a3b8; font-weight: bold;">Correo Electrónico:</td>
              <td style="padding: 8px 0;"><a href="mailto:${correo}" style="color: #38bdf8; text-decoration: underline;">${correo}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #94a3b8; font-weight: bold;">WhatsApp:</td>
              <td style="padding: 8px 0;">
                ${
                  cleanWhatsappDigits
                    ? `<a href="https://wa.me/${cleanWhatsappDigits}" target="_blank" style="color: #4ade80; text-decoration: underline; font-weight: bold;">${whatsapp} (Abrir chat en WhatsApp)</a>`
                    : whatsapp || 'No especificado'
                }
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #94a3b8; font-weight: bold;">Ciudad / País:</td>
              <td style="padding: 8px 0; color: #e2e8f0;">${ciudad || 'No especificada'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #94a3b8; font-weight: bold;">Servicio Requerido:</td>
              <td style="padding: 8px 0; color: #c084fc; font-weight: bold;">${servicio || 'No especificado'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #94a3b8; font-weight: bold;">Presupuesto Estimado:</td>
              <td style="padding: 8px 0; color: #38bdf8; font-weight: bold;">${presupuesto || 'No especificado'}</td>
            </tr>
          </table>

          <div style="margin-top: 18px; padding: 16px; background-color: #0f172a; border-radius: 12px; border: 1px solid #334155;">
            <div style="font-size: 11px; text-transform: uppercase; color: #94a3b8; font-weight: bold; margin-bottom: 8px;">
              Detalles del Requerimiento:
            </div>
            <div style="font-size: 14px; color: #f1f5f9; white-space: pre-wrap; line-height: 1.5;">${mensaje}</div>
          </div>

          <div style="margin-top: 16px; font-size: 11px; color: #64748b; border-top: 1px solid #334155; padding-top: 12px;">
            ✅ El titular aceptó el tratamiento de datos personales conforme a la <strong>Ley 1581 de 2012 (Habeas Data)</strong>.<br/>
            💡 Puedes responder directamente a este correo para escribirle a <strong>${correo}</strong>.
          </div>
        </div>
      </div>
    `;

    // Llamada HTTPS al endpoint oficial de Brevo Transactional Email API v3
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        'api-key': params.apiKey,
      },
      body: JSON.stringify({
        sender: {
          name: 'Des-Tec Web',
          email: params.senderEmail,
        },
        to: params.recipients.map((email) => ({ email })),
        replyTo: {
          email: correo,
          name: nombre,
        },
        subject,
        htmlContent,
        textContent,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { ok: false, error: `HTTP ${response.status}: ${errorText}` };
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
    const { nombre, correo, mensaje, honeypot } = sanitized;

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

    // D. Envío directo mediante la API REST v3 de Brevo a los dos correos oficiales
    const brevoApiKey = (process.env.BREVO_API_KEY || '').trim();
    const senderEmail = (process.env.BREVO_SENDER_EMAIL || 'contacto@des-tec.co').trim();
    const customRecipients = process.env.CONTACT_RECEIVER_EMAILS
      ? process.env.CONTACT_RECEIVER_EMAILS.split(',').map((e) => e.trim()).filter(Boolean)
      : DEFAULT_RECEIVER_EMAILS;

    if (!brevoApiKey) {
      console.error('[Brevo] Falta configurar la variable de entorno BREVO_API_KEY en Vercel.');
      return res.status(503).json({
        success: false,
        message: 'Falta configurar la llave de API de Brevo (BREVO_API_KEY) en las variables de entorno de Vercel.',
      });
    }

    const emailResult = await sendEmailViaBrevo({
      apiKey: brevoApiKey,
      senderEmail,
      recipients: customRecipients,
      payload: sanitized,
    });

    if (!emailResult.ok) {
      console.error('[Brevo] Error al enviar el correo:', emailResult.error);
      return res.status(502).json({
        success: false,
        message: 'No se pudo procesar el envío en Brevo. Verifica que BREVO_API_KEY sea válida y que el correo remitente (BREVO_SENDER_EMAIL) esté verificado en tu cuenta de Brevo.',
      });
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

