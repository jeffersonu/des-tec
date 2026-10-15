import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AppConfig } from '../../types';
import { Menu, X, ArrowUpRight, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Magnetic from '../ui/Magnetic';
import { useTimeTheme } from '../../context/TimeThemeContext';
import { usePWA } from '../../context/PWAContext';
import destecLogo from '../../assets/images/img1.jpeg';

interface HeaderProps {
  config: AppConfig;
  activeSection?: string;
}

export default function Header({ config, activeSection }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const { theme } = useTimeTheme();
  const isDark = true; // Identidad visual espacial oscura permanente en todo el sitio
  const { isInstallable, isStandalone, installApp } = usePWA();
  const location = useLocation();
  const navigate = useNavigate();

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
    { label: 'Inicio', path: '/', isHash: false },
    { label: 'Proyectos', path: '/proyectos', isHash: false },
    { label: 'Desarrollo Web', path: '/desarrollo-web', isHash: false },
    { label: 'Automatizaciones', path: '/automatizaciones', isHash: false },
    { label: 'CRM', path: '/crm', isHash: false },
    { label: 'Nosotros', path: '/#sobre-mi', isHash: true, sectionId: 'sobre-mi' },
  ];

  const handleNavClick = (item: typeof menuItems[0]) => {
    setMobileMenuOpen(false);
    if (item.isHash) {
      if (location.pathname === '/') {
        const el = document.getElementById(item.sectionId!);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } else {
        navigate(item.path);
        setTimeout(() => {
          const el = document.getElementById(item.sectionId!);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 200);
      }
    } else {
      navigate(item.path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const isItemActive = (item: typeof menuItems[0]) => {
    if (!item.isHash) {
      return location.pathname === item.path;
    }
    return location.pathname === '/' && activeSection === item.sectionId;
  };

  return (
    <header
      id="main-app-header"
      className={`fixed top-0 left-0 w-full z-[9999] transition-all duration-500 ease-in-out ${
        scrolled
          ? 'bg-slate-950/85 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/20 text-white'
          : 'bg-transparent border-b border-transparent shadow-none text-white'
      }`}
    >
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 sm:h-20 transition-all duration-300 ease-in-out"
      >
        
        {/* CUSTOM LOGO: Designed elegantly with dynamic scaling */}
        <Link
          to="/"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          id="brand-logo-container"
          className="flex items-center space-x-3 cursor-pointer select-none group"
        >
          <div
            className="relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden border border-cyan-500/40 bg-slate-950/80 shadow-[0_0_15px_rgba(6,182,212,0.25)] transition-all duration-300 group-hover:border-purple-500/60 group-hover:shadow-[0_0_20px_rgba(168,85,247,0.35)] backdrop-blur-md"
          >
            <img 
              src="/icons/icon-192x192.png"
              alt="Des-Tec Logo"
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105 rounded-full"
            />
          </div>
          <div className="text-left">
            <span
              className="font-sans font-extrabold tracking-tight text-white block transition-colors duration-300 text-base sm:text-lg drop-shadow-sm"
            >
              {config.nombre}
            </span>
            <span
              className="block font-sans font-bold text-cyan-400 tracking-widest uppercase text-[9px] -mt-0.5 drop-shadow-sm"
            >
              {config.cargo}
            </span>
          </div>
        </Link>

        {/* DESKTOP NAVIGATION: Modern multi-page links */}
        <nav id="desktop-navbar" className="hidden lg:flex items-center space-x-6 font-sans text-xs">
          {menuItems.map((item) => {
            const active = isItemActive(item);
            return (
              <button
                key={item.label}
                onClick={() => handleNavClick(item)}
                className={`px-2 py-2 rounded-lg transition-all relative group font-semibold interactive-hover cursor-pointer ${
                  active 
                    ? 'text-cyan-300 font-extrabold'
                    : 'text-slate-200 hover:text-white'
                }`}
              >
                <span className="relative z-10 transition-all">{item.label}</span>
                {active && (
                  <motion.span
                    layoutId="activeUnderline"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-400 rounded shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                {!active && (
                  <span className="absolute bottom-0 left-1/2 w-0 h-[2px] bg-cyan-400/60 rounded transition-all duration-300 group-hover:w-full group-hover:left-0" />
                )}
              </button>
            );
          })}
        </nav>

        {/* CTAs: "Hablemos" design - elegant */}
        <div className="hidden lg:flex items-center space-x-3 font-sans text-xs">
          {isInstallable && !isStandalone && (
            <motion.button
              onClick={installApp}
              className="group px-4 py-2.5 font-semibold rounded-xl transition-all duration-300 flex items-center space-x-1.5 cursor-pointer border border-white/20 bg-white/10 hover:bg-white/20 text-white shadow-sm backdrop-blur-md"
              whileHover={{ scale: 1.025 }}
              whileTap={{ scale: 0.985 }}
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Instalar Des-Tec</span>
            </motion.button>
          )}
          <Magnetic>
            <motion.button
              onClick={() => handleNavClick({ label: 'Contacto', path: '/#contacto', isHash: true, sectionId: 'contacto' })}
              id="header-cta-btn"
              className="group px-5 py-2.5 font-bold rounded-xl transition-all duration-300 flex items-center justify-center space-x-1.5 shadow-lg shadow-purple-500/20 hover:shadow-cyan-500/30 cursor-pointer text-white bg-gradient-to-r from-[#8B5CF6] via-[#3B82F6] to-[#22D3EE] hover:opacity-95 text-center"
              whileHover={{ scale: 1.025 }}
              whileTap={{ scale: 0.985 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <span>Hablemos</span>
            </motion.button>
          </Magnetic>
        </div>

        {/* MOBILE MENU TRIGGER */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          id="mobile-menu-trigger"
          className="lg:hidden p-2 transition-all focus:outline-none text-white hover:text-cyan-300"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* MOBILE MENU DRAWER */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-navigation-panel"
            className="lg:hidden border-b px-4 py-3 font-sans text-xs shadow-lg backdrop-blur-xl overflow-hidden bg-white/95 border-slate-200 text-slate-900"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex flex-col space-y-2 text-left">
              {menuItems.map((item) => {
                const active = isItemActive(item);
                return (
                  <button
                    key={item.label}
                    onClick={() => handleNavClick(item)}
                    className={`p-3 rounded-lg text-left transition-all font-semibold ${
                      active
                        ? 'bg-purple-50 text-purple-700 font-bold border-l-2 border-purple-600'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-purple-600'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
              {isInstallable && !isStandalone && (
                <button
                  onClick={installApp}
                  className="p-3 rounded-lg text-left transition-all font-semibold flex items-center gap-2 border border-slate-200 bg-slate-50 text-slate-800 hover:bg-slate-100"
                >
                  <Download className="w-4 h-4 text-purple-600" />
                  <span>Instalar Des-Tec</span>
                </button>
              )}
              <motion.button
                onClick={() => handleNavClick({ label: 'Contacto', path: '/#contacto', isHash: true, sectionId: 'contacto' })}
                className="mt-2 w-full p-3 bg-gradient-to-r from-[#8B5CF6] via-[#3B82F6] to-[#22D3EE] text-white rounded-lg text-center font-bold transition-all duration-300 shadow-md shadow-purple-500/20"
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

