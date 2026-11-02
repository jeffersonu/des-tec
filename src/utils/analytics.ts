/**
 * Módulo de integración segura con Google Analytics 4 (GA4)
 * Cumple con OWASP (validación estricta de ID contra XSS) y Ley 1581 de 2012
 * (no envío de datos personales identificables - PII - ni rastreo invasivo).
 */

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

// Expresión regular estricta para validar el ID de medición de GA4 (ej: G-1A2B3C4D5E)
const GA_MEASUREMENT_ID_REGEX = /^G-[A-Z0-9]{6,15}$/i;

// Lista negra de claves sensibles (PII) que nunca deben enviarse a Google Analytics
// por cumplimiento de la Ley 1581 de 2012 (Habeas Data en Colombia) y políticas de GA4.
const FORBIDDEN_PII_KEYS = [
  'email',
  'correo',
  'phone',
  'telefono',
  'celular',
  'whatsapp',
  'name',
  'nombre',
  'cedula',
  'nit',
  'documento',
  'direccion',
  'address',
  'ip',
];

let isInitialized = false;

/**
 * Obtiene y valida el Measurement ID desde las variables de entorno de Vite.
 * Retorna null si no está configurado, es el placeholder por defecto o no cumple el formato.
 */
export function getValidMeasurementId(): string | null {
  const rawId = import.meta.env.VITE_GA_MEASUREMENT_ID?.trim();
  if (!rawId || rawId === 'G-XXXXXXXXXX') {
    return null;
  }
  if (!GA_MEASUREMENT_ID_REGEX.test(rawId)) {
    console.warn('[Analytics] El VITE_GA_MEASUREMENT_ID no tiene un formato válido (G-XXXXXXXXXX).');
    return null;
  }
  return rawId.toUpperCase();
}

/**
 * Inicializa Google Analytics 4 inyectando el script oficial de gtag.js de forma asíncrona
 * únicamente si existe un ID de medición válido configurado.
 */
export function initGA(): void {
  if (typeof window === 'undefined' || isInitialized) return;

  const measurementId = getValidMeasurementId();
  if (!measurementId) return;

  // Evitar inyección duplicada si el script ya existe en el DOM
  const existingScript = document.querySelector(
    `script[src^="https://www.googletagmanager.com/gtag/js"]`
  );
  if (!existingScript) {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
    document.head.appendChild(script);
  }

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer.push(args);
  };

  window.gtag('js', new Date());

  // Configuración endurecida de privacidad y seguridad de cookies:
  // - send_page_view: false porque en React SPA controlamos las vistas por cada cambio de ruta.
  // - cookie_flags: 'SameSite=Lax;Secure' para proteger las cookies de analítica en HTTPS.
  // - anonymize_ip: true por buenas prácticas de privacidad de datos.
  window.gtag('config', measurementId, {
    send_page_view: false,
    cookie_flags: 'SameSite=Lax;Secure',
    anonymize_ip: true,
  });

  isInitialized = true;
}

/**
 * Registra una vista de página (Page View) en aplicaciones SPA (React Router).
 */
export function trackPageView(path: string, title?: string): void {
  if (typeof window === 'undefined') return;
  const measurementId = getValidMeasurementId();
  if (!measurementId || typeof window.gtag !== 'function') return;

  window.gtag('event', 'page_view', {
    page_path: path,
    page_title: title || document.title,
    page_location: window.location.origin + path,
    send_to: measurementId,
  });
}

/**
 * Registra un evento personalizado (ej. clic en WhatsApp, envío de formulario, descarga PWA)
 * filtrando automáticamente cualquier dato personal (PII) antes de enviarlo.
 */
export function trackEvent(
  eventName: string,
  params?: Record<string, string | number | boolean>
): void {
  if (typeof window === 'undefined') return;
  const measurementId = getValidMeasurementId();
  if (!measurementId || typeof window.gtag !== 'function') return;

  // Saneamiento del nombre del evento (solo alfanumérico y guion bajo, máx 40 caracteres según GA4)
  const safeEventName = eventName.replace(/[^a-zA-Z0-9_]/g, '_').slice(0, 40);

  const sanitizedParams: Record<string, string | number | boolean> = {};
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      const lowerKey = key.toLowerCase();
      const isForbidden = FORBIDDEN_PII_KEYS.some((pii) => lowerKey.includes(pii));
      if (!isForbidden) {
        sanitizedParams[key] =
          typeof value === 'string' ? value.slice(0, 100) : value;
      }
    }
  }

  window.gtag('event', safeEventName, sanitizedParams);
}
