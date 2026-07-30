import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * CosmicBackdrop
 * ---------------------------------------------------------------------------
 * Fondo luminoso, limpio y elegante con degradados suaves y manchas de luz
 * desenfocadas que se adaptan a la tecnología de la página activa.
 * Sin cuadrículas, sin líneas, sin imágenes ni formas geométricas definidas.
 * ---------------------------------------------------------------------------
 */
export default function CosmicBackdrop() {
  const [scrollY, setScrollY] = useState(0);
  const location = useLocation();

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Determine smooth theme palette depending on route
  const getThemeConfig = () => {
    const path = location.pathname;

    if (path === '/desarrollo-web') {
      return {
        bgBase: 'linear-gradient(180deg, #F0F9FF 0%, #E0F2FE 50%, #D9F2FE 100%)',
        spot1: 'radial-gradient(ellipse at 30% 20%, rgba(56, 189, 248, 0.28) 0%, rgba(14, 165, 233, 0.15) 50%, transparent 80%)', // Ice Cyan
        spot2: 'radial-gradient(ellipse at 75% 45%, rgba(186, 230, 253, 0.35) 0%, rgba(147, 197, 253, 0.20) 50%, transparent 80%)', // Sky Blue
        spot3: 'radial-gradient(ellipse at 25% 80%, rgba(125, 211, 252, 0.30) 0%, rgba(165, 243, 252, 0.18) 50%, transparent 80%)', // Electric Cyan
      };
    }

    if (path === '/automatizaciones') {
      return {
        bgBase: 'linear-gradient(180deg, #F0FDF4 0%, #E6F4EA 50%, #DCFCE7 100%)',
        spot1: 'radial-gradient(ellipse at 30% 20%, rgba(52, 211, 153, 0.28) 0%, rgba(20, 184, 166, 0.15) 50%, transparent 80%)', // Mint Green
        spot2: 'radial-gradient(ellipse at 80% 50%, rgba(167, 243, 208, 0.35) 0%, rgba(153, 246, 228, 0.20) 50%, transparent 80%)', // Soft Teal
        spot3: 'radial-gradient(ellipse at 25% 85%, rgba(110, 231, 183, 0.30) 0%, rgba(167, 243, 208, 0.18) 50%, transparent 80%)', // Ice Emerald
      };
    }

    if (path === '/crm') {
      return {
        bgBase: 'linear-gradient(180deg, #FAFAF9 0%, #F3F4F6 50%, #E5E7EB 100%)',
        spot1: 'radial-gradient(ellipse at 30% 20%, rgba(148, 163, 184, 0.25) 0%, rgba(251, 191, 36, 0.15) 50%, transparent 80%)', // Steel Blue + Gold
        spot2: 'radial-gradient(ellipse at 75% 45%, rgba(203, 213, 225, 0.35) 0%, rgba(253, 230, 138, 0.15) 50%, transparent 80%)', // Warm Light Slate
        spot3: 'radial-gradient(ellipse at 25% 85%, rgba(226, 232, 240, 0.38) 0%, rgba(148, 163, 184, 0.18) 50%, transparent 80%)', // Steel Horizon
      };
    }

    // Default Home Page (Inicio)
    return {
      bgBase: 'linear-gradient(180deg, #F7FAFC 0%, #EEF4FF 50%, #E8F1FF 100%)',
      spot1: 'radial-gradient(ellipse at 30% 15%, rgba(147, 197, 253, 0.32) 0%, rgba(196, 181, 253, 0.20) 50%, transparent 80%)', // Light Blue + Lavender
      spot2: 'radial-gradient(ellipse at 80% 40%, rgba(165, 243, 252, 0.30) 0%, rgba(191, 219, 254, 0.18) 50%, transparent 80%)', // Cyan Glow
      spot3: 'radial-gradient(ellipse at 20% 85%, rgba(221, 214, 254, 0.28) 0%, rgba(191, 219, 254, 0.18) 50%, transparent 80%)', // Lavender Horizon
    };
  };

  const theme = getThemeConfig();

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-[60] pointer-events-none overflow-hidden select-none transition-colors duration-1000"
      style={{ backgroundColor: '#F7FAFC' }}
    >
      <style>{`
        @keyframes ambientLightFlow1 {
          0% { transform: translate3d(0%, 0%, 0) scale(1); }
          50% { transform: translate3d(4%, -3%, 0) scale(1.08); }
          100% { transform: translate3d(0%, 0%, 0) scale(1); }
        }

        @keyframes ambientLightFlow2 {
          0% { transform: translate3d(0%, 0%, 0) scale(1); }
          50% { transform: translate3d(-5%, 4%, 0) scale(1.1); }
          100% { transform: translate3d(0%, 0%, 0) scale(1); }
        }

        .ambient-light-1 {
          animation: ambientLightFlow1 30s ease-in-out infinite;
          will-change: transform;
        }

        .ambient-light-2 {
          animation: ambientLightFlow2 38s ease-in-out infinite;
          will-change: transform;
        }
      `}</style>

      {/* 1. Main Luminous Base Gradient */}
      <div
        className="absolute inset-0 transition-all duration-1000"
        style={{ background: theme.bgBase }}
      />

      {/* 2. Unfocused Ambient Light Glows (No defined shapes, no grid, no lines) */}
      <div
        className="absolute inset-0 transition-transform duration-300 ease-out"
        style={{ transform: `translate3d(0, ${scrollY * -0.03}px, 0)` }}
      >
        {/* Top-Left Ambient Light Mass */}
        <div
          className="ambient-light-1 absolute -top-[15%] -left-[10%] w-[80vw] h-[80vw] max-w-[1200px] max-h-[1200px] rounded-full transition-all duration-1000"
          style={{ background: theme.spot1, filter: 'blur(130px)' }}
        />

        {/* Top-Right Secondary Soft Glow */}
        <div
          className="ambient-light-2 absolute top-[15%] -right-[15%] w-[75vw] h-[75vw] max-w-[1100px] max-h-[1100px] rounded-full transition-all duration-1000"
          style={{ background: theme.spot2, filter: 'blur(140px)' }}
        />

        {/* Lower Section Ambient Glow */}
        <div
          className="ambient-light-1 absolute top-[55%] left-[10%] w-[70vw] h-[70vw] max-w-[1000px] max-h-[1000px] rounded-full transition-all duration-1000"
          style={{ background: theme.spot3, filter: 'blur(150px)' }}
        />
      </div>
    </div>
  );
}


