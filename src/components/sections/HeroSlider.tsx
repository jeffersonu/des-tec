import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Cpu, 
  Database, 
  Network, 
  Sparkles, 
  ArrowRight,
  Shield,
  Zap,
  Layers,
  Code,
  Play,
  Terminal,
  Activity,
  Server,
  Plus,
  Minus,
  Check,
  Globe,
  RefreshCw,
  TrendingUp,
  Sliders
} from 'lucide-react';

// Gorgeous bespoke SVGs for the technology floating bubbles
const TECH_BUBBLES = [
  {
    id: 'n8n',
    name: 'n8n Automation',
    desc: 'Flujos lógicos, integraciones de API y orquestación de bots.',
    color: 'from-[#FF6F61] to-[#E05345]',
    glowColor: 'rgba(255,111,97,0.35)',
    svg: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5">
        <circle cx="6" cy="12" r="2.5" />
        <circle cx="18" cy="6" r="2.5" />
        <circle cx="18" cy="18" r="2.5" />
        <path d="M6 12 L18 6 M6 12 L18 18" />
      </svg>
    )
  },
  {
    id: 'react',
    name: 'React 18 / Vite',
    desc: 'Interfaces interactivas ultrarrápidas con transiciones fluidas.',
    color: 'from-[#00D8FF] to-[#00B4D8]',
    glowColor: 'rgba(0,216,255,0.35)',
    svg: (
      <svg viewBox="-11.5 -10.23174 23 20.46348" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2">
        <ellipse rx="11" ry="4.2"/>
        <ellipse rx="11" ry="4.2" transform="rotate(60)"/>
        <ellipse rx="11" ry="4.2" transform="rotate(120)"/>
        <circle r="2" fill="currentColor"/>
      </svg>
    )
  },
  {
    id: 'node',
    name: 'Node.js Core',
    desc: 'Servidores rápidos con arquitectura dirigida por eventos.',
    color: 'from-[#339933] to-[#2B802B]',
    glowColor: 'rgba(51,153,51,0.35)',
    svg: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2L3.5 7v10L12 22l8.5-5V7L12 2z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 22V12" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 12l8.5-5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 12L3.5 7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    desc: 'Código robusto, autocompletado y tipado de nivel empresarial.',
    color: 'from-[#3178C6] to-[#235A97]',
    glowColor: 'rgba(49,120,198,0.35)',
    svg: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="currentColor">
        <path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0H1.125zm14.49 14.156c.144-.065.291-.12.433-.173.35-.125.7-.225 1.05-.308.275-.065.549-.093.816-.093.591 0 1.045.148 1.36.442.316.294.473.743.473 1.348 0 .515-.136.931-.408 1.246-.272.316-.656.551-1.15.705a6.014 6.014 0 0 1-1.748.21c-.482 0-.965-.05-1.448-.15a6.764 6.764 0 0 1-1.393-.45l.432-2.124zm-6.666 4.6c-.66 0-1.272-.08-1.838-.242a5.46 5.46 0 0 1-1.558-.707l.635-1.92c.316.196.685.378 1.106.545.422.166.868.25 1.338.25.433 0 .762-.073.987-.221.226-.148.339-.379.339-.693 0-.173-.043-.318-.13-.434a1.44 1.44 0 0 0-.374-.334c-.163-.1-.383-.198-.661-.295-.591-.212-1.077-.442-1.458-.69a2.76 2.76 0 0 1-.954-1.018c-.23-.424-.344-.94-.344-1.547 0-.583.15-1.096.452-1.54a3.172 3.172 0 0 1 1.282-1.076c.553-.277 1.23-.416 2.03-.416.586 0 1.144.07 1.674.209.53.14 1.003.344 1.42.613l-.686 1.868a4.116 4.116 0 0 0-1.114-.408 3.322 3.322 0 0 0-.923-.122c-.374 0-.663.067-.866.2-.203.134-.305.334-.305.6 0 .153.04.282.12.385.08.104.201.203.364.295.163.093.386.187.67.283.606.204 1.1.433 1.482.686.383.253.684.568.905.945.22.378.332.855.332 1.433 0 .616-.146 1.155-.44 1.616-.292.46-.723.818-1.291 1.073-.568.255-1.272.382-2.112.382z"/>
      </svg>
    )
  },
  {
    id: 'docker',
    name: 'Docker Containers',
    desc: 'Empaquetado inmutable y despliegues estables en la nube.',
    color: 'from-[#2496ED] to-[#1D74B7]',
    glowColor: 'rgba(36,150,237,0.35)',
    svg: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="5" y="4" width="4" height="4" rx="1" />
        <rect x="10" y="4" width="4" height="4" rx="1" />
        <rect x="15" y="4" width="4" height="4" rx="1" />
        <rect x="5" y="9" width="4" height="4" rx="1" />
        <rect x="10" y="9" width="4" height="4" rx="1" />
        <rect x="15" y="9" width="4" height="4" rx="1" />
        <path d="M2 15h20a1 1 0 011 1v2a3 3 0 01-3 3H4a3 3 0 01-3-3v-2a1 1 0 011-1z" />
      </svg>
    )
  },
  {
    id: 'postgres',
    name: 'PostgreSQL',
    desc: 'Bases de datos relacionales robustas, seguras y de alto volumen.',
    color: 'from-[#4169E1] to-[#3052C1]',
    glowColor: 'rgba(65,105,225,0.35)',
    svg: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="11" r="3" />
      </svg>
    )
  }
];

interface SliderSlide {
  id: string;
  themeTitle: string;
  themeTag: string;
  themeDesc: string;
  techGlow: string; // Background visual aura color
  cardGradient: string; // Dynamic card gradient CSS
}

const SLIDES: SliderSlide[] = [
  {
    id: 'automation',
    themeTag: 'COGNITIVE SYSTEMS',
    themeTitle: 'Automatización & IA',
    themeDesc: 'Diseñamos cerebros lógicos que integran todas tus aplicaciones y automatizan tareas rutinarias sin errores humanos.',
    techGlow: 'from-[#FF6F61]/12 via-purple-950/20 to-transparent',
    cardGradient: 'linear-gradient(135deg, #100b1a 0%, #201235 50%, #FF6F61 100%)'
  },
  {
    id: 'software',
    themeTag: 'FULL-STACK SYSTEMS',
    themeTitle: 'Software Artesanal',
    themeDesc: 'Desarrollamos interfaces React ultrafluidas acopladas a APIs veloces en Node.js para un rendimiento inmejorable.',
    techGlow: 'from-[#00D8FF]/10 via-slate-950/20 to-transparent',
    cardGradient: 'linear-gradient(135deg, #020712 0%, #051630 50%, #00D8FF 100%)'
  },
  {
    id: 'cloud',
    themeTag: 'HIGH-SCALE ARCHITECTURE',
    themeTitle: 'Infraestructura Nube',
    themeDesc: 'Contenedores seguros listos para recibir miles de visitas diarias sin latencia ni caídas del sistema.',
    techGlow: 'from-[#2496ED]/10 via-emerald-950/20 to-transparent',
    cardGradient: 'linear-gradient(135deg, #050a0f 0%, #0c2035 50%, #2496ED 100%)'
  }
];

export default function HeroSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedTech, setSelectedTech] = useState<string | null>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // 1. AUTOMATION STATE
  const [runStatus, setRunStatus] = useState<'idle' | 'running' | 'success'>('idle');
  const [logs, setLogs] = useState<string[]>([
    '🟢 System idle. Waiting for webhook trigger...',
    '💡 Tap "EJECUTAR FLUJO" to simulate automation.'
  ]);

  // 2. SOFTWARE STATE
  const [chartData, setChartData] = useState<number[]>([24, 30, 28, 42, 38, 55, 48, 62, 58, 65, 72, 68]);
  const [activeUsers, setActiveUsers] = useState(1420);
  const [stressActive, setStressActive] = useState(false);

  // 3. CLOUD STATE
  const [replicas, setReplicas] = useState(3);
  const [bandwidth, setBandwidth] = useState(42);

  // Auto rotate slide every 14 seconds unless hovered/interacting (increased for better engagement duration)
  useEffect(() => {
    if (selectedTech || runStatus === 'running' || stressActive) return; 

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % SLIDES.length);
    }, 14000);
    return () => clearInterval(interval);
  }, [selectedTech, runStatus, stressActive]);

  // Dynamic 3D tilt tracking
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    // Smooth responsive limit (max 8 degrees for safety on modern dashboard layouts)
    const rotateX = -(y / (rect.height / 2)) * 8;
    const rotateY = (x / (rect.width / 2)) * 8;
    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  // Log handler simulation for Slide 1
  useEffect(() => {
    if (runStatus !== 'running') return;
    
    const steps = [
      '⚡ [Webhook] New commercial request received.',
      '🔍 [DB] Querying client CRM record...',
      '🤖 [AI] Analyzing prompt via Gemini Flash SDK...',
      '⚙️ [N8N] Orchestrating multi-app integration...',
      '✉️ [Slack] Notification dispatched to sales desk.',
      '✅ [Sync] Finished successfully in 320ms!'
    ];

    let currentStep = 0;
    setLogs(['🟢 Initializing logical workflow.']);

    const timer = setInterval(() => {
      if (currentStep < steps.length) {
        setLogs(prev => [...prev, steps[currentStep]]);
        currentStep++;
      } else {
        setRunStatus('success');
        clearInterval(timer);
      }
    }, 600);

    return () => clearInterval(timer);
  }, [runStatus]);

  // Live charting simulation for Slide 2
  useEffect(() => {
    const chartInterval = setInterval(() => {
      setChartData(prev => {
        const next = [...prev.slice(1)];
        const min = stressActive ? 78 : 22;
        const max = stressActive ? 99 : 58;
        const newValue = Math.floor(Math.random() * (max - min + 1)) + min;
        next.push(newValue);
        return next;
      });

      setActiveUsers(prev => {
        const base = stressActive ? 4250 : 1420;
        const delta = Math.floor(Math.random() * 21) - 10;
        return Math.max(100, base + delta);
      });
    }, 700);

    return () => clearInterval(chartInterval);
  }, [stressActive]);

  // Live fluctuating stats for Slide 3
  useEffect(() => {
    const cloudInterval = setInterval(() => {
      setBandwidth(prev => {
        const base = replicas * 15;
        const drift = Math.floor(Math.random() * 7) - 3;
        return Math.min(98, Math.max(10, base + drift));
      });
    }, 1200);
    return () => clearInterval(cloudInterval);
  }, [replicas]);

  const currentSlide = SLIDES[activeIndex];
  const activeTechInfo = selectedTech ? TECH_BUBBLES.find(t => t.id === selectedTech) : null;

  // Custom function to generate high-performance SVG chart path
  const getSvgPath = (data: number[]) => {
    const width = 360;
    const height = 90;
    const padding = 5;
    const step = (width - padding * 2) / (data.length - 1);
    
    const points = data.map((val, i) => {
      const x = padding + i * step;
      const y = height - padding - (val / 100) * (height - padding * 2);
      return `${x},${y}`;
    });

    return `M ${points.join(' L ')}`;
  };
  
  const getAreaPath = (data: number[]) => {
    const path = getSvgPath(data);
    const width = 360;
    const height = 90;
    const padding = 5;
    const step = (width - padding * 2) / (data.length - 1);
    const lastX = padding + (data.length - 1) * step;
    return `${path} L ${lastX},${height - padding} L ${padding},${height - padding} Z`;
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full aspect-[16/11] lg:aspect-[1.38/1] rounded-2xl flex items-center justify-center p-1 sm:p-2 overflow-visible select-none"
    >
      {/* Dynamic Backglow Aura */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className={`absolute inset-0 bg-gradient-to-tr ${currentSlide.techGlow} rounded-full blur-[90px] pointer-events-none -z-20`}
        />
      </AnimatePresence>

      {/* ADDITIONAL GLOW FROM ACTIVE HOVERED TECH */}
      <AnimatePresence>
        {activeTechInfo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.55 }}
            exit={{ opacity: 0 }}
            className="absolute w-[220px] h-[220px] rounded-full blur-[80px] pointer-events-none -z-15 transition-colors"
            style={{ 
              backgroundColor: activeTechInfo.glowColor,
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)'
            }}
          />
        )}
      </AnimatePresence>

      {/* FLOATING SPATIAL BUBBLES IN THE 3D CANVAS */}
      <div className="absolute inset-0 pointer-events-none z-25 overflow-visible">
        {TECH_BUBBLES.map((tech, idx) => {
          const positions = [
            { top: '-4%', left: '8%' },    // n8n
            { top: '4%', right: '6%' },   // react
            { bottom: '8%', left: '6%' },  // node
            { bottom: '-2%', left: '38%' }, // typescript
            { bottom: '4%', right: '10%' }, // docker
            { top: '48%', right: '-4%' },  // postgres
          ];
          const pos = positions[idx] || { top: '50%', left: '50%' };
          const floatDur = 5 + (idx % 3) * 1.5;
          const floatDelay = idx * 0.3;
          const isCurrentlySelected = selectedTech === tech.id;

          return (
            <motion.div
              key={tech.id}
              className="absolute pointer-events-auto"
              style={{ ...pos }}
              animate={{
                y: [0, -6, 0],
                x: [0, 4, 0],
              }}
              transition={{
                duration: floatDur,
                ease: 'easeInOut',
                repeat: Infinity,
                delay: floatDelay
              }}
            >
              <div className="relative group">
                <motion.button
                  onClick={() => setSelectedTech(isCurrentlySelected ? null : tech.id)}
                  onMouseEnter={() => setSelectedTech(tech.id)}
                  onMouseLeave={() => setSelectedTech(null)}
                  whileHover={{ scale: 1.18, rotate: 4 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-9 h-9 rounded-full bg-gradient-to-br ${tech.color} flex items-center justify-center shadow-lg border border-white/15 relative cursor-pointer transition-all duration-300`}
                  style={{
                    boxShadow: isCurrentlySelected 
                      ? `0 0 20px ${tech.glowColor}, inset 0 1px 3px rgba(255,255,255,0.3)` 
                      : '0 6px 15px rgba(0,0,0,0.3)'
                  }}
                >
                  <div className="scale-90">{tech.svg}</div>
                  <span className="absolute inset-0 rounded-full border border-white/20 scale-110 opacity-0 group-hover:opacity-100 group-hover:scale-120 transition-all duration-300" />
                </motion.button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* PREMIUM GLASS BROWSER DECK WRAPPER */}
      <div 
        className="relative w-full h-full bg-[#04060a]/94 border border-white/[0.06] rounded-2xl shadow-[0_24px_64px_-12px_rgba(4,6,10,0.95)] flex flex-col overflow-hidden"
        style={{
          transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
          transition: 'transform 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }}
      >
        {/* Sleek top status address bar */}
        <div className="h-9 border-b border-white/[0.04] bg-[#07090f]/98 px-4 flex items-center justify-between">
          <div className="flex items-center space-x-1.5 w-20">
            <span className="w-2 h-2 rounded-full bg-[#FF5F56]/20" />
            <span className="w-2 h-2 rounded-full bg-[#FFBD2E]/20" />
            <span className="w-2 h-2 rounded-full bg-[#27C93F]/20" />
          </div>

          <div className="flex-1 max-w-[320px] bg-slate-950/70 border border-white/[0.03] h-5.5 rounded-md flex items-center justify-center text-[8px] font-mono tracking-wider space-x-1.5">
            <span className="text-[var(--color-primary)]/80">https://</span>
            <span className="text-slate-400">des-tec.com/</span>
            <span className="text-white font-bold">{currentSlide.id}</span>
          </div>

          <div className="flex items-center justify-end space-x-2 w-20">
            <span className="text-[7px] font-mono text-emerald-400 font-bold uppercase tracking-widest flex items-center space-x-1">
              <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
              <span>LIVE CORE</span>
            </span>
          </div>
        </div>

        {/* DUAL PANE DASHBOARD SCREEN */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden bg-[#030408]/40">
          
          {/* LEFT COLUMN: CONTROL & METADATA PANELS (Span 5) */}
          <div className="lg:col-span-5 p-5 sm:p-6 border-r border-white/[0.04] flex flex-col justify-between relative bg-gradient-to-b from-slate-950/40 to-black/50 backdrop-blur-md">
            
            <div className="space-y-4">
              {/* Dynamic tag heading */}
              <div className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] animate-ping" />
                <span className="text-[8px] font-mono font-extrabold text-[var(--color-primary)] tracking-widest uppercase">
                  {activeTechInfo ? 'DETALLE TÉCNICO' : currentSlide.themeTag}
                </span>
              </div>

              {/* Dynamic details section */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTechInfo ? activeTechInfo.id : currentSlide.id}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 15 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-2.5 text-left"
                >
                  <h3 className="text-lg font-display font-black text-white tracking-tight leading-tight">
                    {activeTechInfo ? activeTechInfo.name : currentSlide.themeTitle}
                  </h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-sans font-medium">
                    {activeTechInfo ? activeTechInfo.desc : currentSlide.themeDesc}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Bubble Hover Guide or Controller Instructions */}
            <div className="mt-6 pt-4 border-t border-white/[0.04] space-y-4">
              <div className="text-left">
                <span className="text-[8px] font-mono font-bold text-slate-500 uppercase tracking-widest block mb-1">Guía de Navegación</span>
                <span className="text-[10px] text-slate-400 leading-normal block">
                  Usa los círculos flotantes exteriores o el selector inferior para interactuar con cada demostración de software.
                </span>
              </div>

              {/* BULLET PAGINATION BUTTONS */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center space-x-2">
                  {SLIDES.map((slide, idx) => {
                    const isActive = idx === activeIndex;
                    return (
                      <button
                        key={slide.id}
                        onClick={() => {
                          setActiveIndex(idx);
                          setSelectedTech(null);
                        }}
                        className={`h-1.5 rounded-full cursor-pointer transition-all duration-300 relative ${
                          isActive ? 'w-5 bg-[var(--color-primary)]' : 'w-1.5 bg-slate-800 hover:bg-slate-600'
                        }`}
                        aria-label={`Slide ${idx + 1}`}
                      >
                        {isActive && (
                          <span className="absolute inset-0 rounded-full bg-[var(--color-primary)] animate-ping opacity-25" />
                        )}
                      </button>
                    );
                  })}
                </div>

                <span className="text-[9px] font-mono font-bold text-slate-600">
                  DES-TEC CONSOLE v4.2
                </span>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: ACTIVE INTERACTIVE LIVE SOFTWARE DEMO (Span 7) */}
          <div className="lg:col-span-7 p-5 sm:p-6 flex flex-col justify-between bg-slate-950/20 relative overflow-hidden min-h-[250px] lg:min-h-0">
            
            {/* Custom animation lines CSS */}
            <style>{`
              @keyframes dash-flow {
                to {
                  stroke-dashoffset: -20;
                }
              }
              .animate-dash-flow {
                stroke-dasharray: 6 4;
                animation: dash-flow 1.5s linear infinite;
              }
            `}</style>

            <AnimatePresence mode="wait">
              
              {/* INTERACTIVE DEMO 1: AUTOMATION NETWORK FLOW */}
              {currentSlide.id === 'automation' && (
                <motion.div
                  key="automation-demo"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full flex flex-col justify-between space-y-4"
                >
                  {/* Visual Node Network Graphic */}
                  <div className="relative flex-1 bg-slate-950/40 border border-white/[0.03] rounded-xl p-4 flex items-center justify-around overflow-hidden shadow-inner min-h-[110px]">
                    
                    {/* Animated connecting flow lines */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="flowGrad" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.3" />
                          <stop offset="50%" stopColor="var(--color-primary-hover)" stopOpacity="0.8" />
                          <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0.3" />
                        </linearGradient>
                      </defs>
                      {/* Flowing connection lines representing real-time traffic requests */}
                      <path d="M 12 50 H 38" fill="none" stroke="url(#flowGrad)" strokeWidth="1.2" className="animate-dash-flow" strokeDashoffset="0" />
                      <path d="M 50 35 L 75 50" fill="none" stroke="url(#flowGrad)" strokeWidth="1.2" className="animate-dash-flow" strokeDashoffset="0" />
                      <path d="M 50 65 L 75 50" fill="none" stroke="url(#flowGrad)" strokeWidth="1.2" className="animate-dash-flow" strokeDashoffset="0" />
                      <path d="M 50 35 L 50 65" fill="none" stroke="var(--color-primary-hover)" strokeWidth="0.8" strokeDasharray="2 3" opacity="0.3" />
                    </svg>

                    {/* Node A: Webhook Event */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#FF6F61] to-[#E05345] flex items-center justify-center shadow-lg border border-white/10">
                        <Zap className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-[7.5px] font-mono text-slate-400 mt-1.5 uppercase font-bold tracking-wider">Trigger</span>
                    </div>

                    {/* Center Column Nodes (AI & DB) */}
                    <div className="flex flex-col space-y-4 relative z-10">
                      {/* Node B: Gemini Flash Core */}
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr from-[#FFBD2E] to-[var(--color-primary)] flex items-center justify-center shadow-lg border border-white/15 transition-all ${runStatus === 'running' ? 'animate-pulse ring-2 ring-[var(--color-primary)]/30' : ''}`}>
                          <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-[7.5px] font-mono text-slate-400 mt-1 uppercase font-bold tracking-wider">Gemini AI</span>
                      </div>

                      {/* Node C: Database */}
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[var(--color-secondary)] to-[#2B802B] flex items-center justify-center shadow-lg border border-white/15">
                          <Database className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-[7.5px] font-mono text-slate-400 mt-1 uppercase font-bold tracking-wider">CRM DB</span>
                      </div>
                    </div>

                    {/* Node D: Dispatch Action */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-[#00D8FF] flex items-center justify-center shadow-lg border border-white/15 ${runStatus === 'success' ? 'scale-110' : ''} transition-all duration-300`}>
                        {runStatus === 'success' ? <Check className="w-4 h-4 text-white" /> : <Play className="w-4 h-4 text-white" />}
                      </div>
                      <span className="text-[7.5px] font-mono text-slate-400 mt-1.5 uppercase font-bold tracking-wider">Dispatch</span>
                    </div>

                  </div>

                  {/* Execution Terminal Console log */}
                  <div className="bg-[#020306] rounded-lg border border-white/[0.04] p-3 flex-1 flex flex-col justify-between">
                    <div className="flex items-center justify-between pb-1.5 border-b border-white/[0.03] mb-1.5">
                      <div className="flex items-center space-x-1.5">
                        <Terminal className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                        <span className="text-[8px] font-mono text-slate-400 font-bold tracking-wider">CONSOLE LOGS</span>
                      </div>
                      <span className="text-[7px] font-mono text-slate-600 font-bold uppercase">READY</span>
                    </div>

                    {/* Active simulated logs list */}
                    <div className="flex-1 space-y-1 font-mono text-[8px] text-slate-300 overflow-y-auto max-h-[85px] text-left pr-1 scrollbar-thin">
                      {logs.map((log, idx) => (
                        <div key={idx} className="leading-tight truncate">
                          {log}
                        </div>
                      ))}
                    </div>

                    {/* Play/Trigger Control Button */}
                    <div className="flex justify-end pt-2 border-t border-white/[0.03] mt-2">
                      <button
                        onClick={() => {
                          if (runStatus === 'running') return;
                          setRunStatus('running');
                        }}
                        disabled={runStatus === 'running'}
                        className={`px-3 py-1.5 text-[8.5px] font-bold uppercase tracking-wider rounded-md flex items-center space-x-1.5 cursor-pointer border ${
                          runStatus === 'running' 
                            ? 'bg-slate-900 border-white/5 text-slate-500' 
                            : 'bg-white/5 hover:bg-[var(--color-primary)]/10 border-white/[0.06] hover:border-[var(--color-primary)]/30 text-white hover:text-[var(--color-primary)]'
                        } transition-all`}
                      >
                        {runStatus === 'running' ? (
                          <>
                            <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                            <span>Procesando...</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-2.5 h-2.5" />
                            <span>Ejecutar Flujo</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                </motion.div>
              )}

              {/* INTERACTIVE DEMO 2: REAL-TIME API PERFORMANCE CHART */}
              {currentSlide.id === 'software' && (
                <motion.div
                  key="software-demo"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full flex flex-col justify-between space-y-4"
                >
                  {/* Micro dashboard counters */}
                  <div className="grid grid-cols-3 gap-2.5">
                    
                    <div className="bg-slate-950/40 border border-white/[0.03] p-2 rounded-lg text-left shadow-xs">
                      <div className="flex items-center justify-between text-[7px] font-mono text-slate-500 uppercase font-bold">
                        <span>Peticiones</span>
                        <Activity className="w-2.5 h-2.5 text-[#00D8FF]" />
                      </div>
                      <div className="text-xs font-bold text-white font-mono mt-0.5 tracking-tight">
                        {activeUsers} req/s
                      </div>
                    </div>

                    <div className="bg-slate-950/40 border border-white/[0.03] p-2 rounded-lg text-left shadow-xs">
                      <div className="flex items-center justify-between text-[7px] font-mono text-slate-500 uppercase font-bold">
                        <span>Latencia API</span>
                        <Cpu className="w-2.5 h-2.5 text-emerald-400" />
                      </div>
                      <div className="text-xs font-bold text-white font-mono mt-0.5 tracking-tight">
                        {stressActive ? '45ms' : '24ms'}
                      </div>
                    </div>

                    <div className="bg-slate-950/40 border border-white/[0.03] p-2 rounded-lg text-left shadow-xs">
                      <div className="flex items-center justify-between text-[7px] font-mono text-slate-500 uppercase font-bold">
                        <span>Lighthouse</span>
                        <TrendingUp className="w-2.5 h-2.5 text-emerald-400" />
                      </div>
                      <div className="text-xs font-bold text-emerald-400 font-mono mt-0.5 tracking-tight flex items-center space-x-0.5">
                        <span>100</span>
                        <span className="text-[7px] text-slate-500 font-normal">/100</span>
                      </div>
                    </div>

                  </div>

                  {/* Real-time Line Graph Area */}
                  <div className="bg-[#020306] rounded-xl border border-white/[0.04] p-3 flex-1 flex flex-col justify-between min-h-[110px]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[8px] font-mono text-slate-400 font-bold tracking-wider uppercase">Tráfico API en Vivo (60 FPS)</span>
                      <span className="text-[7.5px] font-mono text-cyan-400 bg-cyan-950/30 px-1.5 py-0.5 rounded uppercase font-bold">HTTP 200 OK</span>
                    </div>

                    {/* SVG Line path visual */}
                    <div className="flex-1 relative flex items-end justify-center py-1">
                      {/* Grid background behind path */}
                      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-surface)/[0.015]_1px,transparent_1px),linear-gradient(to_bottom,var(--color-surface)/[0.015]_1px,transparent_1px)] bg-[size:1.5rem_1.5rem]" />

                      <svg className="w-full h-[90px] overflow-visible" preserveAspectRatio="none" viewBox="0 0 360 90">
                        <defs>
                          <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#00D8FF" stopOpacity="0.25" />
                            <stop offset="100%" stopColor="#00D8FF" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        {/* Area gradient under path */}
                        <motion.path 
                          d={getAreaPath(chartData)} 
                          fill="url(#chartGrad)"
                          className="transition-all duration-300 ease-out"
                        />
                        {/* Glow Line path */}
                        <motion.path 
                          d={getSvgPath(chartData)} 
                          fill="none" 
                          stroke="#00D8FF" 
                          strokeWidth="1.8" 
                          strokeLinecap="round" 
                          className="transition-all duration-300 ease-out"
                        />
                      </svg>
                    </div>

                    {/* Stress testing toggle controls */}
                    <div className="flex justify-between items-center pt-2.5 border-t border-white/[0.03] mt-1.5">
                      <span className="text-[8px] font-mono text-slate-500 uppercase">Fluctuaciones síncronas activas</span>
                      
                      <button
                        onClick={() => setStressActive(prev => !prev)}
                        className={`px-3 py-1.5 text-[8.5px] font-bold uppercase tracking-wider rounded-md flex items-center space-x-1.5 cursor-pointer border ${
                          stressActive 
                            ? 'bg-[#00D8FF]/10 border-[#00D8FF]/30 text-[#00D8FF] shadow-[0_0_12px_rgba(0,216,255,0.15)]' 
                            : 'bg-white/5 border-white/[0.06] text-white hover:bg-white/10 hover:border-white/15'
                        } transition-all`}
                      >
                        <Activity className={`w-2.5 h-2.5 ${stressActive ? 'animate-pulse' : ''}`} />
                        <span>Simular Carga</span>
                      </button>
                    </div>

                  </div>

                </motion.div>
              )}

              {/* INTERACTIVE DEMO 3: DOCKER CONTAINER CLUSTER SCALER */}
              {currentSlide.id === 'cloud' && (
                <motion.div
                  key="cloud-demo"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full flex flex-col justify-between space-y-4"
                >
                  {/* Kubernetes replica controller */}
                  <div className="bg-slate-950/40 border border-white/[0.03] p-3 rounded-lg flex items-center justify-between">
                    <div className="text-left font-mono">
                      <div className="text-[7px] text-slate-500 uppercase font-bold tracking-wider">Orquestador de Nodos</div>
                      <div className="text-xs font-bold text-white mt-0.5 tracking-tight flex items-center space-x-1.5">
                        <Server className="w-3.5 h-3.5 text-[#2496ED]" />
                        <span>Réplicas Activas: {replicas} / 8</span>
                      </div>
                    </div>

                    {/* Plus/Minus counter buttons */}
                    <div className="flex items-center space-x-2 bg-slate-900 border border-white/[0.05] p-1 rounded-lg">
                      <button
                        onClick={() => setReplicas(r => Math.max(1, r - 1))}
                        disabled={replicas <= 1}
                        className={`w-6 h-6 rounded-md flex items-center justify-center cursor-pointer transition-all ${
                          replicas <= 1 
                            ? 'text-slate-600 bg-transparent' 
                            : 'text-white hover:bg-white/5 active:bg-white/10 bg-slate-800'
                        }`}
                        title="Eliminar nodo replica"
                      >
                        <Minus className="w-3 h-3" />
                      </button>

                      <span className="font-mono text-xs font-bold text-white px-1.5 select-none">{replicas}</span>

                      <button
                        onClick={() => setReplicas(r => Math.min(8, r + 1))}
                        disabled={replicas >= 8}
                        className={`w-6 h-6 rounded-md flex items-center justify-center cursor-pointer transition-all ${
                          replicas >= 8 
                            ? 'text-slate-600 bg-transparent' 
                            : 'text-white hover:bg-white/5 active:bg-white/10 bg-slate-800'
                        }`}
                        title="Agregar nodo replica"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                  </div>

                  {/* Replicas container cluster grid map */}
                  <div className="bg-[#020306] rounded-xl border border-white/[0.04] p-3 flex-1 flex flex-col justify-between min-h-[110px]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[8px] font-mono text-slate-400 font-bold tracking-wider uppercase">Cluster Kubernetes (Docker)</span>
                      <span className="text-[7.5px] font-mono text-[#2496ED] uppercase font-bold">Auto-Scale ON</span>
                    </div>

                    {/* Nodes grid */}
                    <div className="grid grid-cols-4 gap-2 py-1 flex-1 items-center">
                      {Array.from({ length: 8 }).map((_, idx) => {
                        const isActive = idx < replicas;
                        return (
                          <motion.div
                            key={idx}
                            initial={false}
                            animate={{
                              scale: isActive ? 1 : 0.95,
                              opacity: isActive ? 1 : 0.35,
                            }}
                            className={`aspect-video rounded-lg flex flex-col justify-between p-1.5 border transition-all ${
                              isActive 
                                ? 'bg-[#2496ED]/5 border-[#2496ED]/30 text-[#2496ED]' 
                                : 'bg-transparent border-white/[0.04] text-slate-600'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[6.5px] font-mono uppercase tracking-wide">Pod-{idx + 1}</span>
                              <span className={`w-1 h-1 rounded-full ${isActive ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
                            </div>
                            <span className="text-[8px] font-mono font-bold leading-none block text-left">
                              {isActive ? 'ONLINE' : 'STANDBY'}
                            </span>
                          </motion.div>
                        );
                      })}
                    </div>

                    {/* Cluster Stats Footer */}
                    <div className="pt-2 border-t border-white/[0.03] flex items-center justify-between text-[7.5px] font-mono text-slate-500 uppercase mt-1">
                      <span>Ancho de banda</span>
                      <div className="flex items-center space-x-1.5 w-1/2">
                        <div className="flex-1 h-1 bg-slate-900 rounded-full overflow-hidden">
                          <motion.div 
                            className="h-full bg-[#2496ED] rounded-full" 
                            animate={{ width: `${bandwidth}%` }}
                            transition={{ duration: 0.5, ease: 'easeOut' }}
                          />
                        </div>
                        <span className="text-[7.5px] text-slate-400 font-bold w-6 text-right leading-none block">
                          {bandwidth}%
                        </span>
                      </div>
                    </div>

                  </div>

                </motion.div>
              )}

            </AnimatePresence>

            {/* Micro sync telemetry at the bottom */}
            <div className="flex justify-between items-center border-t border-white/[0.03] pt-3 mt-3">
              <span className="text-[7.5px] font-mono text-slate-500 uppercase tracking-widest flex items-center space-x-1">
                <Sliders className="w-2.5 h-2.5 text-[var(--color-primary)]" />
                <span>Interacción en tiempo real</span>
              </span>
              <span className="text-[7px] font-mono text-slate-600 font-bold uppercase flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/70" />
                <span>Sync Latency: 1.2ms</span>
              </span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
