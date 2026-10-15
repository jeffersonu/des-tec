import React, { useState } from 'react';
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
    aceptaHabeasData: true,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Traduce los valores técnicos internos (usados para la lógica de la UI) a
  // texto legible, tal como lo ve el usuario en pantalla, antes de enviarlos
  // a HubSpot / correo. Así el formulario sigue funcionando igual visualmente,
  // pero lo que llega al CRM y al correo es legible en vez de claves como
  // "web-dev" o "mid".
  const servicioLabels: Record<string, string> = {
    'web-dev': 'Desarrollo Web & Apps Premium',
    'automation': 'Automatización Avanzada & n8n',
    'integrations': 'Integraciones API & CRM',
    'whatsapp-chatbots': 'Chatbots Inteligentes WhatsApp',
    'seo-speed': 'SEO Técnico & Velocidad Core',
    'hosting-consulting': 'Consultoría & Cloud Hosting',
  };

  const getReadableFormData = (data: ContactFormData): ContactFormData => {
    const presupuestoLabel =
      defaultBudgetConfig[currency].ranges.find((r) => r.key === data.presupuesto)?.label || data.presupuesto;
    return {
      ...data,
      servicio: servicioLabels[data.servicio] || data.servicio,
      presupuesto: presupuestoLabel,
    };
  };

  // --- Security State ---
  const [apiError, setApiError] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState(''); // Hidden honeypot trap for bots

  // 13. DÓNDE SE RECOGE Y PROCESA EL FORMULARIO EN EL CLIENTE
  const validate = () => {
    const tempErrors: Partial<Record<keyof ContactFormData, string>> = {};
    if (!formData.nombre.trim()) tempErrors.nombre = 'El nombre completo es requerido.';
    if (!formData.correo.trim()) {
      tempErrors.correo = 'El correo electrónico es requerido.';
    } else if (!/\S+@\S+\.\S+/.test(formData.correo)) {
      tempErrors.correo = 'Ingresa un correo electrónico válido.';
    }
    if (!formData.whatsapp.trim()) tempErrors.whatsapp = 'El WhatsApp es requerido para el contacto ágil.';
    if (!formData.mensaje.trim()) tempErrors.mensaje = 'Cuéntanos un poco sobre tu requerimiento.';
    if (formData.aceptaHabeasData === false) {
      tempErrors.aceptaHabeasData = 'Es necesario autorizar el tratamiento de datos para poder contactarte (Ley 1581 de 2012).';
    }
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
        // Save to offline database (con los valores ya traducidos a texto legible)
        await saveOfflineSubmission(getReadableFormData(formData));
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
          aceptaHabeasData: true,
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
          aceptaHabeasData: true,
        });
        setHoneypot('');
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
            ...getReadableFormData(formData),
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
            aceptaHabeasData: true,
          });
          setHoneypot('');
        } else {
          setIsSending(false);
          setApiError(data.message || 'No se pudo enviar tu solicitud. Por favor, inténtalo de nuevo.');
        }
      } catch (error) {
        console.error('[Contact] API delivery error:', error);
        setIsSending(false);
        setApiError('Error de red al conectar con el servidor. Por favor, verifica tu conexión e inténtalo de nuevo.');
      }
    }
  };

  return (
    <section id="contacto" className="py-16 relative overflow-hidden bg-[var(--color-secondary)]/15">
      {/* Glow spot & radial lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(37, 99, 235,0.06)_0%,rgba(37, 99, 235,0)_70%)] pointer-events-none -z-10 blur-3xl animate-pulse" style={{ animationDuration: '11s' }} />
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
                className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 tracking-tight leading-tight"
              >
                Hablemos de tu próximo gran proyecto
              </motion.h2>
              <motion.p 
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
                }}
                className="text-sm sm:text-base text-slate-700 font-sans leading-relaxed"
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
              className="space-y-4 py-4 border-y border-slate-200"
            >
              <div className="flex items-center space-x-3.5">
                <div className="p-2.5 bg-purple-500/10 rounded-xl border border-purple-500/20 text-purple-600">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="font-sans text-xs">
                  <div className="text-slate-500 font-bold uppercase">Enviar Correo</div>
                  <a href={`mailto:${config.correo}`} className="text-slate-900 hover:text-purple-600 font-semibold transition-all">
                    {config.correo}
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-3.5">
                <div className="p-2.5 bg-purple-500/10 rounded-xl border border-purple-500/20 text-purple-600">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="font-sans text-xs">
                  <div className="text-slate-500 font-bold uppercase">WhatsApp Directo</div>
                  <a href={`https://wa.me/${config.whatsapp.replace(/\+/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-slate-900 hover:text-purple-600 font-semibold transition-all">
                    {config.whatsapp}
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-3.5">
                <div className="p-2.5 bg-purple-500/10 rounded-xl border border-purple-500/20 text-purple-600">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="font-sans text-xs">
                  <div className="text-slate-500 font-bold uppercase">Sede Central</div>
                  <span className="text-slate-900 font-semibold">
                    {config.ciudad}, {config.pais}
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* RIGHT SIDE: FORM MODULE */}
          <motion.div 
            className="col-span-1 lg:col-span-7 bg-white/95 backdrop-blur-xl border border-slate-200/80 p-6 sm:p-8 rounded-3xl shadow-xl shadow-slate-900/5 text-left"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          >
            
            {isSubmitted ? (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 animate-fade-in">
                <div className={`w-16 h-16 rounded-full border flex items-center justify-center ${
                  isOfflineSubmitted
                    ? 'bg-purple-500/15 border-purple-500 text-purple-600'
                    : 'bg-emerald-500/15 border-emerald-500 text-emerald-600'
                }`}>
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 font-sans">
                  {isOfflineSubmitted ? 'Solicitud Guardada' : '¡Solicitud Enviada con Éxito!'}
                </h3>
                <p className="text-sm text-slate-600 font-sans max-w-md leading-relaxed">
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
                  className="mt-4 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-sans transition-all font-bold"
                >
                  {isOfflineSubmitted ? 'Volver' : 'Enviar otra cotización'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Nombre y Empresa */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-sans font-extrabold text-slate-800 uppercase tracking-wider">Nombre Completo *</label>
                    <input
                      type="text"
                      placeholder="Ej. Alejandro Silva"
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      className={`w-full bg-slate-50 border ${errors.nombre ? 'border-red-500' : 'border-slate-200'} rounded-xl px-3.5 py-2.5 text-xs font-sans text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-purple-600 transition-all`}
                    />
                    {errors.nombre && (
                      <span className="text-[10px] text-red-500 font-sans flex items-center space-x-1">
                        <AlertTriangle className="w-3 h-3 shrink-0" />
                        <span>{errors.nombre}</span>
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-sans font-extrabold text-slate-800 uppercase tracking-wider">Empresa (Opcional)</label>
                    <input
                      type="text"
                      placeholder="Ej. Nova S.L."
                      value={formData.empresa}
                      onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-sans text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-purple-600 transition-all"
                    />
                  </div>
                </div>

                {/* Correo y WhatsApp */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-sans font-extrabold text-slate-800 uppercase tracking-wider">Correo Electrónico *</label>
                    <input
                      type="email"
                      placeholder="Ej. alejandro@empresa.com"
                      value={formData.correo}
                      onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                      className={`w-full bg-slate-50 border ${errors.correo ? 'border-red-500' : 'border-slate-200'} rounded-xl px-3.5 py-2.5 text-xs font-sans text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-purple-600 transition-all`}
                    />
                    {errors.correo && (
                      <span className="text-[10px] text-red-500 font-sans flex items-center space-x-1">
                        <AlertTriangle className="w-3 h-3 shrink-0" />
                        <span>{errors.correo}</span>
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-sans font-extrabold text-slate-800 uppercase tracking-wider">Número de WhatsApp *</label>
                    <input
                      type="tel"
                      placeholder="Ej. +34 600 000 000"
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                      className={`w-full bg-slate-50 border ${errors.whatsapp ? 'border-red-500' : 'border-slate-200'} rounded-xl px-3.5 py-2.5 text-xs font-sans text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-purple-600 transition-all`}
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
                    <label className="text-[11px] font-sans font-extrabold text-slate-800 uppercase tracking-wider">Ciudad / País (Opcional)</label>
                    <input
                      type="text"
                      placeholder="Ej. Madrid, España"
                      value={formData.ciudad}
                      onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-sans text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-purple-600 transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-sans font-extrabold text-slate-800 uppercase tracking-wider">Servicio Requerido *</label>
                    <select
                      value={formData.servicio}
                      onChange={(e) => setFormData({ ...formData, servicio: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-sans text-slate-900 focus:outline-none focus:bg-white focus:border-purple-600 transition-all"
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
                    <label className="text-[11px] font-sans font-extrabold text-slate-800 uppercase tracking-wider block">
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
                              ? 'bg-purple-600 text-white shadow-sm'
                              : 'text-slate-600 hover:text-slate-900'
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
                              ? 'bg-purple-50/80 border-purple-600 shadow-sm'
                              : 'bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-slate-100/80'
                          }`}
                        >
                          {/* Indicator and Label */}
                          <div className="flex items-center justify-between w-full mb-1">
                            <span className={`text-[8px] font-sans font-bold tracking-wider uppercase ${isActive ? 'text-purple-700' : 'text-slate-500'}`}>
                              {btn.key === 'low' ? 'Iniciación' : btn.key === 'mid' ? 'Crecimiento' : 'Empresarial'}
                            </span>
                            <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all ${isActive ? 'border-purple-600 bg-purple-600' : 'border-slate-300'}`}>
                              {isActive && <div className="w-1 h-1 rounded-full bg-white" />}
                            </div>
                          </div>
                          
                          <span className={`text-xs sm:text-sm font-display font-extrabold tracking-tight ${isActive ? 'text-purple-900' : 'text-slate-800'}`}>
                            {btn.label}
                          </span>
                          
                          <span className="text-[9px] text-slate-500 font-sans mt-0.5 block leading-normal">
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
                  <label className="text-[11px] font-sans font-extrabold text-slate-800 uppercase tracking-wider">Detalles del Requerimiento *</label>
                  <textarea
                    placeholder="Describe los alcances clave de tu proyecto, flujos a automatizar o metas que buscas cumplir..."
                    value={formData.mensaje}
                    onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                    rows={4}
                    className={`w-full bg-slate-50 border ${errors.mensaje ? 'border-red-500' : 'border-slate-200'} rounded-xl px-3.5 py-2.5 text-xs font-sans text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-purple-600 transition-all`}
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

                {/* Error handling messages (without tech jargon to stay user-friendly) */}
                {apiError && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-600 rounded-xl text-xs font-sans flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-red-500" />
                    <span>{apiError}</span>
                  </div>
                )}

                {/* Autorización de Tratamiento de Datos (Ley 1581 de 2012 - Colombia) */}
                <div className="space-y-1 pt-1">
                  <label className="flex items-start space-x-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formData.aceptaHabeasData ?? true}
                      onChange={(e) => setFormData({ ...formData, aceptaHabeasData: e.target.checked })}
                      className="mt-0.5 w-4 h-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500 cursor-pointer accent-purple-600"
                    />
                    <span className="text-[11px] text-slate-600 font-sans leading-tight">
                      Autorizo el tratamiento de mis datos de conformidad con la <strong>Ley 1581 de 2012</strong> (Habeas Data) para la gestión y cotización de esta solicitud.
                    </span>
                  </label>
                  {errors.aceptaHabeasData && (
                    <span className="text-[10px] text-red-500 font-sans flex items-center space-x-1 pl-6">
                      <AlertTriangle className="w-3 h-3 shrink-0" />
                      <span>{errors.aceptaHabeasData}</span>
                    </span>
                  )}
                </div>

                {/* Submit button */}
                <Magnetic>
                  <button
                    type="submit"
                    disabled={isSending}
                    id="submit-contact-form-btn"
                    className="group w-full bg-gradient-to-r from-[#8B5CF6] via-[#3B82F6] to-[#22D3EE] hover:opacity-95 disabled:opacity-50 text-white font-sans text-xs font-bold py-3.5 px-4 rounded-xl transition-all duration-300 flex items-center justify-center text-center shadow-lg shadow-purple-500/20 cursor-pointer hover:scale-[1.015] active:scale-[0.985]"
                  >
                    <span>
                      {isSending 
                        ? 'PROCESANDO SOLICITUD...' 
                        : isOnline 
                        ? 'SOLICITAR COTIZACIÓN FORMAL' 
                        : 'GUARDAR SOLICITUD (SIN CONEXIÓN)'}
                    </span>
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
