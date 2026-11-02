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

// ==========================================
// 1. SANITIZACIÓN / ANTI-INYECCIÓN (XSS, SQL, header injection)
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
  // Nota: No codificamos '/' para no romper URLs legítimas, fechas (DD/MM/AAAA), rutas o formatos telefónicos
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

  // Limpieza preventiva si el mapa crece más allá del umbral seguro
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
    // Si la entrada anterior expiró por completo, reiniciamos el contador con la petición actual
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
    // En algunas WebViews o PWAs instaladas en Android, el navegador omite Origin/Referer en peticiones same-origin
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
// 5. ENVÍO DEL LEAD A HUBSPOT (Forms API con fallback automático de propiedades)
// ==========================================
export async function submitToHubSpot(params: {
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
}): Promise<{ ok: boolean; error?: string; isBlockedEmail?: boolean }> {
  const hubspotUrl = `https://api.hsforms.com/submissions/v3/integration/submit/${params.portalId}/${params.formGuid}`;
  const context = {
    pageUri: params.pageUri || 'https://des-tec.co',
    pageName: 'Des-Tec — Formulario de contacto',
  };

  const enrichedMessage = [
    params.mensaje,
    '',
    '--- Detalles de la Cotización ---',
    `Servicio: ${params.servicio || 'No especificado'}`,
    `Presupuesto: ${params.presupuesto || 'No especificado'}`,
    params.empresa ? `Empresa: ${params.empresa}` : '',
    params.ciudad ? `Ciudad: ${params.ciudad}` : '',
    params.whatsapp ? `WhatsApp: ${params.whatsapp}` : '',
  ]
    .filter(Boolean)
    .join('\n');

  try {
    const fullFields = [
      { name: 'firstname', value: params.nombre },
      { name: 'email', value: params.correo },
      ...(params.empresa ? [{ name: 'company', value: params.empresa }] : []),
      ...(params.whatsapp ? [{ name: 'phone', value: params.whatsapp }] : []),
      ...(params.ciudad ? [{ name: 'city', value: params.ciudad }] : []),
      ...(params.servicio ? [{ name: 'servicio', value: params.servicio }] : []),
      ...(params.presupuesto ? [{ name: 'presupuesto', value: params.presupuesto }] : []),
      { name: 'message', value: params.mensaje },
    ];

    const firstResponse = await fetch(hubspotUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields: fullFields, context }),
    });

    if (firstResponse.ok) {
      return { ok: true };
    }

    const firstErrorText = await firstResponse.text();
    console.warn('[HubSpot] Intento 1 rechazado, probando fallback con campos estándar:', firstErrorText);

    if (firstErrorText.includes('BLOCKED_EMAIL') || firstErrorText.includes('FREE_EMAIL')) {
      return {
        ok: false,
        isBlockedEmail: true,
        error: firstErrorText,
      };
    }

    const fallbackFields = [
      { name: 'firstname', value: params.nombre },
      { name: 'email', value: params.correo },
      ...(params.whatsapp ? [{ name: 'phone', value: params.whatsapp }] : []),
      { name: 'message', value: enrichedMessage },
    ];

    const secondResponse = await fetch(hubspotUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields: fallbackFields, context }),
    });

    if (secondResponse.ok) {
      return { ok: true };
    }

    const minimalFields = [
      { name: 'firstname', value: `${params.nombre} (${params.servicio || 'Contacto'})` },
      { name: 'email', value: params.correo },
    ];

    const thirdResponse = await fetch(hubspotUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields: minimalFields, context }),
    });

    if (thirdResponse.ok) {
      return { ok: true };
    }

    const finalErrorText = await secondResponse.text();
    return { ok: false, error: `HTTP ${secondResponse.status}: ${finalErrorText}` };
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

/**
 * Ejecuta las validaciones y el envío a HubSpot. Asume que el llamador ya
 * hizo: sanitización del body, verificación de origen/CSRF y rate limiting.
 */
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
  const { nombre, empresa, correo, whatsapp, ciudad, servicio, presupuesto, mensaje, honeypot } = payload;

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

  const portalId = opts.hubspotPortalId?.trim();
  const formGuid = opts.hubspotFormGuid?.trim();

  if (!portalId || !formGuid) {
    console.warn('[HubSpot] HUBSPOT_PORTAL_ID / HUBSPOT_FORM_GUID no configurados.');
    return {
      status: 503,
      body: {
        success: false,
        message: 'El servicio de recepción de correo (HUBSPOT_PORTAL_ID / HUBSPOT_FORM_GUID) aún no está configurado en las variables de entorno del servidor.',
      },
    };
  }

  const hubspotResult = await submitToHubSpot({
    portalId,
    formGuid,
    nombre,
    correo,
    empresa,
    whatsapp,
    ciudad,
    servicio,
    presupuesto,
    mensaje,
    pageUri: opts.pageUri,
  });

  if (!hubspotResult.ok) {
    console.error('[HubSpot] El envío del lead falló:', hubspotResult.error);
    if (hubspotResult.isBlockedEmail) {
      return {
        status: 400,
        body: {
          success: false,
          message: 'El formulario de HubSpot tiene bloqueados los correos gratuitos (@gmail.com). Desactiva "Bloquear proveedores de correo gratuitos" en HubSpot o prueba con un correo corporativo.',
        },
      };
    }
    return {
      status: 502,
      body: {
        success: false,
        message: 'No se pudo registrar la solicitud en HubSpot CRM. Verifica que el Portal ID y el Form GUID sean correctos en Vercel.',
      },
    };
  }

  return {
    status: 200,
    body: { success: true, message: 'Tu solicitud ha sido recibida correctamente. Nos pondremos en contacto contigo de forma inmediata.' },
  };
}
