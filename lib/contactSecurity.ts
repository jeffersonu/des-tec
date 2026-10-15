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

  const origin = getHeader('origin');
  const referer = getHeader('referer');
  const host = getHeader('host') || '';

  try {
    if (origin) {
      const originUrl = new URL(origin);
      if (originUrl.host === host) return true;
    } else if (referer) {
      const refererUrl = new URL(referer);
      if (refererUrl.host === host) return true;
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
// 5. ENVÍO DEL LEAD A HUBSPOT (Forms API)
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

  // C. Filtro heurístico anti-spam (reemplaza la verificación de Cloudflare Turnstile,
  // desactivada a petición del cliente). Se aplica siempre, tanto en envíos online
  // como en sincronizaciones offline, junto con el honeypot y el rate limiting ya
  // aplicados antes de llegar aquí.
  {
    const blockWords = ['viagra', 'cialis', 'bitcoin', 'lottery', 'sex', 'casino', 'free money'];
    const textToAnalyze = `${nombre} ${mensaje}`.toLowerCase();
    if (blockWords.some((word) => textToAnalyze.includes(word))) {
      console.warn(`[Security Alert] Patrón spam detectado desde IP: ${opts.clientIp}`);
      return { status: 400, body: { success: false, message: 'La solicitud contiene patrones de contenido bloqueados por seguridad.' } };
    }
  }

  console.log(`[Database Sync] Formulario validado y procesado correctamente desde IP: ${opts.clientIp}`);

  // D. Envío del lead a HubSpot
  if (opts.hubspotPortalId && opts.hubspotFormGuid) {
    const hubspotResult = await submitToHubSpot({
      portalId: opts.hubspotPortalId,
      formGuid: opts.hubspotFormGuid,
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
      // No bloqueamos la respuesta al usuario por un fallo de HubSpot: el mensaje ya pasó
      // la validación de seguridad. Solo lo registramos para revisión manual.
    } else {
      console.log('[HubSpot] Lead enviado correctamente.');
    }
  } else {
    console.warn('[HubSpot] HUBSPOT_PORTAL_ID / HUBSPOT_FORM_GUID no configurados: el lead NO se envió a HubSpot.');
  }

  return {
    status: 200,
    body: { success: true, message: 'Tu solicitud ha sido recibida correctamente. Nos pondremos en contacto contigo de forma inmediata.' },
  };
}
