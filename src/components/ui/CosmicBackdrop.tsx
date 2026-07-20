import React from 'react';

/**
 * CosmicBackdrop
 * ---------------------------------------------------------------------------
 * Fondo espacial inmersivo y continuo para todo el sitio: nebulosas azul
 * petróleo, polvo cósmico y planetas desenfocados, con capas a distinta
 * profundidad que se mueven a velocidades ligeramente distintas (parallax)
 * mediante animaciones CSS muy lentas (60-140s por ciclo). Es puro CSS —
 * no usa canvas ni JS — así que no compite en rendimiento con
 * InteractiveStarsCanvas (el starfield con partículas), que sigue vivo
 * encima de esta capa.
 *
 * Se monta UNA sola vez en App.tsx, fijo (`fixed inset-0`), detrás de todo
 * el contenido (z-index muy negativo) y con `pointer-events-none` para no
 * interferir con ningún clic, formulario, ni el asistente virtual.
 * ---------------------------------------------------------------------------
 */
export default function CosmicBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-[60] pointer-events-none overflow-hidden"
      style={{ background: 'var(--color-support)' }}
    >
      <style>{`
        @keyframes cosmicDriftSlow {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(2%, -3%, 0) scale(1.04); }
        }
        @keyframes cosmicDriftSlower {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(-3%, 2%, 0) scale(1.06); }
        }
        @keyframes cosmicDriftPlanet {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(-1.5%, 1.5%, 0); }
        }
        @keyframes cosmicPulse {
          0%, 100% { opacity: 0.55; }
          50% { opacity: 0.85; }
        }
        .cosmic-layer-1 { animation: cosmicDriftSlow 90s ease-in-out infinite; }
        .cosmic-layer-2 { animation: cosmicDriftSlower 130s ease-in-out infinite; }
        .cosmic-layer-3 { animation: cosmicDriftPlanet 110s ease-in-out infinite; }
        .cosmic-pulse { animation: cosmicPulse 14s ease-in-out infinite; }

        @media (prefers-reduced-motion: reduce) {
          .cosmic-layer-1, .cosmic-layer-2, .cosmic-layer-3, .cosmic-pulse {
            animation: none !important;
          }
        }
      `}</style>

      {/* Base deep-space gradient wash */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 120% 80% at 50% -10%, var(--color-secondary) 0%, var(--color-support) 45%, #05070A 100%)',
        }}
      />

      {/* Nebula layer 1 — deep blue, top-left, slow drift */}
      <div
        className="cosmic-layer-1 absolute -top-1/4 -left-1/4 w-[70vw] h-[70vw] rounded-full opacity-40"
        style={{
          background:
            'radial-gradient(circle, rgba(37,99,235,0.28) 0%, rgba(15,59,76,0.14) 45%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Nebula layer 2 — petrol/cyan, bottom-right, slower drift */}
      <div
        className="cosmic-layer-2 absolute -bottom-1/3 -right-1/4 w-[65vw] h-[65vw] rounded-full opacity-35"
        style={{
          background:
            'radial-gradient(circle, rgba(34,211,238,0.16) 0%, rgba(15,59,76,0.12) 50%, transparent 72%)',
          filter: 'blur(70px)',
        }}
      />

      {/* Nebula layer 3 — central soft glow, breathing pulse */}
      <div
        className="cosmic-pulse absolute top-1/3 left-1/2 -translate-x-1/2 w-[50vw] h-[40vw] rounded-full"
        style={{
          background: 'radial-gradient(ellipse, rgba(59,130,246,0.10) 0%, transparent 68%)',
          filter: 'blur(50px)',
        }}
      />

      {/* Distant blurred planet — upper right */}
      <div
        className="cosmic-layer-3 absolute top-[8%] right-[8%] w-[14vw] h-[14vw] max-w-[220px] max-h-[220px] rounded-full opacity-50"
        style={{
          background:
            'radial-gradient(circle at 35% 30%, rgba(148,163,184,0.5) 0%, rgba(15,59,76,0.35) 45%, transparent 75%)',
          filter: 'blur(3px)',
        }}
      />

      {/* Distant blurred planet — lower left, smaller and dimmer for depth */}
      <div
        className="cosmic-layer-3 absolute bottom-[12%] left-[6%] w-[8vw] h-[8vw] max-w-[130px] max-h-[130px] rounded-full opacity-30"
        style={{
          background:
            'radial-gradient(circle at 40% 35%, rgba(37,99,235,0.45) 0%, rgba(11,15,20,0.4) 50%, transparent 75%)',
          filter: 'blur(2px)',
        }}
      />

      {/* Very subtle cosmic dust / energy line streaks */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          background:
            'linear-gradient(115deg, transparent 40%, rgba(148,163,184,0.5) 50%, transparent 60%)',
          backgroundSize: '200% 200%',
        }}
      />
    </div>
  );
}
