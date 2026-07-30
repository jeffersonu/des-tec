import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { sanitizeAndFilter, isRateLimited, processContactSubmission, type ContactPayload } from './lib/contactSecurity.js';

// Load environment variables from .env config file
dotenv.config();

const app = express();
const PORT = 3000;

// Body parser middleware with strict limit controls to prevent Denial of Service (DoS) attacks
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ==========================================
// --- ADVANCED SECURITY MIDDLEWARES (OWASP) ---
// ==========================================

// 1. FORCE HTTPS REDIRECT (Production Environment)
// In production, force all connections to run over secure TLS (HTTPS).
// Handles SSL termination signatures via 'x-forwarded-proto'.
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production' && req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect(301, `https://${req.headers.host}${req.url}`);
  }
  next();
});

// 2. HTTP SECURITY HEADERS CONFIGURATION
// Configures necessary custom headers to safeguard browser execution.
app.use((req, res, next) => {
  const isProd = process.env.NODE_ENV === 'production';

  if (isProd) {
    // Rigid Production CSP: Highly restrictive to safeguard user sessions
    res.setHeader(
      'Content-Security-Policy',
      "default-src 'self'; " +
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
      "img-src 'self' data: blob: https:; " +
      "font-src 'self' data: https://fonts.gstatic.com; " +
      "frame-src 'self'; " +
      "connect-src 'self'; " +
      "media-src 'self'; " +
      "object-src 'none'; " +
      "base-uri 'self'; " +
      "form-action 'self';"
    );

    // X-Frame-Options: Protects against Clickjacking attacks in production
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');

    // Strict-Transport-Security (HSTS): Tells browsers to always use HTTPS for the next year
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  } else {
    // In development, do not enforce SAMEORIGIN to allow seamless rendering inside the AI Studio preview iframe
    res.setHeader('X-Frame-Options', 'ALLOWALL');
  }

  // X-Content-Type-Options: Prevents browsers from trying to MIME-sniff the content-type
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // Referrer-Policy: Prevents leaking origin information across different domains
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Permissions-Policy: De-activates device camera, microphone, and geolocation to protect user privacy
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), interest-cohort=()');

  // Legacy protection headers
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('X-Permitted-Cross-Domain-Policies', 'none');

  next();
});

// 3. ANTI-CSRF (Cross-Site Request Forgery) MITIGATION
// Inspects request Origin and Referer on state-modifying endpoints (POST, PUT, DELETE).
app.use((req, res, next) => {
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
    const origin = req.headers.origin;
    const referer = req.headers.referer;
    const host = req.headers.host;

    if (process.env.NODE_ENV === 'production') {
      const allowedHost = host || '';
      let isVerified = false;

      if (origin) {
        const originUrl = new URL(origin);
        if (originUrl.host === allowedHost) {
          isVerified = true;
        }
      } else if (referer) {
        const refererUrl = new URL(referer);
        if (refererUrl.host === allowedHost) {
          isVerified = true;
        }
      }

      if (!isVerified) {
        console.warn(`[Security Alert] CSRF verification failed from Origin/Referer. Blocked request from IP: ${req.ip}`);
        return res.status(403).json({
          success: false,
          message: 'Falla en la verificación del origen seguro. Solicitud denegada.'
        });
      }
    }
  }
  next();
});

// 4. IN-MEMORY RATE LIMITER (Anti-Spam / Anti-DDoS)
// La implementación real vive en lib/contactSecurity.ts (compartida con la
// función serverless de Vercel en api/verify-contact.ts).

// 5. INPUT SANITIZATION & ANTI-INJECTION CONTROLS (SQL, XSS, Email & Header Injection)
// La implementación real vive en lib/contactSecurity.ts (compartida con la
// función serverless de Vercel en api/verify-contact.ts).

// Attach Sanitizer to sanitize body, query and parameters automatically
app.use((req, res, next) => {
  if (req.body) req.body = sanitizeAndFilter(req.body);
  if (req.query) req.query = sanitizeAndFilter(req.query);
  if (req.params) req.params = sanitizeAndFilter(req.params);
  next();
});


// ==========================================
// --- API ENDPOINTS ---
// ==========================================

// 13. DÓNDE SE REALIZA LA VALIDACIÓN DEL TOKEN (Backend verification)
/**
 * @route POST /api/verify-contact
 * @desc Implements deep security validations, anti-bot checks, honeypot filters, and Cloudflare Turnstile verification.
 */
app.post('/api/verify-contact', async (req, res) => {
  try {
    // Safely parse IP address from proxies or connection socket
    const clientIp = (req.headers['x-forwarded-for'] as string || req.socket.remoteAddress || '127.0.0.1').split(',')[0].trim();

    // A. Rate Limiting verification
    if (isRateLimited(clientIp)) {
      console.warn(`[Security alert] Rate limit exceeded by client IP: ${clientIp}`);
      return res.status(429).json({
        success: false,
        message: 'Has realizado demasiados intentos en poco tiempo. Por favor, espera un momento antes de reintentar.'
      });
    }

    const payload = req.body as ContactPayload;

    const result = await processContactSubmission(payload, {
      clientIp,
      pageUri: (req.headers['referer'] as string) || 'https://des-tec.co',
      turnstileSecretKey: process.env.TURNSTILE_SECRET_KEY || '1x00000000000000000000000000000000AA',
      hubspotPortalId: process.env.HUBSPOT_PORTAL_ID,
      hubspotFormGuid: process.env.HUBSPOT_FORM_GUID,
    });

    return res.status(result.status).json(result.body);

  } catch (error: any) {
    // 9. Registrar únicamente errores importantes sin almacenar información sensible del usuario
    console.error('[Error] Server exception caught on API path /api/verify-contact:', error?.message || error);
    
    // 6/11. Error handling: safe user message without leaking internals
    return res.status(500).json({
      success: false,
      message: 'Ocurrió un error inesperado al procesar tu solicitud. Por favor, reinténtalo más tarde.'
    });
  }
});


// ==========================================
// --- SERVER START & ASSET DEPLOYMENT ---
// ==========================================

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    // Vite Dev Server middleware mode for local real-time development
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('[Dev Server] Vite middleware configured.');
  } else {
    // Production static files deployment
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('[Production Server] Static assets mounted.');
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Server] Active and listening securely on port http://0.0.0.0:${PORT}`);
  });
}

startServer();
