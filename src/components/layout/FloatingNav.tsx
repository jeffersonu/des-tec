import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Compass, ChevronUp, ChevronDown } from 'lucide-react';
import { useTimeTheme } from '../../context/TimeThemeContext';

const SECTIONS = [
  { id: 'inicio', label: 'Inicio', subtitle: 'Punto de partida' },
  { id: 'servicios', label: 'Servicios', subtitle: 'Qué desarrollamos' },
  { id: 'proyectos', label: 'Proyectos', subtitle: 'Casos reales' },
  { id: 'tecnologias', label: 'Tecnologías', subtitle: 'Nuestro ecosistema' },
  { id: 'sobre-mi', label: 'Sobre mí', subtitle: 'Nuestra identidad' },
  { id: 'proceso', label: 'Proceso', subtitle: 'Metodología ágil' },
  { id: 'casos-estudio', label: 'Casos de éxito', subtitle: 'Métricas de valor' },
  { id: 'contacto', label: 'Contacto', subtitle: 'Hablemos ahora' }
];

interface FloatingNavProps {
  activeSection: string;
}

export default function FloatingNav({ activeSection }: FloatingNavProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isMouseOver, setIsMouseOver] = useState(false);
  const { theme } = useTimeTheme();
  const isDark = theme.id === 'night';

  // Scroll spy observer & Auto-hide scroll timer
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      // Show the bar immediately when scrolling starts
      const shouldBeVisible = window.scrollY > 150;
      setIsVisible((prev) => {
        if (prev !== shouldBeVisible) return shouldBeVisible;
        return prev;
      });

      // Clear previous timeout
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }

      // Auto-hide after 2.5 seconds of scroll inactivity, UNLESS mouse is hovering the nav
      scrollTimeout = setTimeout(() => {
        if (!isMouseOver) {
          setIsVisible(false);
        }
      }, 2500);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Trigger initial check
    if (window.scrollY > 150) {
      setIsVisible(true);
      scrollTimeout = setTimeout(() => {
        setIsVisible(false);
      }, 2500);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }, [isMouseOver]);

  // Handle when mouse enters/leaves the floating nav to lock visibility
  useEffect(() => {
    if (isMouseOver) {
      setIsVisible(true);
    }
  }, [isMouseOver]);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleNextSection = () => {
    const currentIndex = SECTIONS.findIndex((s) => s.id === activeSection);
    if (currentIndex !== -1 && currentIndex < SECTIONS.length - 1) {
      scrollTo(SECTIONS[currentIndex + 1].id);
    }
  };

  const handlePrevSection = () => {
    const currentIndex = SECTIONS.findIndex((s) => s.id === activeSection);
    if (currentIndex > 0) {
      scrollTo(SECTIONS[currentIndex - 1].id);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: -30, filter: 'blur(10px)' }}
          animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, x: -30, filter: 'blur(10px)' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          onMouseEnter={() => setIsMouseOver(true)}
          onMouseLeave={() => setIsMouseOver(false)}
          className={`fixed left-4 lg:left-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center gap-4 border py-6 px-3 rounded-full shadow-[0_12px_40px_rgba(15,23,42,0.06)] select-none transition-all duration-500 ${
            isDark 
              ? 'bg-[#131926]/85 backdrop-blur-xl border-slate-800' 
              : 'bg-white/80 backdrop-blur-xl border-[var(--color-secondary)]/5'
          }`}
        >
          {/* Top compass/anchor button */}
          <motion.button
            onClick={() => scrollTo('inicio')}
            whileHover={{ scale: 1.1, rotate: 15 }}
            whileTap={{ scale: 0.95 }}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
              isDark 
                ? 'bg-slate-800/60 hover:bg-[var(--color-primary)]/10 text-slate-400 hover:text-[var(--color-primary)]' 
                : 'bg-[var(--color-secondary)]/5 hover:bg-[var(--color-primary)]/10 text-slate-500 hover:text-[var(--color-primary)]'
            }`}
            title="Ir al inicio"
          >
            <Compass className="w-4 h-4" />
          </motion.button>

          {/* Previous section indicator */}
          <button
            onClick={handlePrevSection}
            disabled={activeSection === SECTIONS[0].id}
            className={`w-6 h-4 flex items-center justify-center disabled:opacity-20 transition-colors cursor-pointer ${
              isDark ? 'text-slate-500 hover:text-[var(--color-primary)]' : 'text-slate-400 hover:text-[var(--color-primary)]'
            }`}
            title="Sección anterior"
          >
            <ChevronUp className="w-4 h-4" />
          </button>

          {/* Dots Indicator Spine */}
          <div className="relative flex flex-col items-center gap-3.5 py-2">
            {/* Soft vertical connecting line */}
            <div className={`absolute top-0 bottom-0 w-[1.5px] -z-10 ${
              isDark ? 'bg-slate-800/80' : 'bg-slate-200/60'
            }`} />

            {SECTIONS.map((sec, index) => {
              const isActive = activeSection === sec.id;
              return (
                <div
                  key={sec.id}
                  className="relative flex items-center justify-center"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Interactive Target Circle */}
                  <button
                    onClick={() => scrollTo(sec.id)}
                    className="group relative flex items-center justify-center w-6 h-6 focus:outline-none cursor-pointer"
                    aria-label={`Navegar a ${sec.label}`}
                  >
                    {/* Ring Outer Highlight for active */}
                    <motion.div
                      animate={{
                        scale: isActive ? 1.1 : 0.6,
                        opacity: isActive ? 1 : 0,
                      }}
                      className={`absolute w-5 h-5 rounded-full border border-[var(--color-primary)] shadow-[0_0_8px_rgba(108, 76, 245,0.25)] -z-10 ${
                        isDark ? 'bg-slate-900' : 'bg-white'
                      }`}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    />

                    {/* Dot Center Core */}
                    <motion.div
                      animate={{
                        scale: isActive ? 1 : 0.8,
                        backgroundColor: isActive ? 'var(--color-primary)' : isDark ? 'var(--color-text-secondary)' : '#94A3B8',
                      }}
                      whileHover={{ scale: 1.25, backgroundColor: 'var(--color-primary)' }}
                      className="w-2 h-2 rounded-full transition-colors duration-250"
                    />
                  </button>

                  {/* Elegant Glassmorphic Sidebar Flyout Label */}
                  <AnimatePresence>
                    {hoveredIndex === index && (
                      <motion.div
                        initial={{ opacity: 0, x: 12, filter: 'blur(4px)' }}
                        animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, x: 8, filter: 'blur(2px)' }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        className={`absolute left-9 py-2 px-3.5 border rounded-xl shadow-[0_10px_25px_rgba(15,23,42,0.06)] min-w-[150px] pointer-events-none text-left ${
                          isDark 
                            ? 'bg-[#131926]/95 backdrop-blur-xl border-slate-800 text-white' 
                            : 'bg-white/95 backdrop-blur-xl border-slate-100 text-[var(--color-secondary)]'
                        }`}
                      >
                        <div className={`text-[10px] font-extrabold uppercase tracking-wider ${
                          isDark ? 'text-slate-100' : 'text-[var(--color-secondary)]'
                        }`}>
                          {sec.label}
                        </div>
                        <div className="text-[9px] font-medium text-slate-400 mt-0.5 whitespace-nowrap">
                          {sec.subtitle}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* Next section indicator */}
          <button
            onClick={handleNextSection}
            disabled={activeSection === SECTIONS[SECTIONS.length - 1].id}
            className={`w-6 h-4 flex items-center justify-center disabled:opacity-20 transition-colors cursor-pointer ${
              isDark ? 'text-slate-500 hover:text-[var(--color-primary)]' : 'text-slate-400 hover:text-[var(--color-primary)]'
            }`}
            title="Siguiente sección"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
