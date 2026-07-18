import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Cpu,
  MessageSquare,
  Bot,
  Database,
  Mail,
  Calendar,
  CheckCircle2
} from 'lucide-react';

/**
 * N8nWorkflowDemo Component.
 * Simulates a visual flow-chart representing an n8n automation process.
 * Highlighting active blocks, displaying execution paths, and live logging terminal updates.
 */
export const N8nWorkflowDemo: React.FC = () => {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [activeNode, setActiveNode] = useState<string>('none');
  const [completedNodes, setCompletedNodes] = useState<string[]>([]);
  const [logMessages, setLogMessages] = useState<string[]>(['Consola lista para ejecutar webhook n8n']);

  /**
   * Sequentially runs the workflow step by step, activating nodes and pushing logs.
   */
  const runWorkflow = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setCompletedNodes([]);
    setActiveNode('whatsapp');
    setLogMessages(['[14:40:01] ⚡ Trigger: Mensaje entrante recibido de WhatsApp Business']);

    const nodes = ['whatsapp', 'ia', 'sheets', 'gmail', 'calendar'];
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      setActiveNode(node);
      // Wait for node to execute visually
      await new Promise((resolve) => setTimeout(resolve, 800));
      setCompletedNodes((prev) => [...prev, node]);

      if (node === 'whatsapp') {
        setLogMessages((prev) => [...prev, '[14:40:02] 🟢 WhatsApp: Extracción de metadatos de contacto y número de teléfono']);
      } else if (node === 'ia') {
        setLogMessages((prev) => [...prev, '[14:40:03] 🧠 Gemini AI: Extracción semántica completada. Interés calificado como "CRM SaaS"']);
      } else if (node === 'sheets') {
        setLogMessages((prev) => [...prev, '[14:40:04] 📊 Google Sheets: Lead insertado en Fila 491']);
      } else if (node === 'gmail') {
        setLogMessages((prev) => [...prev, '[14:40:05] ✉️ Gmail: Sincronizado. Propuesta técnica en PDF enviada al correo del lead']);
      } else if (node === 'calendar') {
        setLogMessages((prev) => [...prev, '[14:40:06] 📅 Google Calendar: Bloque de reunión consultiva bloqueado para el lunes']);
      }
    }

    setActiveNode('done');
    setLogMessages((prev) => [...prev, '✓ [14:40:07] AUTOMATIZACIÓN COMPLETADA CON ÉXITO EN 4.0 SEGUNDOS']);
    setIsRunning(false);
  };

  /**
   * Resolves CSS border colors and shadow classes for each node depending on its state.
   */
  const getBorderColor = (nodeId: string) => {
    if (activeNode === nodeId) {
      return 'border-[var(--color-primary)] shadow-[0_0_10px_rgba(37, 99, 235,0.35)] bg-slate-800';
    }
    if (completedNodes.includes(nodeId)) {
      return 'border-emerald-500 bg-slate-900/90';
    }
    return 'border-slate-800 bg-slate-950/60';
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 text-slate-100 font-sans p-4 space-y-4 shadow-xl select-none">
      <div className="flex justify-between items-center pb-2 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <Cpu className="w-4 h-4 text-[var(--color-primary)]" />
          <h4 className="text-xs font-bold text-slate-200">Simulador de Flujo n8n</h4>
        </div>
        <button
          onClick={runWorkflow}
          disabled={isRunning}
          className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
            isRunning
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
              : 'bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white shadow-md shadow-[var(--color-primary)]/10'
          }`}
        >
          {isRunning ? 'Ejecutando...' : 'Ejecutar flujo'}
        </button>
      </div>

      {/* Graphic nodes visual canvas */}
      <div className="relative flex items-center justify-between py-6 px-1 border border-slate-800 bg-slate-950/40 rounded-xl overflow-hidden min-h-[100px]">
        {/* SVG connection lines with flowing animated dashes */}
        <svg className="absolute inset-x-0 top-1/2 -translate-y-1/2 w-full h-8 z-0 overflow-visible pointer-events-none" fill="none">
          <path
            d="M 30 15 L 290 15"
            stroke={isRunning ? 'var(--color-primary)' : 'var(--color-text-secondary)'}
            strokeWidth="2"
            strokeDasharray={isRunning ? '4 4' : 'none'}
            className={isRunning ? 'animate-[dash_10s_linear_infinite]' : ''}
            style={{ strokeDashoffset: isRunning ? 100 : 0 }}
          />
          <style>{`
            @keyframes dash {
              to {
                stroke-dashoffset: -100;
              }
            }
          `}</style>
        </svg>

        {/* Node 1: WhatsApp Trigger */}
        <div className={`relative z-10 p-2.5 rounded-xl border flex flex-col items-center transition-all duration-300 w-[55px] ${getBorderColor('whatsapp')}`}>
          <MessageSquare className={`w-4.5 h-4.5 ${completedNodes.includes('whatsapp') ? 'text-emerald-400' : 'text-slate-400'}`} />
          <span className="text-[7.5px] font-bold mt-1.5 truncate">WhatsApp</span>
          {completedNodes.includes('whatsapp') && <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400 absolute -top-1 -right-1 bg-slate-950 rounded-full" />}
        </div>

        {/* Node 2: IA Analysis */}
        <div className={`relative z-10 p-2.5 rounded-xl border flex flex-col items-center transition-all duration-300 w-[55px] ${getBorderColor('ia')}`}>
          <Bot className={`w-4.5 h-4.5 ${completedNodes.includes('ia') ? 'text-emerald-400' : 'text-slate-400'}`} />
          <span className="text-[7.5px] font-bold mt-1.5 truncate">IA Gemini</span>
          {completedNodes.includes('ia') && <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400 absolute -top-1 -right-1 bg-slate-950 rounded-full" />}
        </div>

        {/* Node 3: Sheets Database */}
        <div className={`relative z-10 p-2.5 rounded-xl border flex flex-col items-center transition-all duration-300 w-[55px] ${getBorderColor('sheets')}`}>
          <Database className={`w-4.5 h-4.5 ${completedNodes.includes('sheets') ? 'text-emerald-400' : 'text-slate-400'}`} />
          <span className="text-[7.5px] font-bold mt-1.5 truncate">Sheets</span>
          {completedNodes.includes('sheets') && <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400 absolute -top-1 -right-1 bg-slate-950 rounded-full" />}
        </div>

        {/* Node 4: Gmail Mail */}
        <div className={`relative z-10 p-2.5 rounded-xl border flex flex-col items-center transition-all duration-300 w-[55px] ${getBorderColor('gmail')}`}>
          <Mail className={`w-4.5 h-4.5 ${completedNodes.includes('gmail') ? 'text-emerald-400' : 'text-slate-400'}`} />
          <span className="text-[7.5px] font-bold mt-1.5 truncate">Gmail</span>
          {completedNodes.includes('gmail') && <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400 absolute -top-1 -right-1 bg-slate-950 rounded-full" />}
        </div>

        {/* Node 5: Calendar Invite */}
        <div className={`relative z-10 p-2.5 rounded-xl border flex flex-col items-center transition-all duration-300 w-[55px] ${getBorderColor('calendar')}`}>
          <Calendar className={`w-4.5 h-4.5 ${completedNodes.includes('calendar') ? 'text-emerald-400' : 'text-slate-400'}`} />
          <span className="text-[7.5px] font-bold mt-1.5 truncate">Calendar</span>
          {completedNodes.includes('calendar') && <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400 absolute -top-1 -right-1 bg-slate-950 rounded-full" />}
        </div>
      </div>

      {/* Terminal logs console */}
      <div className="bg-slate-950 border border-slate-800 p-2 rounded-xl text-left font-mono">
        <span className="text-[8px] text-slate-500 font-bold block mb-1">TERMINAL LOG OUTPUT</span>
        <div className="space-y-1 max-h-[80px] overflow-y-auto text-[8.5px] scrollbar-thin text-slate-400">
          {logMessages.map((msg, idx) => (
            <div
              key={idx}
              className={`${
                msg.startsWith('✓') ? 'text-emerald-400 font-bold' : msg.startsWith('[') ? 'text-slate-300' : 'text-slate-500'
              }`}
            >
              {msg}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default N8nWorkflowDemo;
