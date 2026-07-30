import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Activity } from 'lucide-react';

/**
 * DashboardDemo Component.
 * Simulates a beautiful analytics metrics panel.
 * It features dynamic data aggregation, reactive SVG line graphs, and live-traffic generation.
 */
export const DashboardDemo: React.FC = () => {
  const [period, setPeriod] = useState<'dia' | 'semana' | 'mes'>('semana');
  const [liveTraffic, setLiveTraffic] = useState<boolean>(false);
  const [ticks, setTicks] = useState<number>(0);

  // Generates real-time visual ticks to mimic active websocket streaming
  useEffect(() => {
    if (!liveTraffic) return;
    const interval = setInterval(() => {
      setTicks((t) => t + 1);
    }, 2000);
    return () => clearInterval(interval);
  }, [liveTraffic]);

  /**
   * Calculates simulated sales metrics based on active time period and live traffic waves.
   */
  const getKPIs = () => {
    let multiplier = 1.0;
    if (period === 'dia') multiplier = 0.14;
    if (period === 'mes') multiplier = 4.3;

    // Introduce natural variance under active traffic simulation
    const variance = liveTraffic ? (Math.sin(ticks) * 0.02 + 0.99) : 1.0;

    return {
      leads: Math.round(145 * multiplier * variance),
      ventas: Math.round(12480 * multiplier * variance),
      automatizaciones: Math.round(48120 * multiplier * variance),
      conversiones: (94.2 * (liveTraffic ? (Math.sin(ticks * 0.5) * 0.005 + 1.0) : 1.0)).toFixed(1)
    };
  };

  const { leads, ventas, automatizaciones, conversiones } = getKPIs();

  /**
   * Generates continuous line path strings dynamically to feed the SVG coordinate system.
   */
  const getLineCoordinates = () => {
    if (period === 'dia') return "10,70 40,65 70,55 100,58 130,45 160,35 190,40";
    if (period === 'mes') return "10,50 40,20 70,30 100,15 130,10 160,5 190,8";
    return "10,60 40,45 70,50 100,32 130,25 160,30 190,15"; // week coordinates default
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 text-slate-100 font-sans p-4 space-y-4 shadow-xl select-none">
      <div className="flex justify-between items-center pb-2 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-[var(--color-primary)]" />
          <h4 className="text-xs font-bold text-slate-200">Panel Métricas SaaS</h4>
        </div>
        <div className="flex items-center space-x-1.5">
          <label className="text-[8px] text-slate-400 font-bold uppercase cursor-pointer flex items-center space-x-1">
            <span className={`w-1.5 h-1.5 rounded-full inline-block ${liveTraffic ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'}`} />
            <span>Tráfico vivo</span>
          </label>
          <input
            type="checkbox"
            checked={liveTraffic}
            onChange={(e) => setLiveTraffic(e.target.checked)}
            className="w-3 h-3 rounded text-[var(--color-primary)] border-slate-700 bg-slate-800 cursor-pointer focus:ring-0"
          />
        </div>
      </div>

      {/* Tabs list */}
      <div className="flex justify-center bg-slate-950 p-1 rounded-lg border border-slate-800/85">
        {[
          { id: 'dia', label: 'Diario' },
          { id: 'semana', label: 'Semanal' },
          { id: 'mes', label: 'Mensual' }
        ].map((p) => (
          <button
            key={p.id}
            onClick={() => setPeriod(p.id as any)}
            className={`flex-1 py-1 text-[9px] font-bold rounded-md transition-colors cursor-pointer ${
              period === p.id
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Grid KPI cards */}
      <div className="grid grid-cols-2 gap-2 text-left">
        <div className="p-2 bg-slate-950/40 border border-slate-800 rounded-lg">
          <span className="text-[7.5px] text-slate-500 font-bold uppercase tracking-wider block">LEADS CAPTADOS</span>
          <div className="text-base font-black font-mono text-slate-100 mt-0.5">{leads}</div>
        </div>
        <div className="p-2 bg-slate-950/40 border border-slate-800 rounded-lg">
          <span className="text-[7.5px] text-slate-500 font-bold uppercase tracking-wider block">VENTAS BRUTAS</span>
          <div className="text-base font-black font-mono text-[var(--color-primary)] mt-0.5">€{ventas.toLocaleString()}</div>
        </div>
        <div className="p-2 bg-slate-950/40 border border-slate-800 rounded-lg">
          <span className="text-[7.5px] text-slate-500 font-bold uppercase tracking-wider block">AUTOMATIZACIONES</span>
          <div className="text-base font-black font-mono text-slate-100 mt-0.5">{automatizaciones.toLocaleString()}</div>
        </div>
        <div className="p-2 bg-slate-950/40 border border-slate-800 rounded-lg">
          <span className="text-[7.5px] text-slate-500 font-bold uppercase tracking-wider block">CONVERSIÓN WEB</span>
          <div className="text-base font-black font-mono text-emerald-400 mt-0.5">{conversiones}%</div>
        </div>
      </div>

      {/* Animated SVG line chart block */}
      <div className="p-2.5 bg-slate-950/50 border border-slate-800 rounded-xl relative">
        <span className="text-[8px] text-slate-500 font-bold uppercase text-left tracking-wide block mb-2">Evolución de Rendimiento</span>
        <div className="w-full h-16">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 200 80" fill="none">
            {/* Guides lines */}
            <line x1="0" y1="20" x2="200" y2="20" stroke="var(--color-text)" strokeWidth="1" strokeDasharray="2 2" />
            <line x1="0" y1="50" x2="200" y2="50" stroke="var(--color-text)" strokeWidth="1" strokeDasharray="2 2" />

            {/* Line graph animated path */}
            <motion.path
              key={period + ticks}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6 }}
              d={`M ${getLineCoordinates()}`}
              stroke="var(--color-primary)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default DashboardDemo;
