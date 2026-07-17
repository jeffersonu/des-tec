import React, { createContext, useContext, useState, useEffect } from 'react';
import { Download, RefreshCw, X, Sparkles, Smartphone, Wifi, WifiOff, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getOfflineSubmissions, deleteOfflineSubmission } from '../utils/offlineDb';

interface PWAContextType {
  isInstallable: boolean;
  isStandalone: boolean;
  updateAvailable: boolean;
  installApp: () => Promise<void>;
  updateApp: () => void;
  showInstallPrompt: boolean;
  setShowInstallPrompt: (show: boolean) => void;
  isOnline: boolean;
  offlineQueueCount: number;
  refreshQueueCount: () => Promise<void>;
}

const PWAContext = createContext<PWAContextType | undefined>(undefined);

export const usePWA = () => {
  const context = useContext(PWAContext);
  if (!context) {
    throw new Error('usePWA must be used within a PWAProvider');
  }
  return context;
};

export const PWAProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [showUpdateBanner, setShowUpdateBanner] = useState(false);

  // Connection & Offline synchronization states
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [offlineQueueCount, setOfflineQueueCount] = useState(0);
  const [showStatusIndicator, setShowStatusIndicator] = useState(!navigator.onLine); // Always show initially if offline
  const [showSyncSuccess, setShowSyncSuccess] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const refreshQueueCount = async () => {
    try {
      const submissions = await getOfflineSubmissions();
      setOfflineQueueCount(submissions.length);
    } catch (e) {
      console.error('[Des-Tec PWA] Error reading offline queue:', e);
    }
  };

  const syncOfflineQueue = async () => {
    try {
      const submissions = await getOfflineSubmissions();
      if (submissions.length === 0) return;
      
      setIsSyncing(true);
      
      for (const item of submissions) {
        try {
          // Send cached contact details to the secure validation API
          const response = await fetch('/api/verify-contact', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              ...item,
              isOfflineSync: true,
            }),
          });
          
          if (response.ok) {
            if (item.id !== undefined) {
              await deleteOfflineSubmission(item.id);
            }
          }
        } catch (itemErr) {
          console.error('[Des-Tec PWA] Error syncing offline contact submission:', itemErr);
        }
      }
      
      await refreshQueueCount();
      setIsSyncing(false);
      setShowSyncSuccess(true);
      
      setTimeout(() => {
        setShowSyncSuccess(false);
      }, 5000);
    } catch (err) {
      console.error('[Des-Tec PWA] Sync error:', err);
      setIsSyncing(false);
    }
  };

  // Initial check and periodic refresh of queue
  useEffect(() => {
    refreshQueueCount();
  }, []);

  // Monitor network connection status
  useEffect(() => {
    const handleOnline = async () => {
      setIsOnline(true);
      setShowStatusIndicator(true);
      
      // Auto-sync any queued contact forms in background
      await syncOfflineQueue();
      
      // Auto-hide the "En línea" notification after 4s
      setTimeout(() => {
        setShowStatusIndicator(false);
      }, 4000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowStatusIndicator(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Check display-mode and handle beforeinstallprompt
  useEffect(() => {
    // 1. Standalone check
    const checkStandalone = () => {
      const isStandaloneMedia = window.matchMedia('(display-mode: standalone)').matches;
      const isStandaloneNavigator = (navigator as any).standalone === true;
      setIsStandalone(isStandaloneMedia || isStandaloneNavigator);
    };

    checkStandalone();
    window.matchMedia('(display-mode: standalone)').addEventListener('change', checkStandalone);

    // 2. Install prompt listener
    const handleInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);

      // Check if user has explicitly dismissed the prompt in this session
      const isDismissed = sessionStorage.getItem('pwa-prompt-dismissed') === 'true';
      if (!isDismissed) {
        setShowInstallPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleInstallPrompt);

    // 3. App installed listener
    const handleAppInstalled = () => {
      setIsInstallable(false);
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
      setIsStandalone(true);
      console.log('[Des-Tec PWA] App was installed successfully');
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Register Service Worker with update detection
  useEffect(() => {
    // Only register service worker in production environments to avoid interfering with Vite's HMR or triggering CORS/script warnings in development
    const isDev = (import.meta as any).env.DEV || (import.meta as any).env.MODE === 'development';
    if (isDev) {
      console.log('[Des-Tec PWA] Service Worker registration bypassed in development mode.');
      return;
    }

    if ('serviceWorker' in navigator) {
      // Register service worker
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('[Des-Tec PWA] SW Registered on scope:', registration.scope);

          // If there is already a waiting worker, let's flag it
          if (registration.waiting) {
            setWaitingWorker(registration.waiting);
            setUpdateAvailable(true);
            setShowUpdateBanner(true);
          }

          // Check for future service worker updates
          registration.addEventListener('updatefound', () => {
            const installingWorker = registration.installing;
            if (installingWorker) {
              installingWorker.addEventListener('statechange', () => {
                if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // A new worker was installed and there was a previous one controlling the app
                  setWaitingWorker(installingWorker);
                  setUpdateAvailable(true);
                  setShowUpdateBanner(true);
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error('[Des-Tec PWA] SW Registration failed:', error);
        });

      // Handle controller change (reloads page when the new SW activates)
      let refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
          refreshing = true;
          window.location.reload();
        }
      });
    }
  }, []);

  // Trigger browser installation
  const installApp = async () => {
    if (!deferredPrompt) return;
    
    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`[Des-Tec PWA] Installation choice: ${outcome}`);
      
      // Cleanup regardless of choice
      setDeferredPrompt(null);
      setIsInstallable(false);
      setShowInstallPrompt(false);
    } catch (err) {
      console.error('[Des-Tec PWA] Prompt failed:', err);
    }
  };

  // Skip waiting to trigger instant activation of the new SW version
  const updateApp = () => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
    } else {
      // Fallback reload if SW object isn't referenceable
      window.location.reload();
    }
    setUpdateAvailable(false);
    setShowUpdateBanner(false);
  };

  const dismissInstallPrompt = () => {
    setShowInstallPrompt(false);
    sessionStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  const dismissUpdateBanner = () => {
    setShowUpdateBanner(false);
  };

  return (
    <PWAContext.Provider
      value={{
        isInstallable,
        isStandalone,
        updateAvailable,
        installApp,
        updateApp,
        showInstallPrompt,
        setShowInstallPrompt,
        isOnline,
        offlineQueueCount,
        refreshQueueCount
      }}
    >
      {children}

      {/* Floating PWA UI Elements */}
      <AnimatePresence>
        {/* Connection Status Badge (🟢 En línea / 🔴 Sin conexión) */}
        {showStatusIndicator && (
          <motion.div
            id="pwa-connection-status"
            initial={{ opacity: 0, y: -20, x: 0 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`fixed top-24 right-6 z-[9999] px-4 py-2 rounded-full border backdrop-blur-md shadow-[0_8px_24px_rgba(0,0,0,0.35)] flex items-center gap-2.5 text-xs font-bold tracking-wide transition-all ${
              isOnline
                ? 'bg-emerald-950/85 border-emerald-500/30 text-emerald-300'
                : 'bg-red-950/85 border-red-500/30 text-red-300 animate-pulse'
            }`}
          >
            {isOnline ? (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <Wifi className="w-3.5 h-3.5" />
                <span>🟢 En línea</span>
              </>
            ) : (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                <WifiOff className="w-3.5 h-3.5 animate-bounce" />
                <span>🔴 Sin conexión</span>
              </>
            )}
          </motion.div>
        )}

        {/* Syncing Loader */}
        {isSyncing && (
          <motion.div
            id="pwa-syncing-loader"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-[9999] px-4 py-3 rounded-2xl bg-slate-900/95 border border-[var(--color-primary)]/40 backdrop-blur-md text-white shadow-[0_12px_32px_rgba(0,0,0,0.5)] flex items-center gap-2.5 text-xs font-bold"
          >
            <RefreshCw className="w-4 h-4 text-[var(--color-primary)] animate-spin" />
            <span>Sincronizando datos guardados...</span>
          </motion.div>
        )}

        {/* Sync Success Toast */}
        {showSyncSuccess && (
          <motion.div
            id="pwa-sync-success"
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: 'spring', damping: 20, stiffness: 150 }}
            className="fixed bottom-24 right-6 z-[9999] max-w-[360px] p-4 rounded-2xl bg-slate-900/95 border border-emerald-500/40 backdrop-blur-md text-white shadow-[0_12px_36px_rgba(0,0,0,0.5)] flex items-start gap-3.5 animate-fade-in"
          >
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 shrink-0">
              <Check className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0 text-left">
              <h4 className="text-sm font-bold tracking-tight text-slate-100 mb-0.5">Sincronización Exitosa</h4>
              <p className="text-[11px] text-slate-400 leading-normal">
                ¡Tus solicitudes pendientes fueron enviadas con éxito al recuperar la conexión! 🚀
              </p>
            </div>
            <button
              onClick={() => setShowSyncSuccess(false)}
              className="text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
              aria-label="Cerrar"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {/* 1. ELEGANT PWA INSTALL BADGE/CARD */}
        {showInstallPrompt && isInstallable && !isStandalone && (
          <motion.div
            id="pwa-install-banner"
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: 'spring', damping: 20, stiffness: 150 }}
            className="fixed bottom-6 left-6 z-[9999] max-w-[340px] p-4 rounded-2xl bg-slate-900/90 border border-[var(--color-primary)]/30 backdrop-blur-md text-white shadow-[0_12px_36px_rgba(0,0,0,0.5)] flex items-start gap-3.5"
          >
            <div className="p-2 bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 rounded-xl text-[var(--color-primary)] shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            
            <div className="flex-1 min-w-0 text-left">
              <div className="flex items-center gap-1.5 mb-1">
                <h4 className="text-sm font-bold tracking-tight text-slate-100">Instalar Des-Tec</h4>
                <Sparkles className="w-3.5 h-3.5 text-[var(--color-primary)]" />
              </div>
              <p className="text-[11px] text-slate-400 leading-normal mb-3">
                Instala la aplicación en tu pantalla de inicio para navegar más rápido y acceder sin conexión.
              </p>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={installApp}
                  className="px-3.5 py-1.5 bg-[var(--color-primary)] hover:bg-[#d88949] text-xs font-semibold rounded-lg text-white transition-all cursor-pointer flex items-center gap-1.5 shadow-sm shadow-[var(--color-primary)]/15"
                >
                  <Download className="w-3.5 h-3.5" />
                  Instalar
                </button>
                <button
                  onClick={dismissInstallPrompt}
                  className="px-2.5 py-1.5 bg-slate-800/80 hover:bg-slate-850 border border-slate-700/50 text-xs font-semibold rounded-lg text-slate-300 transition-all cursor-pointer"
                >
                  Más tarde
                </button>
              </div>
            </div>

            <button
              onClick={dismissInstallPrompt}
              className="text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
              aria-label="Cerrar"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {/* 2. PREMIUM APP UPDATE ALERT / TOAST */}
        {showUpdateBanner && updateAvailable && (
          <motion.div
            id="pwa-update-banner"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] w-[90%] max-w-[460px] p-4 rounded-2xl bg-slate-900/95 border border-[var(--color-primary)]/40 backdrop-blur-md text-white shadow-[0_20px_40px_rgba(0,0,0,0.6)] flex items-start gap-4"
          >
            <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 shrink-0">
              <RefreshCw className="w-5 h-5 animate-spin-slow" />
            </div>

            <div className="flex-1 min-w-0 text-left">
              <h4 className="text-sm font-bold tracking-tight text-slate-100 mb-1">¡Nueva actualización disponible!</h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-3">
                Hemos subido mejoras importantes y nuevas características para ti. Actualiza ahora de forma instantánea.
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={updateApp}
                  className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-xs font-bold rounded-lg text-slate-950 transition-all cursor-pointer flex items-center gap-1.5 shadow-sm shadow-emerald-500/20"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Actualizar Ahora
                </button>
                <button
                  onClick={dismissUpdateBanner}
                  className="px-3 py-1.5 bg-slate-800/80 hover:bg-slate-850 border border-slate-700/40 text-xs font-semibold rounded-lg text-slate-300 transition-all cursor-pointer"
                >
                  Ignorar
                </button>
              </div>
            </div>

            <button
              onClick={dismissUpdateBanner}
              className="text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
              aria-label="Cerrar"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </PWAContext.Provider>
  );
};
