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

  // A. Protege contra Email / Header Injection (quita saltos de línea en campos tipo metadata)
  if (!isLongMessageField) {
    clean = clean.replace(/[\r\n]+/g, ' ');
  }

  // B. Protege contra HTML Injection & XSS
  clean = clean
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');

  // C. Defensa Anti-SQL Injection
  const sqlKeywords = [
    /select\s+.*\s+from/gi,
    /union\s+select/gi,
    /insert\s+into/gi,
    /delete\s+from/gi,
    /drop\s+table/gi,
    /update\s+.*\s+set/gi,
    /or\s+1\s*=\s*1/gi,
    /or\s+['"]1['"]\s*=\s*['"]1['"]/gi,
  ];
  sqlKeywords.forEach((pattern) => {
    clean = clean.replace(pattern, '[REDACTED_SQL_SIGNATURE]');
  });

  // D. Patrones adicionales de inyección basada en script
  const scriptPatterns = [
    /javascript:/gi,
    /onerror=/gi,
    /onload=/gi,
    /eval\s*\(/gi,
    /<script/gi,
    /<\/script>/gi,
  ];
  scriptPatterns.forEach((pattern) => {
    clean = clean.replace(pattern, '[REDACTED_SCRIPT_SIGNATURE]');
  });

  return clean.trim();
}

// ==========================================
// 2. RATE LIMITING EN MEMORIA (anti-spam / anti-DDoS básico)
// ==========================================
// NOTA IMPORTANTE PARA VERCEL: en un entorno serverless, cada instancia de la
// función puede ejecutarse en un proceso distinto, así que este contador NO
// se comparte de forma perfecta entre invocaciones concurrentes. Sigue
// aportando una primera barrera (frena ráfagas dentro de la misma instancia
// "caliente"), pero si en el futuro necesitas un límite estricto y 100%
// confiable entre todas las instancias, lo ideal es un almacén externo como
// Vercel KV / Upstash Redis. Para el volumen normal de un formulario de
// contacto, esto es suficiente.
const ipRequests = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minuto
const MAX_REQUESTS_PER_WINDOW = 5; // Máx. 5 solicitudes por ventana

export function isRateLimited(ip: string): boolean {
  const now = Date.now();
  if (!ipRequests.has(ip)) {
    ipRequests.set(ip, [now]);
    return false;
  }

  const timestamps = ipRequests.get(ip)!.filter((t) => now - t < RATE_LIMIT_WINDOW);
  if (timestamps.length >= MAX_REQUESTS_PER_WINDOW) {
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
