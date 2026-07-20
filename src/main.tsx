import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { TimeThemeInterfaceProvider } from './context/TimeThemeContext.tsx';
import { PWAProvider } from './context/PWAContext.tsx';
import './index.css';

// Intercept and handle benign cross-origin script errors or Turnstile script blocking inside the sandbox iframe
if (typeof window !== 'undefined') {
  const isBenignError = (message: string, filename?: string) => {
    const msg = String(message || '');
    const file = String(filename || '');
    return (
      msg.includes('Script error.') ||
      msg.includes('cloudflare') ||
      msg.includes('turnstile') ||
      file.includes('cloudflare') ||
      file.includes('turnstile')
    );
  };

  // Override window.onerror directly (acts as a strong fallback)
  const originalOnError = window.onerror;
  window.onerror = function (message, source, lineno, colno, error) {
    const msgStr = String(message || '');
    const srcStr = String(source || '');
    if (isBenignError(msgStr, srcStr)) {
      console.warn('[Des-Tec] Suppressed benign sandbox Script error:', msgStr, srcStr);
      return true; // Prevents the error from bubbling to AI Studio's global listener
    }
    if (originalOnError) {
      return originalOnError.apply(this, arguments as any);
    }
    return false;
  };

  // Standard event listeners
  window.addEventListener('error', (event) => {
    if (isBenignError(event.message, event.filename)) {
      event.stopImmediatePropagation();
      event.stopPropagation();
      event.preventDefault();
    }
  }, true);

  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason?.toString() || '';
    if (reason.includes('turnstile') || reason.includes('cloudflare') || reason.includes('Script error.')) {
      event.stopImmediatePropagation();
      event.stopPropagation();
      event.preventDefault();
    }
  }, true);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TimeThemeInterfaceProvider>
      <PWAProvider>
        <App />
      </PWAProvider>
    </TimeThemeInterfaceProvider>
  </StrictMode>,
);
