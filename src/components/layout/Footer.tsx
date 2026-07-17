import React from 'react';
import { AppConfig } from '../../types';
import { 
  Github, 
  Linkedin, 
  Instagram, 
  Facebook,
  ArrowUp, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Check, 
  ArrowUpRight 
} from 'lucide-react';
import { motion } from 'motion/react';
import Magnetic from '../ui/Magnetic';
import { useTimeTheme } from '../../context/TimeThemeContext';
import destecLogo from '../../assets/images/img1.jpeg';

interface FooterProps {
  config: AppConfig;
}

export default function Footer({ config }: FooterProps) {
  const { theme } = useTimeTheme();
  const isDark = theme.id === 'night';

  const scrollUp = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleOpenWhatsApp = () => {
    const url = `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(config.whatsappMsg)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Real, custom-designed services requested by the user
  const serviciosReales = [
    'Desarrollo Web',
    'Aplicaciones a medida',
    'Automatización con n8n',
    'Chatbots IA',
    'Integraciones API',
    'Consultoría Tecnológica'
  ];

  // Bespoke, lightweight SVGs for clean, professional tech representations
  const tecnologiasConIconos = [
    {
      name: 'Laravel',
      svg: (
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-[#FF2D20]" fill="currentColor">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    },
    {
      name: 'React',
      svg: (
        <svg viewBox="-11.5 -10.23174 23 20.46348" className="w-3.5 h-3.5 text-[#00D8FF]" fill="none" stroke="currentColor" strokeWidth="2">
          <ellipse rx="11" ry="4.2"/>
          <ellipse rx="11" ry="4.2" transform="rotate(60)"/>
          <ellipse rx="11" ry="4.2" transform="rotate(120)"/>
          <circle r="1.5" fill="currentColor"/>
        </svg>
      )
    },
    {
      name: 'JavaScript',
      svg: (
        <span className="font-mono text-[8px] font-black leading-none text-black bg-[#F7DF1E] px-0.5 rounded-xs select-none">JS</span>
      )
    },
    {
      name: 'PHP',
      svg: (
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-[#777BB4]" fill="none" stroke="currentColor" strokeWidth="2">
          <ellipse cx="12" cy="12" rx="10" ry="6"/>
          <path d="M8 12h8"/>
        </svg>
      )
    },
    {
      name: 'MySQL',
      svg: (
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-[#4479A1]" fill="none" stroke="currentColor" strokeWidth="1.8">
          <ellipse cx="12" cy="6" rx="8" ry="3"/>
          <path d="M4 6v6c0 1.66 3.58 3 8 3s8-1.34 8-3V6"/>
          <path d="M4 12v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6"/>
        </svg>
      )
    },
    {
      name: 'Docker',
      svg: (
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-[#2496ED]" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="2" y="6" width="6" height="4" rx="0.5"/>
          <rect x="9" y="6" width="6" height="4" rx="0.5"/>
          <rect x="16" y="6" width="6" height="4" rx="0.5"/>
          <path d="M2 14h20c0 3-3 5-8 5s-8-2-12-5z" strokeLinecap="round"/>
        </svg>
      )
    },
    {
      name: 'Git',
      svg: (
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-[#F05032]" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="18" cy="18" r="3"/>
          <circle cx="6" cy="6" r="3"/>
          <circle cx="6" cy="18" r="3"/>
          <path d="M6 9v6M18 15l-12-6"/>
        </svg>
      )
    },
    {
      name: 'GitHub',
      svg: (
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-[#181717]" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    },
    {
      name: 'n8n',
      svg: (
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-[#FF6F61]" fill="none" stroke="currentColor" strokeWidth="2.5">
          <circle cx="6" cy="12" r="2.5"/>
          <circle cx="18" cy="6" r="2.5"/>
          <circle cx="18" cy="18" r="2.5"/>
          <path d="M6 12 L18 6 M6 12 L18 18"/>
        </svg>
      )
    }
  ];

  return (
    <footer 
      id="main-app-footer" 
      className={`border-t transition-all duration-700 pt-20 pb-10 text-left relative overflow-hidden font-sans ${
        isDark 
          ? 'bg-[#131926]/95 border-slate-800 shadow-[inset_0_12px_24px_rgba(0,0,0,0.2)]' 
          : 'bg-[#FCFCFD] border-slate-200/50 shadow-[inset_0_12px_24px_rgba(15,23,42,0.015)]'
      }`}
    >
      {/* GLOWS DECORATIVOS ULTRA SUAVES */}
      <div className="absolute -top-12 left-10 w-96 h-96 rounded-full bg-[var(--color-primary)]/3 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-12 right-10 w-96 h-96 rounded-full bg-blue-400/3 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-12 relative z-10">
        
        {/* REORGANIZACIÓN TOTAL EN 5 COLUMNAS ELEGANTES */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-12 gap-y-12 gap-x-8 lg:gap-x-12 pb-16">
          
          {/* COLUMNA 1: LOGO + DESCRIPCIÓN (Span 4) */}
          <div className="lg:col-span-4 space-y-6">
            <div 
              onClick={scrollUp} 
              className="flex items-center space-x-3 cursor-pointer select-none group"
            >
              <div className={`relative flex items-center justify-center w-10 h-10 rounded-xl overflow-hidden border transition-colors duration-300 ${
                isDark ? 'border-slate-800 group-hover:border-[var(--color-primary)]/40' : 'border-[var(--color-secondary)]/15 group-hover:border-[var(--color-primary)]/40'
              }`}>
                <img 
                  src={destecLogo}
                  alt="Des-Tec Logo"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div>
                <span className={`font-display font-black text-base tracking-tight block leading-none transition-colors duration-500 ${
                  isDark ? 'text-white' : 'text-[var(--color-secondary)]'
                }`}>
                  {config.nombre}
                </span>
                <span className="text-[9px] font-sans font-bold text-[var(--color-primary)] tracking-widest uppercase mt-0.5 block">
                  {config.cargo}
                </span>
              </div>
            </div>

            {/* Texto corto descriptivo (Máximo 3 líneas) */}
            <p className={`text-xs leading-relaxed max-w-sm transition-colors duration-500 ${
              isDark ? 'text-slate-400' : 'text-[var(--color-text-secondary)]'
            }`}>
              Desarrollamos software web, aplicaciones, automatizaciones inteligentes e integración de IA para empresas que buscan crecer mediante tecnología.
            </p>

            {/* Redes sociales premium: Íconos originales tipo formato 3D con colores vibrantes y micro-relieve táctil */}
            <div className="flex space-x-4 pt-4">
              {[
                { 
                  icon: Github, 
                  url: config.redes.github, 
                  label: 'GitHub', 
                  bgClass: 'bg-gradient-to-br from-[var(--color-primary)] via-[#7C3AED] to-[#5B21B6]',
                  bevelClass: 'border-t border-b-2 border-t-white/30 border-b-[#4C1D95]/90',
                  shadowClass: 'shadow-[0_6px_14px_rgba(124,58,237,0.4),inset_0_2px_3px_rgba(255,255,255,0.45),inset_0_-2px_4px_rgba(0,0,0,0.3)]'
                },
                { 
                  icon: Linkedin, 
                  url: config.redes.linkedin, 
                  label: 'LinkedIn', 
                  bgClass: 'bg-gradient-to-br from-[#0A66C2] via-[#0284C7] to-[#0369A1]',
                  bevelClass: 'border-t border-b-2 border-t-white/30 border-b-[#002A45]/90',
                  shadowClass: 'shadow-[0_6px_14px_rgba(10,102,194,0.4),inset_0_2px_3px_rgba(255,255,255,0.45),inset_0_-2px_4px_rgba(0,0,0,0.3)]'
                },
                { 
                  icon: Instagram, 
                  url: config.redes.instagram, 
                  label: 'Instagram', 
                  bgClass: 'bg-gradient-to-br from-[#F9CE34] via-[#E1306C] to-[#833AB4]',
                  bevelClass: 'border-t border-b-2 border-t-white/30 border-b-[#4A0426]/90',
                  shadowClass: 'shadow-[0_6px_14px_rgba(225,48,108,0.4),inset_0_2px_3px_rgba(255,255,255,0.45),inset_0_-2px_4px_rgba(0,0,0,0.3)]'
                },
                { 
                  icon: Facebook, 
                  url: config.redes.facebook || 'https://www.facebook.com/destec.dev/', 
                  label: 'Facebook', 
                  bgClass: 'bg-gradient-to-br from-[#1877F2] via-[#166FE5] to-[#0E529F]',
                  bevelClass: 'border-t border-b-2 border-t-white/30 border-b-[#092B52]/90',
                  shadowClass: 'shadow-[0_6px_14px_rgba(24,119,242,0.4),inset_0_2px_3px_rgba(255,255,255,0.45),inset_0_-2px_4px_rgba(0,0,0,0.3)]'
                }
              ].map((item, idx) => (
                <motion.a
                  key={idx}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.label}
                  className={`group relative w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer text-white overflow-hidden ${item.bgClass} ${item.bevelClass} ${item.shadowClass}`}
                  whileHover={{ 
                    y: -4,
                    scale: 1.08,
                    transition: { duration: 0.2, ease: "easeOut" }
                  }}
                  whileTap={{ 
                    y: 1, 
                    scale: 0.95,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.4), inset 0 3px 5px rgba(0,0,0,0.5)',
                    transition: { duration: 0.1 }
                  }}
                >
                  {/* Glossy sheen overlay (Skeuomorphic 3D reflection) */}
                  <span className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/25 rounded-full pointer-events-none" />
                  
                  {/* Skeuomorphic inner top curved highlight */}
                  <span className="absolute top-[2px] left-[4px] right-[4px] h-[35%] bg-gradient-to-b from-white/35 to-transparent rounded-t-full pointer-events-none" />
                  
                  {/* Glow layer behind the icon on hover */}
                  <span className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full blur-[6px] ${item.bgClass} pointer-events-none -z-10`} />

                  <item.icon className="w-5 h-5 relative z-10 filter drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.3)] transition-transform duration-300 group-hover:scale-110" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* COLUMNA 2: SERVICIOS (Span 2) */}
          <div className="lg:col-span-2 space-y-5">
            <h4 className={`text-xs font-bold uppercase tracking-wider transition-colors duration-500 ${
              isDark ? 'text-slate-200' : 'text-[var(--color-secondary)]'
            }`}>
              Servicios
            </h4>
            <ul className="space-y-3">
              {serviciosReales.map((service, idx) => (
                <li key={idx}>
                  <button 
                    onClick={() => scrollToSection('servicios')}
                    className={`group flex items-center space-x-2 text-xs text-left transition-all duration-300 ease-out transform cursor-pointer hover:translate-x-1.5 ${
                      isDark ? 'text-slate-400 hover:text-[var(--color-primary)]' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5 text-[var(--color-primary)]/60 shrink-0" />
                    <span>{service}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMNA 3: TECNOLOGÍAS (Span 2) */}
          <div className="lg:col-span-2 space-y-5">
            <h4 className={`text-xs font-bold uppercase tracking-wider transition-colors duration-500 ${
              isDark ? 'text-slate-200' : 'text-[var(--color-secondary)]'
            }`}>
              Tecnologías
            </h4>
            <div className="grid grid-cols-1 gap-2.5">
              {tecnologiasConIconos.map((tech, idx) => (
                <div 
                  key={idx}
                  className={`flex items-center space-x-2 text-xs transition-colors duration-300 select-none ${
                    isDark ? 'text-slate-400 hover:text-slate-200' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-secondary)]'
                  }`}
                >
                  <div className={`w-5 h-5 flex items-center justify-center rounded-md border shadow-[0_1px_2px_rgba(0,0,0,0.02)] shrink-0 ${
                    isDark ? 'bg-slate-800 border-slate-700/60' : 'bg-white border-slate-200/40'
                  }`}>
                    {tech.svg}
                  </div>
                  <span className="font-medium">{tech.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* COLUMNA 4: CONTACTO (Span 2) */}
          <div className="lg:col-span-2 space-y-5">
            <h4 className={`text-xs font-bold uppercase tracking-wider transition-colors duration-500 ${
              isDark ? 'text-slate-200' : 'text-[var(--color-secondary)]'
            }`}>
              Contacto
            </h4>
            <ul className={`space-y-3.5 text-xs transition-colors duration-500 ${
              isDark ? 'text-slate-400' : 'text-[var(--color-text-secondary)]'
            }`}>
              <li className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-[var(--color-primary)]/70 shrink-0" />
                <a href={`mailto:${config.correo}`} className="hover:text-[var(--color-primary)] transition-colors duration-300 font-medium break-all">
                  {config.correo}
                </a>
              </li>
              <li className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-[var(--color-primary)]/70 shrink-0" />
                <button onClick={handleOpenWhatsApp} className="hover:text-[var(--color-primary)] transition-colors duration-300 font-medium text-left cursor-pointer">
                  WhatsApp Directo
                </button>
              </li>
              <li className="flex items-center space-x-2.5">
                <MapPin className="w-4 h-4 text-[var(--color-primary)]/70 shrink-0" />
                <span className="font-medium">Bogotá, Colombia</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Clock className="w-4 h-4 text-[var(--color-primary)]/70 shrink-0" />
                <div className="leading-tight font-medium">
                  <span>Lunes a Viernes</span>
                  <span className={`block text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>9 AM - 6 PM (GMT-5)</span>
                </div>
              </li>
            </ul>
          </div>

          {/* COLUMNA 5: INFORMACIÓN LEGAL (Span 2) */}
          <div className="lg:col-span-2 space-y-5">
            <h4 className={`text-xs font-bold uppercase tracking-wider transition-colors duration-500 ${
              isDark ? 'text-slate-200' : 'text-[var(--color-secondary)]'
            }`}>
              Información Legal
            </h4>
            <ul className={`space-y-3 text-[10px] leading-relaxed list-none transition-colors duration-500 ${
              isDark ? 'text-slate-500' : 'text-[var(--color-text-secondary)]'
            }`}>
              <li className="relative pl-3.5">
                <span className="absolute left-0 top-1.5 w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]/50" />
                Sitio web de un desarrollador independiente.
              </li>
              <li className="relative pl-3.5">
                <span className="absolute left-0 top-1.5 w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]/50" />
                La información de contacto se usa solo para fines comerciales.
              </li>
              <li className="relative pl-3.5">
                <span className="absolute left-0 top-1.5 w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]/50" />
                Toda la información es tratada de forma confidencial.
              </li>
              <li className="relative pl-3.5">
                <span className="absolute left-0 top-1.5 w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]/50" />
                Servicios prestados mediante acuerdo privado.
              </li>
              <li className="relative pl-3.5">
                <span className="absolute left-0 top-1.5 w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]/50" />
                Disponible para todo el mundo.
              </li>
            </ul>
          </div>

        </div>

        {/* LÍNEA DE SEPARACIÓN INFERIOR CON COPYRIGHT Y BOTÓN DE ARRIBA */}
        <div className={`pt-8 border-t flex flex-col sm:flex-row justify-between items-center text-[11px] gap-4 transition-colors duration-500 ${
          isDark ? 'border-slate-800 text-slate-500' : 'border-slate-200/50 text-[var(--color-text-secondary)]'
        }`}>
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-1 sm:gap-4 text-center sm:text-left">
            <span>
              © 2026 Des-Tec. Todos los derechos reservados.
            </span>
            <span className={`hidden sm:inline ${isDark ? 'text-slate-800' : 'text-slate-300'}`}>|</span>
            <span>
              Diseñado y desarrollado por <a href="https://www.des-tec.co" target="_blank" rel="noopener noreferrer" className={`font-semibold hover:text-[var(--color-primary)] transition-colors hover:underline ${
                isDark ? 'text-slate-300' : 'text-slate-800'
              }`}>www.des-tec.co</a>
            </span>
          </div>

          <Magnetic>
            <motion.button
              onClick={scrollUp}
              className={`group flex items-center space-x-1.5 border px-4 py-2 rounded-full text-xs transition-all duration-300 shadow-xs hover:shadow-sm cursor-pointer ${
                isDark 
                  ? 'bg-slate-800 border-slate-700/60 hover:border-slate-600 text-slate-300 hover:text-white' 
                  : 'bg-white border-slate-200/50 hover:border-slate-300 text-[var(--color-text-secondary)] hover:text-[var(--color-secondary)]'
              }`}
              whileHover={{ scale: 1.025 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Volver arriba</span>
              <ArrowUp className="w-3.5 h-3.5 text-[var(--color-primary)] transition-transform duration-300 group-hover:-translate-y-0.5" />
            </motion.button>
          </Magnetic>
        </div>

      </div>
    </footer>
  );
}
