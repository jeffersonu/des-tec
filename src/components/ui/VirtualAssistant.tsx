import React, { useState, useEffect, useRef } from 'react';
import { AppConfig } from '../../types';
import { usePWA } from '../../context/PWAContext';
import { useTimeTheme } from '../../context/TimeThemeContext';
import assistantResting from '../../assets/images/destec_assistant_idle.svg';
import assistantWaving from '../../assets/images/destec_assistant_waving.svg';
import assistantBlinking from '../../assets/images/destec_assistant_blink.svg';
import assistantHappy from '../../assets/images/destec_assistant_happy.svg';

interface VirtualAssistantProps {
  config: AppConfig;
}

// ARCHITECTURE FOR FUTURE EXPANSIONS:
// You can easily change this mode to connect the assistant to custom APIs or AI models
type AssistantMode = 'whatsapp' | 'chatbot' | 'gemini' | 'n8n';
const CURRENT_MODE: AssistantMode = 'whatsapp';

export default function VirtualAssistant({ config }: VirtualAssistantProps) {
  const { isOnline } = usePWA();
  const { theme } = useTimeTheme();
  const isDark = theme.id === 'night';
  const buttonRef = useRef<HTMLDivElement>(null);

  // States for smart messages bubble & interaction
  const [currentMsgIndex, setCurrentMsgIndex] = useState(0);
  const [isBubbleVisible, setIsBubbleVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isWaving, setIsWaving] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);

  const messages = [
    'Hola 👋',
    '¿Necesitas una cotización?',
    'Estoy aquí para ayudarte.',
    'Hablemos por WhatsApp.',
    '¿Tienes un proyecto?',
    'Escríbeme.'
  ];

  // 1. ROTATING SMART MESSAGES LOOP (Pauses and resets on hover)
  useEffect(() => {
    let messageTimeout: NodeJS.Timeout;
    let rotationTimeout: NodeJS.Timeout;

    const runRotation = () => {
      // Pick a random interval between 15 and 25 seconds for the next message
      const nextDelay = Math.floor(Math.random() * (25000 - 15000 + 1)) + 15000;

      rotationTimeout = setTimeout(() => {
        if (!isHovered) {
          setCurrentMsgIndex((prev) => (prev + 1) % messages.length);
          setIsBubbleVisible(true);

          // Keep bubble visible for 6 seconds, then hide it and schedule next one
          messageTimeout = setTimeout(() => {
            setIsBubbleVisible(false);
            runRotation();
          }, 6000);
        } else {
          // If currently hovered, retry later
          runRotation();
        }
      }, nextDelay);
    };

    // First bubble triggers 8 seconds after initial load to engage visitor
    rotationTimeout = setTimeout(() => {
      if (!isHovered) {
        setIsBubbleVisible(true);
        messageTimeout = setTimeout(() => {
          setIsBubbleVisible(false);
          runRotation();
        }, 6000);
      } else {
        runRotation();
      }
    }, 8000);

    return () => {
      clearTimeout(messageTimeout);
      clearTimeout(rotationTimeout);
    };
  }, [isHovered]);

  // 2. PERIODIC AUTOMATIC WAVE/HELLO GESTURE (Every 12 seconds, lasts 1.5s — an exact
  // multiple of the 500ms wave cycle below, so it always finishes back at rest instead
  // of cutting off mid-rotation)
  useEffect(() => {
    const waveInterval = setInterval(() => {
      if (!isHovered) {
        setIsWaving(true);
        const timer = setTimeout(() => setIsWaving(false), 1500);
        return () => clearTimeout(timer);
      }
    }, 12000);

    return () => clearInterval(waveInterval);
  }, [isHovered]);

  // 2B. PERIODIC NATURAL GESTURE — mano cerca del rostro (Every ~8 seconds, lasts 900ms — un ritmo pausado y visible)
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      if (!isHovered && !isWaving) {
        setIsBlinking(true);
        const timer = setTimeout(() => setIsBlinking(false), 900);
        return () => clearTimeout(timer);
      }
    }, 8000);

    return () => clearInterval(blinkInterval);
  }, [isHovered, isWaving]);

  // 3. La flotación y el ligero balanceo periódico ahora viven en UNA sola animación
  // continua (destec-float-wrap, ver bloque <style>), en vez de alternar entre dos
  // animaciones distintas. Esto elimina el "salto" que ocurría cada vez que el
  // navegador reiniciaba una animación nueva desde cero a mitad de movimiento.

  // OPEN WHATSAPP HANDLER
  const handleOpenWA = () => {
    if (!isOnline) return;
    // Usa el número y mensaje centralizados en config (src/data.ts), para que
    // exista un único lugar donde editar el WhatsApp de todo el sitio.
    const cleanNumber = (config.whatsapp || '').replace(/[^\d]/g, '');
    const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(config.whatsappMsg || '')}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // CORE INTERACTION ROUTER
  const handleInteraction = () => {
    if (CURRENT_MODE === 'whatsapp') {
      handleOpenWA();
    } else {
      console.log('Integraciones futuras aquí.');
    }
  };

  // KEYBOARD ACCESSIBILITY SUPPORT
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleInteraction();
    }
  };

  // Hover states to show a happy/wink greeting and the WhatsApp prompt
  const handleMouseEnter = () => {
    setIsHovered(true);
    setIsBubbleVisible(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsBubbleVisible(false);
  };

  // Animación exterior: siempre la misma (flotación continua, sin cortes).
  // La animación interior (mano saludando) sí se activa/desactiva según el gesto.
  const innerAnimationClass = isWaving ? 'destec-wave-inner' : '';

  // Resuelve cuál de los 4 gestos mostrar, en orden de prioridad:
  // 1. Mano cerca del rostro (gesto pausado, ~900ms, interrumpe cualquier otro gesto)
  // 2. Feliz/guiño (mientras el cursor está encima)
  // 3. Saludo (gesto automático periódico)
  // 4. Reposo (por defecto)
  const activeAvatarImage = isBlinking
    ? assistantBlinking
    : isHovered
      ? assistantHappy
      : isWaving
        ? assistantWaving
        : assistantResting;

  return (
    <div 
      ref={buttonRef}
      id="virtual-assistant-container"
      className="fixed bottom-6 right-6 z-50 flex items-center select-none cursor-pointer"
      aria-label="Asistente virtual corporativo de Des-Tec — Hablemos por WhatsApp"
      role="button"
      tabIndex={0}
      onClick={handleInteraction}
      onKeyDown={handleKeyDown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* CSS KEYFRAMES BLOCK (Nesting pattern: parent translates, child rotates/scales) */}
      <style>{`
        @keyframes destecFloat {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          20% {
            transform: translateY(-9px) rotate(-1.5deg);
          }
          50% {
            transform: translateY(-4px) rotate(0deg);
          }
          80% {
            transform: translateY(-9px) rotate(1.5deg);
          }
        }

        @keyframes destecWave {
          0%, 100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(-4.5deg) scale(1.02);
          }
          75% {
            transform: rotate(4.5deg) scale(1.02);
          }
        }

        @keyframes destecGlow {
          0%, 100% {
            opacity: 0.18;
            transform: scale(1.0);
          }
          50% {
            opacity: 0.38;
            transform: scale(1.1);
          }
        }

        .destec-float-wrap {
          animation: destecFloat 6s ease-in-out infinite;
        }

        .destec-wave-inner {
          animation: destecWave 0.5s ease-in-out infinite;
        }

        .destec-glow-pulse {
          animation: destecGlow 4s ease-in-out infinite;
        }
      `}</style>

      {/* 1. DYNAMIC SMART SPEECH BUBBLE (Pure CSS transition layout for extreme speed) */}
      <div
        className={`absolute right-20 md:right-24 bottom-2 md:bottom-3 z-50 whitespace-nowrap px-4 py-3 rounded-2xl rounded-tr-none shadow-[0_10px_35px_rgba(147,51,234,0.18)] border backdrop-blur-md transition-all duration-300 ease-out ${
          isBubbleVisible 
            ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto' 
            : 'opacity-0 translate-y-2 scale-95 pointer-events-none'
        } ${
          isDark 
            ? 'bg-slate-950/95 border-purple-500/35' 
            : 'bg-slate-900/90 border-purple-600/30'
        }`}
      >
        {/* Custom Brand Tag */}
        <span className="block text-[8px] font-sans font-extrabold tracking-wider text-purple-400 uppercase mb-0.5 select-none">
          Des-Tec AI Support
        </span>
        {/* Speech message */}
        <p className="text-[12px] md:text-[13px] font-sans font-medium text-white leading-normal">
          {isHovered ? "¡Hola! ¿Hablamos por WhatsApp?" : messages[currentMsgIndex]}
        </p>

        {/* Bubble Tail Indicator */}
        <div 
          className={`absolute top-1/2 -translate-y-1/2 right-[-6px] w-3 h-3 rotate-45 border-t border-r backdrop-blur-md transition-colors duration-500 ${
            isDark 
              ? 'bg-slate-950 border-purple-500/35' 
              : 'bg-slate-900 border-purple-600/30'
          }`}
        />
      </div>

      {/* 2. GLOWING AND FLOATING AVATAR WRAPPER (Nested for smooth, non-conflicting transforms) */}
      <div className="relative group shrink-0 transition-all duration-300 destec-float-wrap">
        
        {/* Pure purple glow that matches the robot body's neon purple highlights */}
        <div className={`destec-glow-pulse absolute inset-x-2 bottom-4 h-12 bg-purple-500/25 blur-xl rounded-full scale-110 pointer-events-none transition-all duration-300 ${
          isHovered ? 'opacity-65 scale-125' : 'opacity-35 scale-100'
        }`} />

        {/* Waving / Interaction graphic inner container */}
        <div 
          className={`w-16 h-24 md:w-20 md:h-[120px] flex items-center justify-center relative select-none transition-all duration-300 ${innerAnimationClass} ${
            isHovered ? 'scale-105' : 'scale-100'
          }`}
          style={{ transformOrigin: 'center bottom' }}
        >
          {/* Actual Robot Avatar Graphic */}
          <img 
            src={activeAvatarImage} 
            alt="Asistente Virtual Des-Tec" 
            referrerPolicy="no-referrer"
            loading="lazy"
            className="w-full h-full object-contain transition-all duration-300 filter drop-shadow-[0_4px_14px_rgba(168,85,247,0.45)] group-hover:drop-shadow-[0_6px_22px_rgba(168,85,247,0.75)] group-hover:brightness-110"
          />

          {/* Active online glowing dot, styled beautifully over the right side of the puddle reflection */}
          {isOnline && (
            <span className="absolute bottom-2 right-4 flex h-3 w-3 z-10">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500 border-2 border-slate-950"></span>
            </span>
          )}

          {/* Offline status shield layer if offline */}
          {!isOnline && (
            <div className="absolute inset-0 bg-red-950/30 backdrop-blur-xs flex items-center justify-center rounded-xl">
              <span className="bg-red-500 text-white text-[8px] font-sans font-bold px-1.5 py-0.5 rounded-full shadow-md animate-pulse">
                OFFLINE
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

