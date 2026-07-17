import React, { useState, useEffect, useRef } from 'react';
import { ContactFormData, AppConfig, CurrencyCode } from '../../types';
import { Send, CheckCircle2, AlertTriangle, Mail, Phone, MapPin } from 'lucide-react';
import { motion } from 'motion/react';
import Magnetic from '../ui/Magnetic';
import { defaultBudgetConfig } from '../../data';
import { usePWA } from '../../context/PWAContext';
import { saveOfflineSubmission } from '../../utils/offlineDb';

interface ContactProps {
  config: AppConfig;
}

export default function Contact({ config }: ContactProps) {
  const { isOnline, refreshQueueCount } = usePWA();
  const [isOfflineSubmitted, setIsOfflineSubmitted] = useState(false);
  const [currency, setCurrency] = useState<CurrencyCode>('USD');
  const [formData, setFormData] = useState<ContactFormData>({
    nombre: '',
    empresa: '',
    correo: '',
    whatsapp: '',
    ciudad: '',
    servicio: 'web-dev',
    presupuesto: 'mid',
    mensaje: '',
  });

  const [errors, setErrors] = useState<Partial<ContactFormData>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // --- Turnstile & Security State & Refs ---
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileError, setTurnstileError] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState(''); // Hidden honeypot trap for bots

  const turnstileContainerRef = useRef<HTMLDivElement>(null);
  const turnstileWidgetIdRef = useRef<string | null>(null);

  // Dynamic loading and rendering of Cloudflare Turnstile
  useEffect(() => {
    if (!isOnline) {
      setTurnstileToken(null);
      setTurnstileError(null);
      return;
    }

    let active = true;
    const scriptId = 'cloudflare-turnstile-script';

    // Callback when Turnstile script has loaded and API is ready
    const initTurnstile = () => {
      if (!active || !turnstileContainerRef.current || !(window as any).turnstile) return;

      // 13. DÓNDE CONFIGURAR LAS CLAVES DE CLOUDFLARE TURNSTILE:
      // La clave del sitio (Site Key) se configura mediante la variable de entorno VITE_TURNSTILE_SITE_KEY.
      // Se utiliza una clave de prueba de Cloudflare por defecto para que funcione en entornos de sandbox sin configuración adicional.
      const siteKey = (import.meta as any).env.VITE_TURNSTILE_SITE_KEY || '1x00000000000000000000AA';

      try {
        // Clear previous widget if any exists
        if (turnstileWidgetIdRef.current) {
          (window as any).turnstile.remove(turnstileWidgetIdRef.current);
        }

        // Render Turnstile explicitly
        const widgetId = (window as any).turnstile.render(turnstileContainerRef.current, {
          sitekey: siteKey,
          theme: 'light',
          callback: (token: string) => {
            setTurnstileToken(token);
            setTurnstileError(null);
            setApiError(null);
          },
          'expired-callback': () => {
            setTurnstileToken(null);
          },
          'error-callback': () => {
            setTurnstileToken(null);
            setTurnstileError('Error de verificación con Turnstile. Intenta recargar la página.');
          },
        });

        turnstileWidgetIdRef.current = widgetId;
      } catch (err) {
        console.error('[Turnstile] Error rendering widget:', err);
      }
    };

    // If script is not present, inject it dynamically
    let script = document.getElementById(scriptId) as HTMLScriptElement;
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        if ((window as any).turnstile) {
          (window as any).turnstile.ready(initTurnstile);
        }
      };
      script.onerror = () => {
        console.warn('[Turnstile] Could not load verification script. Operating in fallback mode.');
        setTurnstileToken('mock-token-sandbox-fallback');
      };
      document.body.appendChild(script);
    } else {
      // Script already exists. If turnstile is loaded, render immediately.
      if ((window as any).turnstile) {
        (window as any).turnstile.ready(initTurnstile);
      }
    }

    return () => {
      active = false;
      // Cleanup Turnstile widget on unmount
      if (turnstileWidgetIdRef.current && (window as any).turnstile) {
        try {
          (window as any).turnstile.remove(turnstileWidgetIdRef.current);
        } catch (e) {
          // ignore cleanup errors if unmounted
        }
      }
    };
  }, [isOnline]);

  // 13. DÓNDE SE RECOGE Y PROCESA EL FORMULARIO EN EL CLIENTE
  const validate = () => {
    const tempErrors: Partial<ContactFormData> = {};
    if (!formData.nombre.trim()) tempErrors.nombre = 'El nombre completo es requerido.';
    if (!formData.correo.trim()) {
      tempErrors.correo = 'El correo electrónico es requerido.';
    } else if (!/\S+@\S+\.\S+/.test(formData.correo)) {
      tempErrors.correo = 'Ingresa un correo electrónico válido.';
    }
    if (!formData.whatsapp.trim()) tempErrors.whatsapp = 'El WhatsApp es requerido para el contacto ágil.';
    if (!formData.mensaje.trim()) tempErrors.mensaje = 'Cuéntanos un poco sobre tu requerimiento.';
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Reset API error log
    setApiError(null);
    setIsSending(true);

    if (!isOnline) {
      try {
        // Save to offline database
        await saveOfflineSubmission(formData);
        await refreshQueueCount();
        setIsSending(false);
        setIsOfflineSubmitted(true);
        setIsSubmitted(true);
        // Reset form fields
        setFormData({
          nombre: '',
          empresa: '',
          correo: '',
          whatsapp: '',
          ciudad: '',
          servicio: 'web-dev',
          presupuesto: 'mid',
          mensaje: '',
        });
        setHoneypot('');
      } catch (err) {
        console.error('[Des-Tec PWA] Error saving offline contact submission:', err);
        setIsSending(false);
        setApiError('No se pudo almacenar la solicitud localmente para envío posterior.');
      }
    } else {
      // --- Security Verification Filters ---

      // A. Honeypot decoy validation
      if (honeypot) {
        // Silently mock success to trap the bot
        setIsSending(false);
        setIsOfflineSubmitted(false);
        setIsSubmitted(true);
        setFormData({
          nombre: '',
          empresa: '',
          correo: '',
          whatsapp: '',
          ciudad: '',
          servicio: 'web-dev',
          presupuesto: 'mid',
          mensaje: '',
        });
        setHoneypot('');
        return;
      }

      // B. Turnstile Validation check
      if (!turnstileToken) {
        setIsSending(false);
        setApiError('Por favor, completa la verificación de seguridad (Turnstile) antes de enviar.');
        return;
      }

      try {
        // 13. DÓNDE SE ENVÍA EL TOKEN PARA VALIDACIÓN AL SERVIDOR
        // Se hace un POST a la API local /api/verify-contact pasando el token y los datos.
        const response = await fetch('/api/verify-contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...formData,
            turnstileToken,
            honeypot,
            isOfflineSync: false,
          }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          setIsSending(false);
          setIsOfflineSubmitted(false);
          setIsSubmitted(true);
          // Reset form fields
          setFormData({
            nombre: '',
            empresa: '',
            correo: '',
            whatsapp: '',
            ciudad: '',
            servicio: 'web-dev',
            presupuesto: 'mid',
            mensaje: '',
          });
          setHoneypot('');
          setTurnstileToken(null);
          
          // Reset Turnstile widget state for subsequent entries
          if (turnstileWidgetIdRef.current && (window as any).turnstile) {
            (window as any).turnstile.reset(turnstileWidgetIdRef.current);
          }
        } else {
          setIsSending(false);
          setApiError(data.message || 'La validación de seguridad de Turnstile no ha sido exitosa.');
          
          // Reset Turnstile on failure so user can re-verify easily
          if (turnstileWidgetIdRef.current && (window as any).turnstile) {
            (window as any).turnstile.reset(turnstileWidgetIdRef.current);
          }
        }
      } catch (error) {
        console.error('[Contact] API delivery error:', error);
        setIsSending(false);
        setApiError('Error de red al conectar con el servidor. Por favor, verifica tu conexión e inténtalo de nuevo.');
      }
    }
  };

  return (
    <section id="contacto" className="py-14 relative overflow-hidden bg-[#F7F8FC]">
      {/* Glow spot & radial lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(108, 76, 245,0.06)_0%,rgba(108, 76, 245,0)_70%)] pointer-events-none -z-10 blur-3xl animate-pulse" style={{ animationDuration: '11s' }} />
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(95,141,122,0.03)_0%,rgba(95,141,122,0)_70%)] pointer-events-none -z-10 blur-2xl" />

      {/* Sutiles patrones tecnológicos */}
      <div className="absolute inset-0 bg-[radial-gradient(var(--color-primary)_1px,transparent_1px)] [background-size:28px_28px] opacity-[0.015] pointer-events-none -z-10" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-secondary)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-secondary)_1px,transparent_1px)] [background-size:56px_56px] opacity-[0.012] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* LEFT SIDE: DIRECT CHANNELS & CARD CORES */}
          <motion.div 
            className="col-span-1 lg:col-span-5 text-left space-y-6 flex flex-col justify-between"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-10%" }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.08 }
              }
            }}
          >
            <div className="space-y-4">
              <motion.span 
                variants={{
                  hidden: { opacity: 0, y: 15 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
                }}
                className="text-xs font-sans font-extrabold text-[var(--color-primary)] tracking-widest uppercase bg-[var(--color-primary)]/8 border border-[var(--color-primary)]/15 px-3.5 py-1.5 rounded-full inline-block"
              >
                Contacto Directo
              </motion.span>
              <motion.h2 
                variants={{
                  hidden: { opacity: 0, y: 20, filter: 'blur(4px)' },
                  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
                }}
                className="text-3xl sm:text-4xl font-display font-extrabold text-[var(--color-secondary)] tracking-tight leading-tight"
              >
                Hablemos de tu próximo gran proyecto
              </motion.h2>
              <motion.p 
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
                }}
                className="text-sm sm:text-base text-[var(--color-text-secondary)] font-sans leading-relaxed"
              >
                ¿Listo para escalar al siguiente nivel empresarial? Llena el formulario técnico o comunícate directamente por nuestros canales oficiales. Te enviaremos una cotización formal y detallada en menos de 24 horas hábiles.
              </motion.p>
            </div>

            {/* Direct Connect Elements */}
            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 15 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
              }}
              className="space-y-4 py-4 border-y border-[var(--color-text)]/5"
            >
              <div className="flex items-center space-x-3.5">
                <div className="p-2.5 bg-[var(--color-primary)]/10 rounded-xl border border-[var(--color-primary)]/15 text-[var(--color-primary)]">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="font-sans text-xs">
                  <div className="text-[var(--color-text-secondary)] font-bold uppercase">Enviar Correo</div>
                  <a href={`mailto:${config.correo}`} className="text-[var(--color-secondary)] hover:text-[var(--color-primary)] font-semibold transition-all">
                    {config.correo}
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-3.5">
                <div className="p-2.5 bg-[var(--color-primary)]/10 rounded-xl border border-[var(--color-primary)]/15 text-[var(--color-primary)]">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="font-sans text-xs">
                  <div className="text-[var(--color-text-secondary)] font-bold uppercase">WhatsApp Directo</div>
                  <a href={`https://wa.me/${config.whatsapp.replace(/\+/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-[var(--color-secondary)] hover:text-[var(--color-primary)] font-semibold transition-all">
                    {config.whatsapp}
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-3.5">
                <div className="p-2.5 bg-[var(--color-primary)]/10 rounded-xl border border-[var(--color-primary)]/15 text-[var(--color-primary)]">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="font-sans text-xs">
                  <div className="text-[var(--color-text-secondary)] font-bold uppercase">Sede Central</div>
                  <span className="text-[var(--color-secondary)] font-semibold">
                    {config.ciudad}, {config.pais}
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* RIGHT SIDE: FORM MODULE */}
          <motion.div 
            className="col-span-1 lg:col-span-7 bg-[var(--color-surface)] border border-[var(--color-text)]/10 p-6 sm:p-8 rounded-3xl shadow-sm text-left"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          >
            
            {isSubmitted ? (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 animate-fade-in">
                <div className={`w-16 h-16 rounded-full border flex items-center justify-center ${
                  isOfflineSubmitted
                    ? 'bg-[var(--color-primary)]/15 border-[var(--color-primary)] text-[var(--color-primary)]'
                    : 'bg-[var(--color-secondary)]/15 border-[var(--color-secondary)] text-[var(--color-secondary)]'
                }`}>
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-[var(--color-secondary)] font-sans">
                  {isOfflineSubmitted ? 'Solicitud Guardada' : '¡Solicitud Enviada con Éxito!'}
                </h3>
                <p className="text-sm text-[var(--color-text-secondary)] font-sans max-w-md leading-relaxed">
                  {isOfflineSubmitted ? (
                    "Tu solicitud fue guardada correctamente y será enviada automáticamente cuando recuperes la conexión."
                  ) : (
                    <>
                      Gracias por comunicarte con <strong>{config.nombre}</strong>. Un especialista técnico revisará tu requerimiento y presupuesto de inmediato. Nos pondremos en contacto contigo por correo o WhatsApp.
                    </>
                  )}
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="mt-4 px-5 py-2.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white rounded-xl text-xs font-sans transition-all font-bold"
                >
                  {isOfflineSubmitted ? 'Volver' : 'Enviar otra cotización'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Nombre y Empresa */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-sans font-extrabold text-[var(--color-text)]/80 uppercase tracking-wider">Nombre Completo *</label>
                    <input
                      type="text"
                      placeholder="Ej. Alejandro Silva"
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      className={`w-full bg-[var(--color-background)] border ${errors.nombre ? 'border-red-500' : 'border-[var(--color-text)]/15'} rounded-xl px-3.5 py-2.5 text-xs font-sans text-[var(--color-text)] placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[var(--color-primary)] transition-all`}
                    />
                    {errors.nombre && (
                      <span className="text-[10px] text-red-500 font-sans flex items-center space-x-1">
                        <AlertTriangle className="w-3 h-3 shrink-0" />
                        <span>{errors.nombre}</span>
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-sans font-extrabold text-[var(--color-text)]/80 uppercase tracking-wider">Empresa (Opcional)</label>
                    <input
                      type="text"
                      placeholder="Ej. Nova S.L."
                      value={formData.empresa}
                      onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                      className="w-full bg-[var(--color-background)] border border-[var(--color-text)]/15 rounded-xl px-3.5 py-2.5 text-xs font-sans text-[var(--color-text)] placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[var(--color-primary)] transition-all"
                    />
                  </div>
                </div>

                {/* Correo y WhatsApp */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-sans font-extrabold text-[var(--color-text)]/80 uppercase tracking-wider">Correo Electrónico *</label>
                    <input
                      type="email"
                      placeholder="Ej. alejandro@empresa.com"
                      value={formData.correo}
                      onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                      className={`w-full bg-[var(--color-background)] border ${errors.correo ? 'border-red-500' : 'border-[var(--color-text)]/15'} rounded-xl px-3.5 py-2.5 text-xs font-sans text-[var(--color-text)] placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[var(--color-primary)] transition-all`}
                    />
                    {errors.correo && (
                      <span className="text-[10px] text-red-500 font-sans flex items-center space-x-1">
                        <AlertTriangle className="w-3 h-3 shrink-0" />
                        <span>{errors.correo}</span>
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-sans font-extrabold text-[var(--color-text)]/80 uppercase tracking-wider">Número de WhatsApp *</label>
                    <input
                      type="tel"
                      placeholder="Ej. +34 600 000 000"
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                      className={`w-full bg-[var(--color-background)] border ${errors.whatsapp ? 'border-red-500' : 'border-[var(--color-text)]/15'} rounded-xl px-3.5 py-2.5 text-xs font-sans text-[var(--color-text)] placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[var(--color-primary)] transition-all`}
                    />
                    {errors.whatsapp && (
                      <span className="text-[10px] text-red-500 font-sans flex items-center space-x-1">
                        <AlertTriangle className="w-3 h-3 shrink-0" />
                        <span>{errors.whatsapp}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Ciudad y Servicio */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-sans font-extrabold text-[var(--color-text)]/80 uppercase tracking-wider">Ciudad / País (Opcional)</label>
                    <input
                      type="text"
                      placeholder="Ej. Madrid, España"
                      value={formData.ciudad}
                      onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })}
                      className="w-full bg-[var(--color-background)] border border-[var(--color-text)]/15 rounded-xl px-3.5 py-2.5 text-xs font-sans text-[var(--color-text)] placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[var(--color-primary)] transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-sans font-extrabold text-[var(--color-text)]/80 uppercase tracking-wider">Servicio Requerido *</label>
                    <select
                      value={formData.servicio}
                      onChange={(e) => setFormData({ ...formData, servicio: e.target.value })}
                      className="w-full bg-[var(--color-background)] border border-[var(--color-text)]/15 rounded-xl px-3.5 py-2.5 text-xs font-sans text-[var(--color-text)] focus:outline-none focus:bg-white focus:border-[var(--color-primary)] transition-all"
                    >
                      <option value="web-dev">Desarrollo Web & Apps Premium</option>
                      <option value="automation">Automatización Avanzada & n8n</option>
                      <option value="integrations">Integraciones API & CRM</option>
                      <option value="whatsapp-chatbots">Chatbots Inteligentes WhatsApp</option>
                      <option value="seo-speed">SEO Técnico & Velocidad Core</option>
                      <option value="hosting-consulting">Consultoría & Cloud Hosting</option>
                    </select>
                  </div>
                </div>

                {/* Selector de Presupuesto Rediseñado con Selección de Moneda */}
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <label className="text-[11px] font-sans font-extrabold text-[var(--color-text)]/80 uppercase tracking-wider block">
                      Presupuesto Estimado *
                    </label>
                    
                    {/* Selector de Moneda Premium */}
                    <div className="flex items-center space-x-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200 self-start sm:self-auto">
                      {(['COP', 'USD', 'EUR'] as CurrencyCode[]).map((cur) => (
                        <button
                          key={cur}
                          type="button"
                          onClick={() => {
                            setCurrency(cur);
                          }}
                          className={`px-3 py-1 text-[9px] font-sans font-extrabold rounded-md transition-all ${
                            currency === cur
                              ? 'bg-[var(--color-primary)] text-white shadow-[0_2px_6px_rgba(108, 76, 245,0.2)]'
                              : 'text-gray-500 hover:text-[var(--color-secondary)]'
                          }`}
                        >
                          {cur}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Rangos de Inversión */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {defaultBudgetConfig[currency].ranges.map((btn) => {
                      const isActive = formData.presupuesto === btn.key;
                      return (
                        <button
                          key={btn.key}
                          type="button"
                          onClick={() => setFormData({ ...formData, presupuesto: btn.key })}
                          className={`relative p-3.5 rounded-xl text-left border transition-all duration-300 flex flex-col justify-between overflow-hidden group ${
                            isActive
                              ? 'bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-primary)]/5 border-[var(--color-primary)] shadow-[0_8px_20px_rgba(108, 76, 245,0.06)]'
                              : 'bg-[var(--color-background)] border-[var(--color-text)]/10 hover:border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          {/* Indicator and Label */}
                          <div className="flex items-center justify-between w-full mb-1">
                            <span className={`text-[8px] font-sans font-bold tracking-wider uppercase ${isActive ? 'text-[var(--color-primary)]' : 'text-gray-400'}`}>
                              {btn.key === 'low' ? 'Iniciación' : btn.key === 'mid' ? 'Crecimiento' : 'Empresarial'}
                            </span>
                            <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all ${isActive ? 'border-[var(--color-primary)] bg-[var(--color-primary)]' : 'border-slate-300'}`}>
                              {isActive && <div className="w-1 h-1 rounded-full bg-white" />}
                            </div>
                          </div>
                          
                          <span className={`text-xs sm:text-sm font-display font-extrabold tracking-tight ${isActive ? 'text-[var(--color-secondary)]' : 'text-[var(--color-text-secondary)]'}`}>
                            {btn.label}
                          </span>
                          
                          <span className="text-[9px] text-gray-400 font-sans mt-0.5 block leading-normal">
                            {btn.key === 'low' 
                              ? 'MVP o landing page inicial' 
                              : btn.key === 'mid' 
                              ? 'Plataforma completa optimizada' 
                              : 'Ecosistema robusto a medida'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>


                {/* Mensaje */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-sans font-extrabold text-[var(--color-text)]/80 uppercase tracking-wider">Detalles del Requerimiento *</label>
                  <textarea
                    placeholder="Describe los alcances clave de tu proyecto, flujos a automatizar o metas que buscas cumplir..."
                    value={formData.mensaje}
                    onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                    rows={4}
                    className={`w-full bg-[var(--color-background)] border ${errors.mensaje ? 'border-red-500' : 'border-[var(--color-text)]/15'} rounded-xl px-3.5 py-2.5 text-xs font-sans text-[var(--color-text)] placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[var(--color-primary)] transition-all`}
                  />
                  {errors.mensaje && (
                    <span className="text-[10px] text-red-500 font-sans flex items-center space-x-1">
                      <AlertTriangle className="w-3 h-3 shrink-0" />
                      <span>{errors.mensaje}</span>
                    </span>
                  )}
                </div>

                {/* Honeypot field to block automated bot submissions - completely hidden from human eyes */}
                <div style={{ position: 'absolute', opacity: 0, left: '-5000px', top: '-5000px', height: 0, width: 0, overflow: 'hidden' }} aria-hidden="true">
                  <input
                    type="text"
                    name="website"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                {/* Cloudflare Turnstile integration (Frontend validation) */}
                {isOnline && (
                  <div className="flex flex-col items-center sm:items-start space-y-2 py-1">
                    <div ref={turnstileContainerRef} id="turnstile-container" className="min-h-[65px]" />
                  </div>
                )}

                {/* Error handling messages (without tech jargon to stay user-friendly) */}
                {(apiError || turnstileError) && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-600 rounded-xl text-xs font-sans flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-red-500" />
                    <span>{apiError || turnstileError}</span>
                  </div>
                )}

                {/* Submit button */}
                <Magnetic>
                  <button
                    type="submit"
                    disabled={isSending}
                    id="submit-contact-form-btn"
                    className="group w-full bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-primary-hover)] to-[var(--color-primary)] bg-[length:200%_auto] hover:bg-[right_center] disabled:from-[var(--color-text)]/15 disabled:to-[var(--color-text)]/25 text-white font-sans text-xs font-bold py-3.5 rounded-xl border border-[var(--color-primary)]/10 transition-all duration-500 flex items-center justify-center space-x-2 shadow-[0_4px_15px_rgba(108, 76, 245,0.2)] hover:shadow-[0_4px_22px_rgba(108, 76, 245,0.45)] cursor-pointer hover:scale-[1.015] active:scale-[0.985]"
                  >
                    <span>
                      {isSending 
                        ? 'PROCESANDO SOLICITUD...' 
                        : isOnline 
                        ? 'SOLICITAR COTIZACIÓN FORMAL' 
                        : 'GUARDAR SOLICITUD (SIN CONEXIÓN)'}
                    </span>
                    <Send className={`w-4 h-4 transition-transform duration-300 ${isSending ? 'animate-pulse' : 'group-hover:translate-x-1 group-hover:-translate-y-0.5'}`} />
                  </button>
                </Magnetic>
              </form>
            )}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
