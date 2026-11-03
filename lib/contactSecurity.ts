/**
 * lib/contactSecurity.ts
 * ---------------------------------------------------------------------------
 * Lógica compartida de seguridad y procesamiento del formulario de contacto.
 *
 * Se extrajo de server.ts para poder reutilizarla desde DOS lugares sin
 * duplicar código ni arriesgar que se desincronicen:
 *   1. server.ts        → servidor Express tradicional (desarrollo local con
 *                          `npm run dev`, o despliegue en Cloud Run / Render /
 *                          un VPS si algún día se usa esa vía).
 *   2. api/verify-contact.ts → función serverless de Vercel (producción).
 *
 * No importa nada de Express ni de Vercel aquí: solo recibe objetos planos,
 * así funciona igual sin importar quién la llame.
 * ---------------------------------------------------------------------------
 */

import nodemailer from 'nodemailer';

const DEFAULT_RECEIVER_EMAILS = [
  'informacion.destec@gmail.com',
  'jeffersonurbina20@gmail.com',
];

// ==========================================
// 1. SANITIZACIÓN / ANTI-INYECCIÓN (XSS, Header Injection & Sanitización Canónica)
// ==========================================
export function sanitizeAndFilter(val: any, isLongMessageField = false): any {
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

  let clean = val;

  // A. Elimina bytes nulos (\0) que causan bypasses en parsers y capas nativas
  clean = clean.replace(/\0/g, '');

  // B. Protege contra Email / Header Injection (remueve saltos de línea en campos de metadata de una línea)
  if (!isLongMessageField) {
    clean = clean.replace(/[\r\n]+/g, ' ');
  }

  // C. Protege contra HTML Injection & XSS (codificación canónica de caracteres peligrosos)
  clean = clean
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');

  // D. Limpieza de vectores comunes de inyección activa por pseudo-protocolos o manejadores de eventos
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

// ==========================================
// 2. RATE LIMITING EN MEMORIA CON PROTECCIÓN DE MEMORIA (anti-DoS & anti-leak)
// ==========================================
const ipRequests = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minuto
const MAX_REQUESTS_PER_WINDOW = 5; // Máx. 5 solicitudes por ventana
const MAX_TRACKED_IPS = 1000; // Límite estricto de entradas para evitar fuga de memoria (DoS)

function pruneExpiredIps(now: number) {
  for (const [ip, timestamps] of ipRequests.entries()) {
    const valid = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW);
    if (valid.length === 0) {
      ipRequests.delete(ip);
    } else {
      ipRequests.set(ip, valid);
    }
  }
}

export function isRateLimited(ip: string): boolean {
  const now = Date.now();

  if (ipRequests.size > MAX_TRACKED_IPS) {
    pruneExpiredIps(now);
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

// ==========================================
// 3. VERIFICACIÓN DE ORIGEN (anti-CSRF)
// ==========================================
export function isOriginTrusted(
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

// ==========================================
// 4. VERIFICACIÓN DE CLOUDFLARE TURNSTILE
// ==========================================
export async function verifyTurnstile(
  token: string,
  secretKey: string,
  remoteIp: string
): Promise<{ success: boolean; errors?: string[] }> {
  const siteVerifyUrl = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

  const response = await fetch(siteVerifyUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      secret: secretKey,
      response: token,
      remoteip: remoteIp,
    }),
  });

  const result = (await response.json()) as { success: boolean; 'error-codes'?: string[] };
  return { success: result.success, errors: result['error-codes'] };
}

// ==========================================
// 5. ENVÍO DIRECTO POR CORREO ELECTRÓNICO A LOS DOS CORREOS OFICIALES (Gmail SMTP)
// ==========================================
export async function sendDirectNotificationEmails(params: {
  smtpUser: string;
  smtpPass: string;
  smtpHost?: string;
  smtpPort?: number;
  recipients: string[];
  payload: ContactPayload;
}): Promise<{ ok: boolean; error?: string }> {
  try {
    const cleanPass = params.smtpPass.replace(/\s+/g, '');
    const host = params.smtpHost || 'smtp.gmail.com';
    const port = params.smtpPort || 465;

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: {
        user: params.smtpUser,
        pass: cleanPass,
      },
    });

    const { nombre, empresa, correo, whatsapp, ciudad, servicio, presupuesto, mensaje } = params.payload;
    const cleanWhatsappDigits = (whatsapp || '').replace(/[^\d]/g, '');
    const bogotaTime = new Intl.DateTimeFormat('es-CO', {
      dateStyle: 'full',
      timeStyle: 'medium',
      timeZone: 'America/Bogota',
    }).format(new Date());

    const subject = `🚀 Nueva Cotización Des-Tec: ${nombre} — ${servicio || 'Consulta General'}`;

    const textBody = [
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

    const htmlBody = `
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

    await transporter.sendMail({
      from: `"Des-Tec Web" <${params.smtpUser}>`,
      to: params.recipients.join(', '),
      replyTo: correo,
      subject,
      text: textBody,
      html: htmlBody,
    });

    return { ok: true };
  } catch (err: any) {
    return { ok: false, error: err?.message || String(err) };
  }
}

// ==========================================
// 6. PROCESAMIENTO CENTRAL DEL ENVÍO DE CONTACTO
// ==========================================
export interface ContactPayload {
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

export interface ContactProcessResult {
  status: number;
  body: { success: boolean; message: string };
}

export async function processContactSubmission(
  payload: ContactPayload,
  opts: {
    clientIp: string;
    pageUri?: string;
    turnstileSecretKey: string;
    hubspotPortalId?: string;
    hubspotFormGuid?: string;
  }
): Promise<ContactProcessResult> {
  const { nombre, correo, mensaje, honeypot } = payload;

  // A. Honeypot (trampa señuelo para bots)
  if (honeypot) {
    console.warn(`[Security Alert] Campo honeypot invisible completado. Bot marcado desde IP: ${opts.clientIp}`);
    return { status: 200, body: { success: true, message: 'Solicitud enviada correctamente.' } };
  }

  // B. Validación estricta del backend
  if (!nombre || !correo || !mensaje) {
    return { status: 400, body: { success: false, message: 'Por favor, rellena todos los campos requeridos.' } };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(correo)) {
    return { status: 400, body: { success: false, message: 'La dirección de correo electrónico no cumple con un formato válido.' } };
  }

  if (nombre.length > 100 || correo.length > 100 || mensaje.length > 2500) {
    return { status: 400, body: { success: false, message: 'La longitud de los datos proporcionados supera los límites de seguridad permitidos.' } };
  }

  // C. Filtro heurístico anti-spam
  {
    const blockWords = ['viagra', 'cialis', 'bitcoin', 'lottery', 'sex', 'casino', 'free money'];
    const textToAnalyze = `${nombre} ${mensaje}`.toLowerCase();
    if (blockWords.some((word) => textToAnalyze.includes(word))) {
      console.warn(`[Security Alert] Patrón spam detectado desde IP: ${opts.clientIp}`);
      return { status: 400, body: { success: false, message: 'La solicitud contiene patrones de contenido bloqueados por seguridad.' } };
    }
  }

  // D. Envío directo a los dos correos oficiales (informacion.destec@gmail.com y jeffersonurbina20@gmail.com)
  const smtpUser = (process.env.SMTP_USER || 'informacion.destec@gmail.com').trim();
  const smtpPass = (process.env.SMTP_PASS || '').trim();
  const customRecipients = process.env.CONTACT_RECEIVER_EMAILS
    ? process.env.CONTACT_RECEIVER_EMAILS.split(',').map((e) => e.trim()).filter(Boolean)
    : DEFAULT_RECEIVER_EMAILS;

  if (!smtpPass) {
    console.error('[Email] Falta configurar la variable de entorno SMTP_PASS.');
    return {
      status: 503,
      body: {
        success: false,
        message: 'Falta configurar la contraseña de aplicación de Gmail (SMTP_PASS) en las variables de entorno para enviar el correo.',
      },
    };
  }

  const emailResult = await sendDirectNotificationEmails({
    smtpUser,
    smtpPass,
    smtpHost: process.env.SMTP_HOST?.trim(),
    smtpPort: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 465,
    recipients: customRecipients,
    payload,
  });

  if (!emailResult.ok) {
    console.error('[Email] Error al enviar el correo por SMTP:', emailResult.error);
    return {
      status: 502,
      body: {
        success: false,
        message: 'No se pudo enviar el correo electrónico. Verifica que SMTP_USER y SMTP_PASS (Contraseña de aplicación de 16 letras de Google) sean correctos.',
      },
    };
  }

  return {
    status: 200,
    body: { success: true, message: 'Tu solicitud ha sido recibida correctamente. Nos pondremos en contacto contigo de forma inmediata.' },
  };
}
