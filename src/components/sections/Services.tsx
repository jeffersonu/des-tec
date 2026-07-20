import React from 'react';
import { Service } from '../../types';
import * as Icons from 'lucide-react';
import { motion } from 'motion/react';
import Magnetic from '../ui/Magnetic';
import { useTimeTheme } from '../../context/TimeThemeContext';

interface ServicesProps {
  services: Service[];
}

// 1. Desarrollo Web Illustration (Laptop)
const WebDevIllustration = () => (
  <svg viewBox="0 0 120 100" className="w-24 h-20 text-[var(--color-primary)] transition-transform duration-500 group-hover:scale-105" fill="none">
    {/* Base perspective line */}
    <path d="M10 50 L60 25 L110 50 L60 75 Z" stroke="var(--color-text)" strokeWidth="0.5" strokeDasharray="2 2" opacity="0.15" />
    {/* Laptop Screen Rim */}
    <path d="M60 20 L95 37.5 L95 72.5 L60 55 Z" stroke="var(--color-primary)" strokeWidth="1.5" fill="var(--color-surface)" strokeLinejoin="round" />
    {/* Screen Display Area */}
    <path d="M64 24 L91 37.5 L91 67.5 L64 54 Z" fill="var(--color-primary)" fillOpacity="0.08" stroke="var(--color-primary)" strokeWidth="1" />
    {/* Code Lines inside display */}
    <path d="M70 34 L83 40.5" stroke="var(--color-primary)" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M70 41 L86 49" stroke="var(--color-secondary)" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M70 48 L78 52" stroke="var(--color-primary)" strokeWidth="1.5" strokeLinecap="round" />
    {/* Keyboard Base Plate */}
    <path d="M60 55 L25 72.5 L60 90 L95 72.5 Z" stroke="var(--color-text)" strokeWidth="1.5" fill="var(--color-surface)" strokeLinejoin="round" />
    <path d="M60 58 L30 73 L60 88 L90 73 Z" stroke="var(--color-text)" strokeWidth="1" opacity="0.3" />
    {/* Keyboard keys structure */}
    <path d="M42 69 L53 63.5" stroke="var(--color-text)" strokeWidth="1" opacity="0.5" />
    <path d="M49 72.5 L60 67" stroke="var(--color-text)" strokeWidth="1" opacity="0.5" />
    <path d="M56 76 L67 70.5" stroke="var(--color-text)" strokeWidth="1" opacity="0.5" />
    {/* Precision trackpad */}
    <path d="M65 80.5 L73 76.5 L77 78.5 L69 82.5 Z" fill="var(--color-secondary)" fillOpacity="0.2" stroke="var(--color-secondary)" strokeWidth="0.75" />
  </svg>
);

// 2. Automatización Illustration (Connected Flow)
const AutomationIllustration = () => (
  <svg viewBox="0 0 120 100" className="w-24 h-20 text-[var(--color-primary)] transition-transform duration-500 group-hover:scale-105" fill="none">
    <path d="M10 50 L60 25 L110 50 L60 75 Z" stroke="var(--color-text)" strokeWidth="0.5" strokeDasharray="2 2" opacity="0.15" />
    {/* Source Block */}
    <path d="M30 45 L45 37.5 L45 52.5 L30 60 Z" stroke="var(--color-primary)" strokeWidth="1.5" fill="var(--color-surface)" strokeLinejoin="round" />
    <path d="M45 37.5 L60 45 L60 60 L45 52.5 Z" stroke="var(--color-primary)" strokeWidth="1.5" fill="var(--color-surface)" strokeLinejoin="round" />
    <path d="M30 45 L45 37.5 L60 45 L45 52.5 Z" stroke="var(--color-primary)" strokeWidth="1.5" fill="var(--color-primary)" fillOpacity="0.1" strokeLinejoin="round" />
    
    {/* Flow pipe link */}
    <path d="M60 52.5 L75 60 L90 52.5" stroke="var(--color-secondary)" strokeWidth="1.5" strokeDasharray="3 3" />
    
    {/* Target Block */}
    <path d="M75 52.5 L90 45 L90 60 L75 67.5 Z" stroke="var(--color-secondary)" strokeWidth="1.5" fill="var(--color-surface)" strokeLinejoin="round" />
    <path d="M90 45 L105 52.5 L105 67.5 L90 60 Z" stroke="var(--color-secondary)" strokeWidth="1.5" fill="var(--color-surface)" strokeLinejoin="round" />
    <path d="M75 52.5 L90 45 L105 52.5 L90 60 Z" stroke="var(--color-secondary)" strokeWidth="1.5" fill="var(--color-secondary)" fillOpacity="0.1" strokeLinejoin="round" />

    {/* Dynamic workflow pulsing signal */}
    <circle cx="67" cy="46" r="4" fill="var(--color-primary)" className="animate-pulse" />
    <path d="M67 46 L73 53" stroke="var(--color-primary)" strokeWidth="1" />
  </svg>
);

// 3. API & CRM Illustration (Connected Nodes)
const ApiIllustration = () => (
  <svg viewBox="0 0 120 100" className="w-24 h-20 text-[var(--color-primary)] transition-transform duration-500 group-hover:scale-105" fill="none">
    <path d="M10 50 L60 25 L110 50 L60 75 Z" stroke="var(--color-text)" strokeWidth="0.5" strokeDasharray="2 2" opacity="0.15" />
    {/* Core hub cylinder */}
    <path d="M50 40 C50 35, 70 35, 70 40 L70 55 C70 60, 50 60, 50 55 Z" stroke="var(--color-primary)" strokeWidth="1.5" fill="var(--color-surface)" />
    <ellipse cx="60" cy="40" rx="10" ry="4" stroke="var(--color-primary)" strokeWidth="1.5" fill="var(--color-primary)" fillOpacity="0.2" />
    <ellipse cx="60" cy="48" rx="10" ry="4" stroke="var(--color-secondary)" strokeWidth="1" opacity="0.6" />
    <ellipse cx="60" cy="55" rx="10" ry="4" stroke="var(--color-primary)" strokeWidth="1" opacity="0.6" />

    {/* Mesh network lines and peripheral nodes */}
    <g opacity="0.8">
      <line x1="60" y1="40" x2="30" y2="30" stroke="var(--color-primary)" strokeWidth="1" strokeDasharray="2 2" />
      <circle cx="30" cy="30" r="3" fill="var(--color-primary)" />
      
      <line x1="60" y1="48" x2="90" y2="38" stroke="var(--color-secondary)" strokeWidth="1" strokeDasharray="2 2" />
      <circle cx="90" cy="38" r="3" fill="var(--color-secondary)" />

      <line x1="60" y1="55" x2="40" y2="68" stroke="var(--color-primary)" strokeWidth="1" strokeDasharray="2 2" />
      <circle cx="40" cy="68" r="3" fill="var(--color-primary)" />

      <line x1="60" y1="48" x2="80" y2="65" stroke="var(--color-secondary)" strokeWidth="1" strokeDasharray="2 2" />
      <circle cx="80" cy="65" r="3" fill="var(--color-secondary)" />
    </g>
  </svg>
);

// 4. Chatbots Illustration (Modern Message Bubble)
const ChatbotsIllustration = () => (
  <svg viewBox="0 0 120 100" className="w-24 h-20 text-[var(--color-primary)] transition-transform duration-500 group-hover:scale-105" fill="none">
    <path d="M10 50 L60 25 L110 50 L60 75 Z" stroke="var(--color-text)" strokeWidth="0.5" strokeDasharray="2 2" opacity="0.15" />
    {/* Phone frame base */}
    <path d="M45 35 L75 50 L50 80 L20 65 Z" stroke="var(--color-text)" strokeWidth="1.5" fill="var(--color-surface)" strokeLinejoin="round" />
    <path d="M43 37 L71 51 L48 76 L20 62 Z" fill="var(--color-text)" fillOpacity="0.03" />

    {/* Floating glass chat bubble */}
    <path d="M60 28 L90 43 L90 58 L60 43 Z" stroke="var(--color-primary)" strokeWidth="1.5" fill="var(--color-surface)" strokeLinejoin="round" />
    <path d="M90 43 L100 48 L90 51 Z" stroke="var(--color-primary)" strokeWidth="1.5" fill="var(--color-surface)" strokeLinejoin="round" />
    <path d="M62 31 L88 44 L88 54 L62 41 Z" fill="var(--color-primary)" fillOpacity="0.1" />

    {/* Bubble inner lines */}
    <line x1="68" y1="38" x2="82" y2="45" stroke="var(--color-primary)" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="68" y1="44" x2="78" y2="49" stroke="var(--color-secondary)" strokeWidth="1.5" strokeLinecap="round" />

    {/* Bot avatar profile overlay */}
    <circle cx="48" cy="55" r="4" fill="var(--color-secondary)" />
    <path d="M44 63 L48 59 L52 63 Z" fill="var(--color-secondary)" />
  </svg>
);

// 5. SEO Illustration (Growing Chart)
const SeoIllustration = () => (
  <svg viewBox="0 0 120 100" className="w-24 h-20 text-[var(--color-primary)] transition-transform duration-500 group-hover:scale-105" fill="none">
    <path d="M10 50 L60 25 L110 50 L60 75 Z" stroke="var(--color-text)" strokeWidth="0.5" strokeDasharray="2 2" opacity="0.15" />
    
    {/* Isometric base grid lines */}
    <path d="M25 65 L85 35" stroke="var(--color-text)" strokeWidth="0.5" strokeDasharray="1 1" opacity="0.2" />
    <path d="M35 70 L95 40" stroke="var(--color-text)" strokeWidth="0.5" strokeDasharray="1 1" opacity="0.2" />

    {/* Level 1 bar */}
    <path d="M30 65 L40 60 L40 70 L30 75 Z" stroke="var(--color-text)" strokeWidth="1" fill="var(--color-surface)" />
    <path d="M40 60 L45 62.5 L45 72.5 L40 70 Z" stroke="var(--color-text)" strokeWidth="1" fill="var(--color-surface)" />
    <path d="M30 65 L40 60 L45 62.5 L35 67.5 Z" fill="var(--color-text)" fillOpacity="0.1" />

    {/* Level 2 bar */}
    <path d="M50 50 L60 45 L60 65 L50 70 Z" stroke="var(--color-primary)" strokeWidth="1" fill="var(--color-surface)" />
    <path d="M60 45 L65 47.5 L65 67.5 L60 65 Z" stroke="var(--color-primary)" strokeWidth="1" fill="var(--color-surface)" />
    <path d="M50 50 L60 45 L65 47.5 L55 52.5 Z" fill="var(--color-primary)" fillOpacity="0.1" />

    {/* Level 3 bar (Peak SEO representation) */}
    <path d="M70 35 L80 30 L80 60 L70 65 Z" stroke="var(--color-secondary)" strokeWidth="1.5" fill="var(--color-surface)" />
    <path d="M80 30 L85 32.5 L85 62.5 L80 60 Z" stroke="var(--color-secondary)" strokeWidth="1.5" fill="var(--color-surface)" />
    <path d="M70 35 L80 30 L85 32.5 L75 37.5 Z" fill="var(--color-secondary)" fillOpacity="0.2" />

    {/* Upward projection arrow */}
    <path d="M28 64 L48 49 L68 34 L82 18" stroke="var(--color-secondary)" strokeWidth="2" strokeLinecap="round" strokeDasharray="1 1" />
    <polygon points="82,18 76,21 80,24" fill="var(--color-secondary)" />
  </svg>
);

// 6. Hosting Illustration (Cloud Server)
const HostingIllustration = () => (
  <svg viewBox="0 0 120 100" className="w-24 h-20 text-[var(--color-primary)] transition-transform duration-500 group-hover:scale-105" fill="none">
    <path d="M10 50 L60 25 L110 50 L60 75 Z" stroke="var(--color-text)" strokeWidth="0.5" strokeDasharray="2 2" opacity="0.15" />
    {/* Cabinet main casing */}
    <path d="M40 45 L70 30 L70 70 L40 85 Z" stroke="var(--color-primary)" strokeWidth="1.5" fill="var(--color-surface)" strokeLinejoin="round" />
    <path d="M70 30 L85 37.5 L85 77.5 L70 70 Z" stroke="var(--color-primary)" strokeWidth="1.5" fill="var(--color-surface)" strokeLinejoin="round" />
    <path d="M40 45 L70 30 L85 37.5 L55 52.5 Z" fill="var(--color-primary)" fillOpacity="0.05" stroke="var(--color-primary)" strokeWidth="1" />

    {/* Rack slot indicator lines */}
    <path d="M44 50 L66 39 M44 58 L66 47 M44 66 L66 55 M44 74 L66 63" stroke="var(--color-text)" strokeWidth="1.5" opacity="0.8" />

    {/* Active status LED nodes */}
    <circle cx="48" cy="50" r="1" fill="var(--color-secondary)" className="animate-ping" />
    <circle cx="48" cy="50" r="1" fill="var(--color-secondary)" />
    
    <circle cx="52" cy="58" r="1" fill="var(--color-primary-hover)" />
    
    <circle cx="48" cy="66" r="1" fill="var(--color-secondary)" />
    
    <circle cx="52" cy="74" r="1" fill="var(--color-primary)" className="animate-pulse" />
    <circle cx="52" cy="74" r="1" fill="var(--color-primary)" />

    {/* Cloud vector overhead */}
    <path d="M75 25 C75 21, 85 21, 88 24 C91 21, 99 23, 98 27 C101 27, 101 32, 97 33 L75 33 Z" stroke="var(--color-secondary)" strokeWidth="1" fill="var(--color-surface)" opacity="0.75" />
  </svg>
);

export default function Services({ services }: ServicesProps) {
  const { theme } = useTimeTheme();
  const isDark = true; // El sitio completo usa ahora una identidad visual espacial oscura permanente

  // Discreet per-card accent (only used for subtle icon-ring tints — never overrides brand primary)
  const cardAccent: Record<string, string> = {
    'web-dev': '#2563EB',
    'automation': '#10B981',
    'integrations': '#F59E0B',
    'whatsapp-chatbots': '#10B981',
    'seo-speed': '#22D3EE',
    'hosting-consulting': '#475569',
  };

  // Map specific illustration relative to the service ID
  const renderIllustration = (id: string) => {
    switch (id) {
      case 'web-dev':
        return <WebDevIllustration />;
      case 'automation':
        return <AutomationIllustration />;
      case 'integrations':
        return <ApiIllustration />;
      case 'whatsapp-chatbots':
        return <ChatbotsIllustration />;
      case 'seo-speed':
        return <SeoIllustration />;
      case 'hosting-consulting':
        return <HostingIllustration />;
      default:
        return <WebDevIllustration />;
    }
  };

  // Modern modern Lucide icon helper
  const renderIcon = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName];
    if (!IconComponent) {
      return <Icons.Settings className="w-5 h-5 text-[var(--color-primary)] group-hover:text-white transition-all duration-300 group-hover:rotate-12 group-hover:scale-110" />;
    }
    return <IconComponent className="w-5 h-5 text-[var(--color-primary)] group-hover:text-white transition-all duration-300 group-hover:rotate-6 group-hover:scale-110 group-hover:-translate-y-0.5" />;
  };

  // Scroll smooth helper to trigger contact section
  const handleRequestInfo = () => {
    const element = document.getElementById('contacto');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="servicios" className={`py-16 relative overflow-hidden ${theme.sectionBgDark} transition-all duration-700`}>
      {/* Premium blurred radial lights */}
      <div className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(228,168,83,0.04)_0%,rgba(228,168,83,0)_70%)] pointer-events-none -z-10 blur-2xl" />
      <div className="absolute bottom-10 right-1/4 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(95,141,122,0.04)_0%,rgba(95,141,122,0)_70%)] pointer-events-none -z-10 blur-2xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[radial-gradient(circle,rgba(37, 99, 235,0.02)_0%,rgba(37, 99, 235,0)_75%)] pointer-events-none -z-10 blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />

      {/* Subtle tech background patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(var(--color-primary)_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.015] pointer-events-none -z-10" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-secondary)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-secondary)_1px,transparent_1px)] [background-size:48px_48px] opacity-[0.012] pointer-events-none -z-10" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-10 space-y-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1 }
            }
          }}
        >
          <motion.span 
            variants={{
              hidden: { opacity: 0, y: 15 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
            }}
            className="text-xs font-sans font-extrabold text-[var(--color-primary)] tracking-widest uppercase bg-[var(--color-primary)]/8 border border-[var(--color-primary)]/15 px-4 py-1.5 rounded-full inline-block"
          >
            Nuestros Servicios
          </motion.span>
          <motion.h2 
            variants={{
              hidden: { opacity: 0, y: 20, filter: 'blur(5px)' },
              visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
            }}
            className={`text-3xl sm:text-4xl md:text-5xl font-display font-extrabold ${isDark ? 'text-white' : 'text-white'} tracking-tight leading-tight transition-all duration-700`}
          >
            ¿Qué podemos desarrollar para tu empresa?
          </motion.h2>
          <motion.p 
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
            }}
            className={`text-base ${theme.textSecondary} max-w-2xl mx-auto font-sans leading-relaxed transition-all duration-700`}
          >
            Combinamos diseño premium de estudio internacional e ingeniería de punta para construir productos de software estables que aceleran tus operaciones y automatizan tu negocio.
          </motion.p>
        </motion.div>

        {/* Services Premium Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {services.map((srv, index) => (
            <motion.div
              key={srv.id}
              id={`service-card-${srv.id}`}
              className={`group relative ${theme.cardBg} border ${theme.cardBorder} p-8 sm:p-10 rounded-[26px] flex flex-col justify-between text-left ${theme.cardShadow} overflow-hidden cursor-pointer transition-all duration-500 ease-out`}
              initial={{ opacity: 0, y: 35, filter: 'blur(4px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{
                duration: 0.5,
                ease: [0.16, 1, 0.3, 1],
                delay: index * 0.08
              }}
              whileHover={{
                y: -6,
                borderColor: 'rgba(37, 99, 235, 0.45)',
                boxShadow: isDark
                  ? '0 24px 48px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(37, 99, 235,0.15)'
                  : '0 24px 48px -12px rgba(15,23,42,0.08), 0 0 0 1px rgba(37, 99, 235,0.08)'
              }}
            >
              {/* Premium top border animated line */}
              <div
                className="absolute top-0 left-0 right-0 h-[2.5px] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-center z-20"
                style={{ background: `linear-gradient(90deg, ${cardAccent[srv.id] || 'var(--color-primary)'}, var(--color-primary), ${cardAccent[srv.id] || 'var(--color-primary)'})` }}
              />

              {/* Dynamic sleek sweeping glare reflex */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/12 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-[1000ms] ease-out pointer-events-none z-10" />

              {/* Subtle elegant gloss highlights & gradients */}
              <div className="absolute inset-0 border border-white/45 rounded-[24px] pointer-events-none z-10" />
              <div className="absolute -top-[20%] -right-[10%] w-[180px] h-[180px] bg-[var(--color-primary)]/[0.02] group-hover:bg-[var(--color-primary)]/[0.08] rounded-full blur-3xl transition-all duration-700 pointer-events-none" />
              <div className="absolute -bottom-[20%] -left-[10%] w-[180px] h-[180px] bg-[var(--color-secondary)]/[0.01] group-hover:bg-[var(--color-secondary)]/[0.05] rounded-full blur-3xl transition-all duration-700 pointer-events-none" />

              <div className="relative z-10">
                {/* Header elements inside card */}
                <div className="flex items-start justify-between mb-7">
                  {/* Modern Icon container with nested ring and responsive hover effects */}
                  <div
                    className="w-12 h-12 rounded-2xl bg-gradient-to-b from-white to-[var(--color-background)] border border-[var(--accent)]/15 shadow-[0_2px_8px_rgba(15,23,42,0.04),inset_0_1px_0_rgba(255,255,255,0.8)] flex items-center justify-center text-[var(--color-primary)] group-hover:text-white group-hover:bg-[var(--accent)] group-hover:border-[var(--accent)]/40 transition-all duration-300"
                    style={{ ['--accent' as any]: cardAccent[srv.id] || 'var(--color-primary)' }}
                  >
                    {renderIcon(srv.icon)}
                  </div>

                  {/* Isometric Miniature Illustration */}
                  <div className="opacity-80 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-105">
                    {renderIllustration(srv.id)}
                  </div>
                </div>

                {/* Service Title */}
                <h3 className={`text-lg sm:text-xl font-display font-bold ${isDark ? 'text-slate-100' : 'text-white'} tracking-tight mb-3 transition-colors duration-300 group-hover:text-[var(--color-primary)]`}>
                  {srv.title}
                </h3>

                {/* Service Description */}
                <p className={`text-[13.5px] ${theme.textMuted} font-sans leading-relaxed mb-6 group-hover:text-slate-200 transition-colors duration-300 max-w-[95%] transition-all duration-500`}>
                  {srv.description}
                </p>
              </div>

              {/* Bottom Card Block */}
              <div className="space-y-6 relative z-10">
                {/* Features Checklist */}
                <div className={`space-y-3 pt-5 border-t ${isDark ? 'border-slate-800' : 'border-[var(--color-secondary)]/[0.04]'} font-sans transition-all duration-500`}>
                  {srv.features.map((feature, fIdx) => (
                    <div key={fIdx} className={`flex items-center space-x-3 ${isDark ? 'text-slate-300' : 'text-[var(--color-text)]'}`}>
                      <div className="w-4 h-4 rounded-full bg-[var(--color-secondary)]/10 border border-[var(--color-secondary)]/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300">
                        <Icons.Check className="w-2.5 h-2.5 text-white" strokeWidth={4} />
                      </div>
                      <span className={`text-[11.5px] font-sans font-medium ${isDark ? 'text-slate-400' : 'text-[#4B5563]'} group-hover:text-slate-200 transition-colors duration-300`}>{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Action button: highly polished, always visible premium button with elegant hover style */}
                <div className="pt-2">
                  <Magnetic>
                    <motion.button
                      whileHover={{ scale: 1.015 }}
                      whileTap={{ scale: 0.985 }}
                      onClick={handleRequestInfo}
                      className={`group/btn w-full py-2.5 text-xs font-bold font-sans rounded-xl border transition-all duration-300 flex items-center justify-center space-x-2 shadow-[0_1px_2px_rgba(0,0,0,0.01)] ${
                        isDark 
                          ? 'bg-slate-800/80 hover:bg-slate-700 text-slate-100 border-slate-700/60' 
                          : 'bg-gradient-to-r from-white to-[var(--color-background)] hover:to-[var(--color-secondary)] hover:text-white text-white border-[var(--color-secondary)]/[0.08]'
                      } hover:border-transparent cursor-pointer`}
                    >
                      <span>Más información</span>
                      <Icons.ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover/btn:translate-x-1 text-[var(--color-primary)] group-hover/btn:text-white" />
                    </motion.button>
                  </Magnetic>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Dynamic Statistics Footer inside Services */}
        <motion.div 
          className={`mt-20 p-10 ${theme.cardBg} border ${theme.cardBorder} rounded-[22px] grid grid-cols-1 sm:grid-cols-3 gap-8 text-center ${theme.cardShadow} transition-all duration-700`}
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-5%" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-[var(--color-primary)]">
              &lt; 150ms
            </div>
            <div className={`text-xs ${theme.textMuted} font-sans font-semibold uppercase tracking-wider`}>
              Latencia de Carga (TTFB)
            </div>
          </div>
          <div className={`space-y-1 border-t sm:border-t-0 sm:border-x ${isDark ? 'border-slate-800/80' : 'border-[var(--color-text)]/5'} py-4 sm:py-0`}>
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-[var(--color-primary)]">
              100%
            </div>
            <div className={`text-xs ${theme.textMuted} font-sans font-semibold uppercase tracking-wider`}>
              Código Limpio & Tipado TS
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-[var(--color-primary)]">
              99+
            </div>
            <div className={`text-xs ${theme.textMuted} font-sans font-semibold uppercase tracking-wider`}>
              Puntuación SEO & Lighthouse
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
