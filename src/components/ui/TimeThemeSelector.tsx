import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTimeTheme } from '../../context/TimeThemeContext';
import { themes, TimeThemeId } from '../../utils/theme';
import { Sunrise, Sun, Sunset, Moon, Clock, Sliders, Info, Sparkles } from 'lucide-react';

/**
 * TimeThemeSelector Component.
 * Floating controller in the bottom-right of the viewport.
 * Features an intuitive slider (0 to 23 hours) and quick presets to swap themes in real time.
 */
export default function TimeThemeSelector() {
  const {
    activeThemeId,
    theme,
    isRealTime,
    systemHour,
    setThemeById,
    setRealTime,
  } = useTimeTheme();

  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(() => {
    if (typeof window !== 'undefined') {
      return (
        window.location.search.includes('theme_debug=true') || 
        window.location.hash === '#theme-debug'
      );
    }
    return false;
  });

  // Secret keyboard listener: Ctrl + Shift + H to toggle visibility of the simulator
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'H' || e.key === 'h')) {
        setIsVisible(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isVisible) return null;

  const getIconForTheme = (id: TimeThemeId, className = "w-4 h-4") => {
    switch (id) {
      case 'morning':
        return <Sunrise className={`${className} text-[#D97706]`} />;
      case 'midday':
        return <Sun className={`${className} text-[#0EA5E9]`} />;
      case 'afternoon':
        return <Sunset className={`${className} text-[var(--color-primary)]`} />;
      case 'night':
        return <Moon className={`${className} text-[var(--color-primary)]`} />;
    }
  };

  const getThemeDisplayName = (id: TimeThemeId) => {
    switch (id) {
      case 'morning': return 'Mañana';
      case 'midday': return 'Mediodía';
      case 'afternoon': return 'Tarde';
      case 'night': return 'Noche';
    }
  };

  const handleHourSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hour = Number(e.target.value);
    // Find matching theme for this hour
    if (hour >= 6 && hour < 12) setThemeById('morning');
    else if (hour >= 12 && hour < 17) setThemeById('midday');
    else if (hour >= 17 && hour < 20) setThemeById('afternoon');
    else setThemeById('night');
  };

  // Map hour to represent value inside the manual slider
  const getSimulatedHour = () => {
    if (isRealTime) return systemHour;
    switch (activeThemeId) {
      case 'morning': return 9;
      case 'midday': return 14;
      case 'afternoon': return 18;
      case 'night': return 22;
    }
  };

  return (
    <>
      {/* FLOATING ACTION TRIGGER */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        id="time-selector-trigger"
        className="fixed bottom-6 right-6 z-40 bg-white/85 hover:bg-white border border-[var(--color-primary)]/30 hover:border-[var(--color-primary)]/80 text-[var(--color-secondary)] px-4 py-2.5 rounded-full shadow-lg transition-all flex items-center space-x-2 font-sans text-xs interactive-hover backdrop-blur-md"
      >
        <span className="relative flex h-2 w-2">
          {isRealTime ? (
            <>
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </>
          ) : (
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-primary)]" />
          )}
        </span>
        {getIconForTheme(activeThemeId, "w-4.5 h-4.5")}
        <span className="font-extrabold tracking-wide text-slate-800 uppercase">
          {getThemeDisplayName(activeThemeId)}
        </span>
      </button>

      {/* DETAILED CONTROLS DIALOG */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Click-away backdrop */}
            <div
              className="fixed inset-0 z-40 bg-black/10 backdrop-blur-xs"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 15 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="fixed bottom-20 right-6 z-50 w-80 bg-white border border-slate-200/80 rounded-2xl shadow-2xl p-5 text-left font-sans text-slate-800"
            >
              {/* Header */}
              <div className="flex justify-between items-start pb-3 border-b border-slate-100">
                <div>
                  <h4 className="text-xs font-black text-slate-900 tracking-wider uppercase flex items-center space-x-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                    <span>Órbita de Luz Des-Tec</span>
                  </h4>
                  <p className="text-[10px] text-slate-400">La interfaz se adapta según la hora</p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-slate-400 hover:text-slate-900 text-xs font-bold font-mono p-1 hover:bg-slate-50 rounded"
                >
                  ✕
                </button>
              </div>

              {/* Real-time Toggle */}
              <div className="py-3 flex justify-between items-center bg-slate-50 px-3 rounded-xl border border-slate-100 mt-3">
                <div className="flex items-center space-x-2">
                  <Clock className={`w-4 h-4 ${isRealTime ? 'text-emerald-500 animate-spin-slow' : 'text-slate-400'}`} />
                  <div>
                    <span className="text-[11px] font-extrabold text-slate-800 block">Hora en Tiempo Real</span>
                    <span className="text-[9px] text-slate-500">{isRealTime ? `Auto-adaptado (Sist: ${String(systemHour).padStart(2, '0')}:00)` : 'Desactivado (Simulado)'}</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={isRealTime}
                  onChange={(e) => setRealTime(e.target.checked)}
                  className="w-4 h-4 rounded text-[var(--color-primary)] border-slate-300 focus:ring-0 cursor-pointer"
                />
              </div>

              {/* Theme presets grid */}
              <div className="mt-4 space-y-2">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Fases del Día</span>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(themes) as TimeThemeId[]).map((id) => {
                    const preset = themes[id];
                    const isActive = activeThemeId === id;
                    return (
                      <button
                        key={id}
                        onClick={() => setThemeById(id)}
                        className={`flex flex-col items-start p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                          isActive
                            ? 'bg-[var(--color-primary)]/5 border-[var(--color-primary)] shadow-sm'
                            : 'bg-slate-50/50 border-slate-100 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center space-x-1.5 mb-1">
                          {getIconForTheme(id, "w-4 h-4")}
                          <span className={`text-[11px] font-extrabold ${isActive ? 'text-[var(--color-primary)]' : 'text-slate-700'}`}>
                            {preset.name}
                          </span>
                        </div>
                        <span className="text-[8.5px] text-slate-400 font-mono">{preset.range}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Interactive Hour Slider */}
              <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="font-bold text-slate-400 uppercase tracking-wider">Simulador de Hora</span>
                  <span className="font-mono font-bold text-[var(--color-primary)] bg-[var(--color-primary)]/10 px-1.5 py-0.5 rounded">
                    {String(getSimulatedHour()).padStart(2, '0')}:00 hrs
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="23"
                  value={getSimulatedHour()}
                  onChange={handleHourSliderChange}
                  className="w-full accent-[var(--color-primary)] h-1.5 bg-slate-100 rounded-lg cursor-pointer"
                />
              </div>

              {/* Context Details Card */}
              <div className="mt-4 p-2.5 bg-slate-50 rounded-xl border border-slate-100/80 flex items-start space-x-2">
                <Info className="w-3.5 h-3.5 text-[var(--color-secondary)] shrink-0 mt-0.5" />
                <p className="text-[9.5px] text-slate-500 leading-snug">
                  {theme.description}
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
