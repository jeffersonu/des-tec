import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCw, LayoutDashboard, ArrowRight } from 'lucide-react';

interface LeadCard {
  id: string;
  name: string;
  company: string;
  budget: string;
  status: 'nuevo' | 'calificado' | 'propuesta' | 'proyecto' | 'ganado';
}

/**
 * CRMKanbanDemo Component.
 * Illustrates a state-driven interactive sales Kanban board.
 * Users click cards to transition them, revealing contextual event-logs.
 */
export const CRMKanbanDemo: React.FC = () => {
  const [leads, setLeads] = useState<LeadCard[]>([
    { id: 'l1', name: 'Alfonso Torres', company: 'Sabor Gourmet', budget: '€1,800', status: 'nuevo' },
    { id: 'l2', name: 'Sofía Rincón', company: 'Dental Clinic', budget: '€3,400', status: 'calificado' },
    { id: 'l3', name: 'Marta Silva', company: 'LogiCargo SaaS', budget: '€5,500', status: 'propuesta' },
    { id: 'l4', name: 'Carlos Ruiz', company: 'Indie Studio', budget: '€2,500', status: 'proyecto' }
  ]);
  const [traceLog, setTraceLog] = useState<string>('Haz clic en las tarjetas para avanzar de columna.');

  /**
   * Advances the clicked lead to the next logical step in the sales funnel.
   */
  const advanceLead = (id: string) => {
    const columns: Array<'nuevo' | 'calificado' | 'propuesta' | 'proyecto' | 'ganado'> = [
      'nuevo', 'calificado', 'propuesta', 'proyecto', 'ganado'
    ];

    setLeads((prevLeads) =>
      prevLeads.map((lead) => {
        if (lead.id === id) {
          const currentIndex = columns.indexOf(lead.status);
          const nextIndex = (currentIndex + 1) % columns.length;
          const nextStatus = columns[nextIndex];
          
          let actionMsg = '';
          if (nextStatus === 'calificado') {
            actionMsg = `✓ Lead ${lead.name} calificado. n8n actualizó Google Sheets.`;
          } else if (nextStatus === 'propuesta') {
            actionMsg = `✉️ Propuesta de ${lead.budget} enviada por correo a ${lead.company}.`;
          } else if (nextStatus === 'proyecto') {
            actionMsg = `📅 Cita agendada automáticamente en Google Calendar.`;
          } else if (nextStatus === 'ganado') {
            actionMsg = `🎉 ¡Trato Cerrado! Facturación automática enviada vía Laravel API.`;
          } else {
            actionMsg = `🔄 Ciclo reiniciado para ${lead.name}.`;
          }
          setTraceLog(actionMsg);

          return { ...lead, status: nextStatus };
        }
        return lead;
      })
    );
  };

  /**
   * Column definitions for the Kanban stages.
   */
  const columnsDef = [
    { key: 'nuevo', label: 'Nuevo Lead', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
    { key: 'calificado', label: 'Calificado', color: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
    { key: 'propuesta', label: 'Propuesta', color: 'bg-purple-500/10 text-purple-500 border-purple-500/20' },
    { key: 'proyecto', label: 'En Obra', color: 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] border-[var(--color-primary)]/20' },
    { key: 'ganado', label: 'Cerrado', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' }
  ] as const;

  /**
   * Resets the board back to its original lead positions.
   */
  const handleReset = () => {
    setLeads([
      { id: 'l1', name: 'Alfonso Torres', company: 'Sabor Gourmet', budget: '€1,800', status: 'nuevo' },
      { id: 'l2', name: 'Sofía Rincón', company: 'Dental Clinic', budget: '€3,400', status: 'calificado' },
      { id: 'l3', name: 'Marta Silva', company: 'LogiCargo SaaS', budget: '€5,500', status: 'propuesta' },
      { id: 'l4', name: 'Carlos Ruiz', company: 'Indie Studio', budget: '€2,500', status: 'proyecto' }
    ]);
    setTraceLog('Haz clic en las tarjetas para avanzar de columna.');
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 text-slate-100 font-sans p-4 space-y-4 shadow-xl select-none">
      <div className="flex justify-between items-center pb-2 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <LayoutDashboard className="w-4 h-4 text-[var(--color-primary)]" />
          <h4 className="text-xs font-bold text-slate-200">Pipeline CRM Inteligente</h4>
        </div>
        <button
          onClick={handleReset}
          className="text-[10px] text-slate-400 hover:text-white flex items-center space-x-1 cursor-pointer"
        >
          <RotateCw className="w-3 h-3" />
          <span>Restablecer</span>
        </button>
      </div>

      {/* Horizontal grid container with overflow */}
      <div className="grid grid-cols-5 gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {columnsDef.map((col) => {
          const colLeads = leads.filter((l) => l.status === col.key);
          return (
            <div key={col.key} className="min-w-[100px] flex flex-col space-y-2 bg-slate-950/40 p-2 rounded-xl border border-slate-800/40">
              <div className={`text-[8.5px] font-bold text-center uppercase tracking-wide px-1.5 py-0.5 rounded-md border ${col.color}`}>
                {col.label}
              </div>
              <div className="flex-1 space-y-2 min-h-[140px]">
                <AnimatePresence mode="popLayout">
                  {colLeads.map((lead) => (
                    <motion.div
                      key={lead.id}
                      layoutId={lead.id}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                      onClick={() => advanceLead(lead.id)}
                      className="bg-slate-800 hover:bg-slate-700/80 border border-slate-700/60 p-2 rounded-lg cursor-pointer shadow-sm text-left transition-colors relative group"
                    >
                      <h5 className="text-[10px] font-bold text-slate-100 truncate">{lead.name}</h5>
                      <p className="text-[8px] text-slate-400 truncate">{lead.company}</p>
                      <div className="flex justify-between items-center mt-1.5">
                        <span className="text-[8.5px] font-mono text-[var(--color-secondary)] font-bold">{lead.budget}</span>
                        <ArrowRight className="w-2.5 h-2.5 text-slate-500 group-hover:text-[var(--color-primary)] transition-colors" />
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {colLeads.length === 0 && (
                  <div className="h-full flex items-center justify-center text-[8px] text-slate-600 italic">
                    Vacío
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Automation Terminal Alert log */}
      <div className="bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-left">
        <span className="text-[8px] text-[var(--color-primary)] font-mono font-bold block mb-1 uppercase tracking-wider">LOG DE PROCESAMIENTO AUTOMÁTICO</span>
        <div className="text-[9.5px] font-mono text-emerald-400 leading-snug">
          {traceLog}
        </div>
      </div>
    </div>
  );
};

export default CRMKanbanDemo;
