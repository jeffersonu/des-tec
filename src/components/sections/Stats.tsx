import React, { useEffect, useState, useRef } from 'react';
import { Briefcase, HeartHandshake, Clock, Cpu, Layers, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

interface CountUpProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
}

function CountUp({ end, duration = 2000, prefix = '', suffix = '' }: CountUpProps) {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          let startTimestamp: number | null = null;
          const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            
            // Simple easeOutQuad easing function
            const easeProgress = progress * (2 - progress);
            
            setCount(Math.floor(easeProgress * end));
            if (progress < 1) {
              window.requestAnimationFrame(step);
            } else {
              setCount(end);
            }
          };
          window.requestAnimationFrame(step);
        }
      },
      { threshold: 0.1 }
    );

    const currentElement = elementRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
      observer.disconnect();
    };
  }, [end, duration]);

  return (
    <span ref={elementRef} className="tabular-nums font-mono font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
      {prefix}{count}{suffix}
    </span>
  );
}

export default function Stats() {
  const statItems = [
    {
      id: 'proyectos',
      icon: Briefcase,
      end: 150,
      prefix: '+',
      suffix: '',
      label: 'Proyectos',
      desc: 'Desarrollos de alto impacto',
    },
    {
      id: 'satisfaccion',
      icon: HeartHandshake,
      end: 98,
      prefix: '',
      suffix: '%',
      label: 'Satisfacción',
      desc: 'Clientes corporativos felices',
    },
    {
      id: 'soporte',
      icon: Clock,
      end: 24,
      prefix: '',
      suffix: '/7',
      label: 'Soporte',
      desc: 'Asistencia y monitoreo continuo',
    },
    {
      id: 'automatizaciones',
      icon: Cpu,
      end: 40,
      prefix: '+',
      suffix: '',
      label: 'Automatizaciones',
      desc: 'Flujos optimizados con n8n',
    },
    {
      id: 'tecnologias',
      icon: Layers,
      end: 12,
      prefix: '+',
      suffix: '',
      label: 'Tecnologías',
      desc: 'Ecosistema de vanguardia',
    },
    {
      id: 'codigo-limpio',
      icon: ShieldCheck,
      end: 100,
      prefix: '',
      suffix: '%',
      label: 'Código Limpio',
      desc: 'TypeScript sin redundancias',
    },
  ];

  return (
    <section id="metricas-estudio" className="py-16 bg-[var(--color-secondary)]/20 relative overflow-hidden border-t border-b border-white/[0.06]">
      {/* Soft Apple background accents & glows */}
      <div className="absolute top-0 left-1/3 w-[600px] h-[300px] bg-[radial-gradient(circle,rgba(37, 99, 235,0.05)_0%,rgba(37, 99, 235,0)_70%)] pointer-events-none -z-10 blur-2xl animate-pulse" style={{ animationDuration: '6s' }} />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[250px] bg-[radial-gradient(circle,rgba(95,141,122,0.03)_0%,rgba(95,141,122,0)_70%)] pointer-events-none -z-10 blur-xl" />

      {/* Sutiles patrones tecnológicos */}
      <div className="absolute inset-0 bg-[radial-gradient(var(--color-primary)_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.012] pointer-events-none -z-10" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Subtle Section Header */}
        <motion.div 
          className="text-center max-w-2xl mx-auto mb-8 space-y-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.08 }
            }
          }}
        >
          <motion.span 
            variants={{
              hidden: { opacity: 0, y: 15 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
            }}
            className="text-[10px] font-sans font-extrabold text-[var(--color-primary)] tracking-widest uppercase bg-[var(--color-primary)]/8 border border-[var(--color-primary)]/15 px-3 py-1 rounded-full inline-block"
          >
            NUESTRAS MÉTRICAS EN TIEMPO REAL
          </motion.span>
          <motion.h3 
            variants={{
              hidden: { opacity: 0, y: 20, filter: 'blur(3px)' },
              visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
            }}
            className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight"
          >
            Ingeniería de Precisión en Cifras
          </motion.h3>
          <motion.p 
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
            }}
            className="text-xs sm:text-sm text-[var(--color-text-secondary)] font-sans max-w-md mx-auto"
          >
            Garantizamos la máxima eficiencia técnica, velocidad y estabilidad para tu negocio digital.
          </motion.p>
        </motion.div>

        {/* Minimalist Grid Strip */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
          {statItems.map((item, index) => (
            <motion.div
              key={item.id}
              id={`stat-card-${item.id}`}
              className="group relative bg-white/[0.05] backdrop-blur-xl border border-white/10 p-6 sm:p-7 rounded-[22px] flex flex-col items-center text-center shadow-[0_8px_30px_rgba(0,0,0,0.25)] overflow-hidden cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.4,
                ease: [0.16, 1, 0.3, 1],
                delay: index * 0.05
              }}
              whileHover={{
                y: -4,
                scale: 1.015,
                borderColor: 'rgba(37, 99, 235, 0.15)',
                boxShadow: '0 12px 35px rgba(15,23,42,0.035)'
              }}
            >
              {/* Apple-style minimalist icon wrapper */}
              <div className="w-10 h-10 rounded-full bg-[var(--color-background)] border border-[var(--color-text)]/5 flex items-center justify-center text-[var(--color-text-secondary)] group-hover:text-[var(--color-primary)] transition-colors duration-300 mb-4">
                <item.icon className="w-4 h-4 transition-transform duration-500 group-hover:scale-110" />
              </div>

              {/* Counter view */}
              <div className="flex items-baseline space-x-0.5 justify-center">
                <CountUp
                  end={item.end}
                  prefix={item.prefix}
                  suffix={item.suffix}
                />
              </div>

              {/* Labels with premium hierarchy */}
              <div className="text-xs font-sans font-bold text-white mt-2 group-hover:text-[var(--color-primary)] transition-colors duration-300">
                {item.label}
              </div>

              <div className="text-[10px] text-[#9CA3AF] font-sans mt-1 leading-snug font-medium max-w-[120px]">
                {item.desc}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
