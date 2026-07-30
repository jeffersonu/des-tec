import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { RotateCw, Send } from 'lucide-react';

interface ChatMessage {
  id: number;
  sender: 'bot' | 'user';
  text: string;
  time: string;
}

/**
 * WhatsAppChatDemo Component.
 * Simulates an interactive WhatsApp conversation with our business chatbot.
 * Illustrates dynamic customer triage, custom variables (company name), and instant lead notification.
 */
export const WhatsAppChatDemo: React.FC = () => {
  const [chatStep, setChatStep] = useState<number>(0);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      sender: 'bot',
      text: '¡Hola! Bienvenido a Des-Tec. 🤖 ¿Buscas digitalizar o automatizar tu negocio?',
      time: '14:38'
    }
  ]);
  const [typing, setTyping] = useState<boolean>(false);
  const [companyName, setCompanyName] = useState<string>('');
  const [customInput, setCustomInput] = useState<string>('');
  const [automationLog, setAutomationLog] = useState<string[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  /**
   * Simulates typing latency before the chatbot replies.
   */
  const addBotMessage = (text: string, delay = 1200) => {
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      const now = new Date();
      const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
      setMessages((prev) => [...prev, { id: Date.now(), sender: 'bot', text, time: timeStr }]);
    }, delay);
  };

  /**
   * Handles selecting quick-reply triage buttons.
   */
  const handleStepSelect = (optionText: string) => {
    if (chatStep !== 0) return;
    const now = new Date();
    const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
    setMessages((prev) => [...prev, { id: Date.now(), sender: 'user', text: optionText, time: timeStr }]);
    setChatStep(1);
    addBotMessage('¡Excelente decisión! Una web de alto impacto o un sistema CRM multiplicarán tus ventas. Para cotizarte con precisión, ¿cuál es el nombre de tu empresa?');
  };

  /**
   * Submits custom text input (representing company name) and fires CRM webhook simulation.
   */
  const handleCompanySubmit = (name: string) => {
    if (!name.trim()) return;
    setCompanyName(name);
    const now = new Date();
    const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
    setMessages((prev) => [...prev, { id: Date.now(), sender: 'user', text: name, time: timeStr }]);
    setChatStep(2);
    setCustomInput('');

    // Trigger CRM/Automation log outputs
    addBotMessage(`¡Perfecto, ${name}! Acabo de registrar tu solicitud en nuestra cola de atención. Un consultor experto te contactará por WhatsApp en breve.`);
    
    setTimeout(() => {
      setAutomationLog([
        '✓ Contacto calificado e insertado en CRM',
        '✓ Webhook n8n disparado con éxito',
        '✓ Notificación enviada al equipo comercial'
      ]);
    }, 2000);
  };

  /**
   * Restores the simulation to its initial state.
   */
  const resetChat = () => {
    setChatStep(0);
    setCompanyName('');
    setCustomInput('');
    setAutomationLog([]);
    setMessages([
      {
        id: 1,
        sender: 'bot',
        text: '¡Hola! Bienvenido a Des-Tec. 🤖 ¿Buscas digitalizar o automatizar tu negocio?',
        time: '14:38'
      }
    ]);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 text-white font-sans max-w-[320px] mx-auto shadow-xl">
      {/* Phone Header */}
      <div className="bg-slate-950 px-3 py-3 flex items-center justify-between border-b border-slate-800 select-none">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-[var(--color-secondary)]/20 flex items-center justify-center text-[var(--color-secondary)] border border-[var(--color-secondary)]/40 font-bold text-xs">
            DT
          </div>
          <div className="text-left">
            <h5 className="text-[11px] font-bold tracking-wide text-slate-100">Soporte Des-Tec</h5>
            <span className="text-[9px] text-emerald-400 flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
              <span>En línea</span>
            </span>
          </div>
        </div>
        <button
          onClick={resetChat}
          className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          title="Reiniciar chat"
        >
          <RotateCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Chat Messages viewport */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 min-h-[220px] max-h-[240px] bg-slate-950/45 scrollbar-thin">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col max-w-[85%] ${msg.sender === 'user' ? 'self-end items-end ml-auto' : 'self-start items-start mr-auto'}`}
          >
            <div
              className={`text-xs px-3 py-2 rounded-xl leading-snug text-left ${
                msg.sender === 'user'
                  ? 'bg-[var(--color-primary)] text-white rounded-tr-none'
                  : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700/50'
              }`}
            >
              {msg.text}
            </div>
            <span className="text-[8px] text-slate-500 mt-1 px-1 font-mono">{msg.time}</span>
          </div>
        ))}

        {typing && (
          <div className="flex flex-col max-w-[85%] self-start items-start">
            <div className="bg-slate-800 text-slate-300 text-xs px-3 py-2 rounded-xl rounded-tl-none border border-slate-700/50 flex items-center space-x-1">
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Automation Logs Overlay */}
      {automationLog.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-emerald-950/90 border-t border-emerald-800 p-2 text-[9px] text-left text-emerald-300 font-mono space-y-0.5 select-none"
        >
          {automationLog.map((log, idx) => (
            <div key={idx} className="flex items-center space-x-1.5">
              <span>{log}</span>
            </div>
          ))}
        </motion.div>
      )}

      {/* Interactive Controls Input / Quick Options */}
      <div className="p-2.5 bg-slate-950 border-t border-slate-800">
        {chatStep === 0 && (
          <div className="flex flex-col space-y-1.5">
            <button
              onClick={() => handleStepSelect('Hola, necesito una página web')}
              className="text-[10px] font-semibold text-left py-1.5 px-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700/60 rounded-lg text-slate-200 transition-colors cursor-pointer"
            >
              🚀 "Hola, necesito una página web"
            </button>
            <button
              onClick={() => handleStepSelect('Me interesa una automatización CRM')}
              className="text-[10px] font-semibold text-left py-1.5 px-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700/60 rounded-lg text-slate-200 transition-colors cursor-pointer"
            >
              ⚙️ "Me interesa una automatización CRM"
            </button>
          </div>
        )}

        {chatStep === 1 && (
          <div className="flex space-x-1.5">
            <input
              type="text"
              placeholder="Escribe el nombre de tu empresa..."
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCompanySubmit(customInput || 'Mi Negocio S.L.');
              }}
              className="flex-1 bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 rounded-lg px-2 py-1.5 focus:outline-none focus:border-[var(--color-primary)]"
            />
            <button
              onClick={() => handleCompanySubmit(customInput || 'Mi Negocio S.L.')}
              className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white p-1.5 rounded-lg transition-colors cursor-pointer flex items-center justify-center"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {chatStep === 2 && (
          <div className="text-center py-1 text-[10px] text-slate-400 font-semibold font-mono uppercase tracking-wider select-none">
            ✓ Flujo de simulación completado
          </div>
        )}
      </div>
    </div>
  );
};

export default WhatsAppChatDemo;
