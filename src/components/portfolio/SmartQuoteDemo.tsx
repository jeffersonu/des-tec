import React, { useState } from 'react';
import { Calculator } from 'lucide-react';

/**
 * SmartQuoteDemo Component.
 * Implements a dynamic project budget and timeline calculator.
 * Features an interactive user interface to gauge scope, speed, and standard/premium options.
 */
export const SmartQuoteDemo: React.FC = () => {
  const [projectType, setProjectType] = useState<'landing' | 'tienda' | 'crm' | 'automation'>('landing');
  const [numUsers, setNumUsers] = useState<number>(5);
  const [timeGoal, setTimeGoal] = useState<number>(3); // 1 = Express, 3 = Normal, 5 = Flexible
  const [level, setLevel] = useState<'estandar' | 'premium' | 'corporativo'>('estandar');

  /**
   * Computes budget, delivery timeline, and technical complexity based on state variables.
   */
  const getCalculatedData = () => {
    let basePrice = 1200;
    let baseDays = 6;

    if (projectType === 'tienda') {
      basePrice = 2400;
      baseDays = 12;
    } else if (projectType === 'crm') {
      basePrice = 3800;
      baseDays = 22;
    } else if (projectType === 'automation') {
      basePrice = 1800;
      baseDays = 8;
    }

    // Level multiplier
    let levelMultiplier = 1.0;
    if (level === 'premium') levelMultiplier = 1.45;
    if (level === 'corporativo') levelMultiplier = 2.15;

    // Time priority multiplier (Express charge or Flexible timeline discount)
    let speedPriceMultiplier = 1.0;
    let speedDaysMultiplier = 1.0;
    if (timeGoal === 1) {
      speedPriceMultiplier = 1.25; // 25% rush charge
      speedDaysMultiplier = 0.65;  // 35% time reduction
    } else if (timeGoal === 5) {
      speedPriceMultiplier = 0.9;  // 10% flexible discount
      speedDaysMultiplier = 1.35;  // relaxed timeline
    }

    const userExtraCost = (numUsers - 1) * 15 * levelMultiplier;
    const finalPrice = Math.round((basePrice * levelMultiplier * speedPriceMultiplier) + userExtraCost);
    const finalDays = Math.ceil(baseDays * levelMultiplier * speedDaysMultiplier);

    let complexity = 'Baja / Rápido';
    let complexityColor = 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10';
    if (finalDays >= 10 && finalDays < 20) {
      complexity = 'Media';
      complexityColor = 'text-amber-400 border-amber-500/20 bg-amber-500/10';
    } else if (finalDays >= 20 && finalDays < 35) {
      complexity = 'Alta';
      complexityColor = 'text-orange-400 border-orange-500/20 bg-orange-500/10';
    } else if (finalDays >= 35) {
      complexity = 'Complejo / Corporativo';
      complexityColor = 'text-purple-400 border-purple-500/20 bg-purple-500/10';
    }

    return { price: finalPrice, days: finalDays, complexity, complexityColor };
  };

  const { price, days, complexity, complexityColor } = getCalculatedData();

  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 text-slate-100 font-sans p-4 space-y-4 shadow-xl select-none">
      <div className="flex justify-between items-center pb-2 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <Calculator className="w-4 h-4 text-[var(--color-primary)]" />
          <h4 className="text-xs font-bold text-slate-200">Cotizador en Tiempo Real</h4>
        </div>
        <span className="text-[9px] bg-[var(--color-primary)]/15 border border-[var(--color-primary)]/30 text-[var(--color-primary)] px-2 py-0.5 rounded-full font-bold">
          Actualización instantánea
        </span>
      </div>

      <div className="space-y-3.5 text-left text-xs flex-1">
        {/* Solution Category */}
        <div className="space-y-1">
          <label className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wide">Tipo de Solución</label>
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { id: 'landing', label: 'Landing Page' },
              { id: 'tienda', label: 'E-Commerce' },
              { id: 'crm', label: 'CRM / Software' },
              { id: 'automation', label: 'Flujo n8n' }
            ].map((pt) => (
              <button
                key={pt.id}
                onClick={() => setProjectType(pt.id as any)}
                className={`py-1.5 px-2 text-[9.5px] font-bold rounded-lg transition-colors border cursor-pointer ${
                  projectType === pt.id
                    ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] border-[var(--color-primary)]/30'
                    : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {pt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Quality level */}
        <div className="space-y-1">
          <label className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wide">Nivel de Acabado</label>
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { id: 'estandar', label: 'Estándar' },
              { id: 'premium', label: 'Premium' },
              { id: 'corporativo', label: 'Corporativo' }
            ].map((l) => (
              <button
                key={l.id}
                onClick={() => setLevel(l.id as any)}
                className={`py-1 px-1.5 text-[9px] font-bold rounded-lg transition-colors border cursor-pointer ${
                  level === l.id
                    ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] border-[var(--color-primary)]/30'
                    : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Sliders */}
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <label className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wide">Usuarios / Puestos</label>
            <span className="text-[10px] font-bold font-mono text-[var(--color-secondary)]">{numUsers} pers.</span>
          </div>
          <input
            type="range"
            min="1"
            max="50"
            value={numUsers}
            onChange={(e) => setNumUsers(Number(e.target.value))}
            className="w-full accent-[var(--color-primary)] h-1 bg-slate-800 rounded-lg cursor-pointer"
          />
        </div>

        {/* Time priority */}
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <label className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wide">Prioridad de Entrega</label>
            <span className="text-[10px] font-bold text-slate-400 font-mono">
              {timeGoal === 1 ? 'Express / Crítico' : timeGoal === 5 ? 'Flexible' : 'Normal'}
            </span>
          </div>
          <div className="flex justify-between items-center space-x-2">
            <input
              type="range"
              min="1"
              max="5"
              step="2"
              value={timeGoal}
              onChange={(e) => setTimeGoal(Number(e.target.value))}
              className="w-full accent-[var(--color-primary)] h-1 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Numerical calculated output cards */}
      <div className="p-3 bg-slate-950 border border-slate-800/80 rounded-xl grid grid-cols-2 gap-2 text-left">
        <div>
          <span className="text-[7.5px] font-bold text-slate-500 uppercase tracking-wider block">PRECIO ESTIMADO</span>
          <div className="text-xl font-black font-mono text-[var(--color-primary)] mt-0.5">€{price.toLocaleString()}</div>
        </div>
        <div>
          <span className="text-[7.5px] font-bold text-slate-500 uppercase tracking-wider block">TIEMPO ESTIMADO</span>
          <div className="text-xl font-black font-mono text-slate-200 mt-0.5">{days} días</div>
        </div>
        <div className="col-span-2 pt-2 border-t border-slate-800/60 flex items-center justify-between">
          <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider">Complejidad Técnica</span>
          <span className={`text-[8.5px] font-bold font-mono px-2 py-0.5 rounded border ${complexityColor}`}>
            {complexity}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SmartQuoteDemo;
