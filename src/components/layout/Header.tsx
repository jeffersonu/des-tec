import React from 'react';
import { AppConfig } from '../../types';
import { Menu, X, ArrowUpRight, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Magnetic from '../ui/Magnetic';
import { useTimeTheme } from '../../context/TimeThemeContext';
import { usePWA } from '../../context/PWAContext';
import destecLogo from '../../assets/images/img1.jpeg';

interface HeaderProps {
  config: AppConfig;
  activeSection: string;
}

export default function Header({ config, activeSection }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const { theme } = useTimeTheme();
  const isDark = true; // Identidad visual espacial oscura permanente en todo el sitio
  const { isInstallable, isStandalone, installApp } = usePWA();

  React.useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 15;
      setScrolled((prev) => {
        if (prev !== isScrolled) return isScrolled;
        return prev;
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const menuItems = [
    { label: 'Inicio', id: 'inicio' },
    { label: 'Servicios', id: 'servicios' },
    { label: 'Proyectos', id: 'proyectos' },
    { label: 'Tecnologías', id: 'tecnologias' },
    { label: 'Sobre mí', id: 'sobre-mi' },
    { label: 'Proceso', id: 'proceso' },
    { label: 'Casos de éxito', id: 'casos-estudio' },
  ];

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 150);
  };

  return (
    <header
      id="main-app-header"
      className={`sticky top-0 z-40 w-full transition-all duration-500 ease-in-out ${
        scrolled
          ? isDark
            ? 'bg-[#131926]/90 backdrop-blur-md border-b border-slate-800/80 shadow-[0_4px_30px_rgba(0,0,0,0.3)]'
            : 'bg-white/90 backdrop-blur-md border-b border-[var(--color-text)]/5 shadow-[0_4px_30px_rgba(15,23,42,0.02)]'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 sm:h-20 transition-all duration-300 ease-in-out"
      >
        
        {/* CUSTOM LOGO: Designed elegantly with dynamic scaling for higher prominence */}
        <motion.div
          onClick={() => scrollTo('inicio')}
          id="brand-logo-container"
          className="flex items-center space-x-3 cursor-pointer select-none group"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <div
            className={`relative flex items-center justify-center w-11 h-11 rounded-xl overflow-hidden border transition-colors duration-300 group-hover:border-[var(--color-primary)]/50 ${
              isDark ? 'border-slate-800 bg-slate-900/60' : 'border-[var(--color-secondary)]/20 bg-white'
            } shadow-sm`}
          >
            <img 
              src={destecLogo}
              alt="Des-Tec Logo"
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
            />
          </div>
          <div className="text-left">
            <span
              className={`font-sans font-extrabold tracking-tight bg-gradient-to-r bg-clip-text text-transparent block transition-colors duration-300 text-base sm:text-lg ${
                isDark 
                  ? 'from-white via-[#F1F5F9] to-[var(--color-primary)]' 
                  : 'from-[var(--color-secondary)] via-[var(--color-text)] to-[var(--color-primary)]'
              }`}
            >
              {config.nombre}
            </span>
            <span
              className="block font-sans font-bold text-[var(--color-primary)]/95 tracking-widest uppercase text-[9px] -mt-0.5"
            >
              {config.cargo}
            </span>
          </div>
        </motion.div>

        {/* DESKTOP NAVIGATION: Perfect alignment & wider separation */}
        <nav id="desktop-navbar" className="hidden lg:flex items-center space-x-6 font-sans text-xs">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={`px-1 py-2.5 rounded-lg transition-all relative group font-semibold interactive-hover ${
                activeSection === item.id 
                  ? isDark ? 'text-white font-extrabold' : 'text-white font-extrabold'
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-[var(--color-text-secondary)] hover:text-white'
              }`}
            >
              <span className="relative z-10 transition-all">{item.label}</span>
              {activeSection === item.id && (
                <motion.span
                  layoutId="activeUnderline"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--color-primary)] rounded shadow-[0_0_8px_rgba(37, 99, 235,0.25)]"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              {activeSection !== item.id && (
                <span className="absolute bottom-0 left-1/2 w-0 h-[2px] bg-[var(--color-primary)]/50 rounded transition-all duration-300 group-hover:w-full group-hover:left-0" />
              )}
            </button>
          ))}
        </nav>

        {/* CTAs: "Hablemos" design - elegant, no-glow, soft shadow, premium animation */}
        <div className="hidden lg:flex items-center space-x-3 font-sans text-xs">
          {isInstallable && !isStandalone && (
            <motion.button
              onClick={installApp}
              className={`group px-4 py-2.5 font-semibold rounded-xl transition-all duration-300 flex items-center space-x-1.5 cursor-pointer border ${
                isDark 
                  ? 'bg-slate-900/60 hover:bg-slate-800 border-slate-800/80 hover:border-[var(--color-primary)]/30 text-slate-300 hover:text-white' 
                  : 'bg-[#FCFCFD] hover:bg-[#F3F4F6] border-slate-200 hover:border-[var(--color-primary)]/30 text-[var(--color-text-secondary)] hover:text-white'
              }`}
              whileHover={{ scale: 1.025 }}
              whileTap={{ scale: 0.985 }}
            >
              <Download className="w-3.5 h-3.5 text-[var(--color-primary)]" />
              <span>Instalar Des-Tec</span>
            </motion.button>
          )}
          <Magnetic>
            <motion.button
              onClick={() => scrollTo('contacto')}
              id="header-cta-btn"
              className={`group px-5 py-2.5 font-bold rounded-xl transition-all duration-300 flex items-center space-x-1.5 shadow-sm hover:shadow-[0_4px_15px_rgba(37, 99, 235,0.25)] cursor-pointer border ${
                isDark 
                  ? 'bg-gradient-to-r from-slate-800 to-slate-900 border-slate-700 hover:from-[var(--color-primary)] hover:to-[var(--color-primary-hover)] text-white' 
                  : 'bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-text)] hover:from-[var(--color-primary)] hover:to-[var(--color-primary-hover)] text-white border-[var(--color-secondary)]/5'
              }`}
              whileHover={{ scale: 1.025 }}
              whileTap={{ scale: 0.985 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <span>Hablemos</span>
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </motion.button>
          </Magnetic>
        </div>

        {/* MOBILE MENU TRIGGER */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          id="mobile-menu-trigger"
          className={`lg:hidden p-2 transition-all focus:outline-none ${
            isDark ? 'text-slate-400 hover:text-white' : 'text-[var(--color-text-secondary)] hover:text-white'
          }`}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* MOBILE MENU DRAWER */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-navigation-panel"
            className={`lg:hidden border-b px-4 py-3 font-sans text-xs shadow-md backdrop-blur-md overflow-hidden ${
              isDark 
                ? 'bg-[#131926]/95 border-slate-800/80 text-white' 
                : 'bg-[var(--color-surface)]/95 border-[var(--color-text)]/15'
            }`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex flex-col space-y-2 text-left">
              {menuItems.map((item) => (
                <button
                   key={item.id}
                   onClick={() => scrollTo(item.id)}
                   className={`p-3 rounded-lg text-left transition-all font-semibold ${
                     activeSection === item.id
                       ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-bold border-l-2 border-[var(--color-primary)]'
                       : isDark 
                         ? 'text-slate-300 hover:bg-slate-800 hover:text-white' 
                         : 'text-[var(--color-text-secondary)] hover:bg-slate-100 hover:text-white'
                   }`}
                >
                  {item.label}
                </button>
              ))}
              {isInstallable && !isStandalone && (
                <button
                  onClick={installApp}
                  className={`p-3 rounded-lg text-left transition-all font-semibold flex items-center gap-2 border ${
                    isDark 
                      ? 'border-slate-800 bg-slate-900/40 text-slate-200 hover:bg-slate-800 hover:text-white' 
                      : 'border-slate-100 bg-[#FCFCFD] text-[var(--color-text-secondary)] hover:bg-slate-100 hover:text-white'
                  }`}
                >
                  <Download className="w-4 h-4 text-[var(--color-primary)]" />
                  <span>Instalar Des-Tec</span>
                </button>
              )}
              <motion.button
                onClick={() => scrollTo('contacto')}
                className="mt-2 w-full p-3 bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-primary-hover)] to-[var(--color-primary)] bg-[length:200%_auto] hover:bg-[right_center] text-white rounded-lg text-center font-bold transition-all duration-500 shadow-[0_4px_12px_rgba(37, 99, 235,0.2)] hover:shadow-[0_4px_18px_rgba(37, 99, 235,0.35)] hover:scale-[1.015]"
                whileTap={{ scale: 0.985 }}
              >
                Solicitar Cotización
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
