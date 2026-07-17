import React, { useState } from 'react';
import { WorkStep } from '../../types';
import { CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface WorkProcessProps {
  steps: WorkStep[];
}

export default function WorkProcess({ steps }: WorkProcessProps) {
  const [expandedStep, setExpandedStep] = useState<string | null>('01');

  const toggleStep = (num: string) => {
    setExpandedStep(expandedStep === num ? null : num);
  };

  return (
    <section id="proceso" className="py-14 relative overflow-hidden bg-[var(--color-surface)]">
      {/* Premium blurred radial lights */}
      <div className="absolute bottom-1/3 left-10 w-96 h-96 bg-[radial-gradient(circle,rgba(108, 76, 245,0.05)_0%,rgba(108, 76, 245,0)_70%)] pointer-events-none -z-10 blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute top-1/4 right-10 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(95,141,122,0.04)_0%,rgba(95,141,122,0)_70%)] pointer-events-none -z-10 blur-2xl" />

      {/* Sutiles patrones tecnológicos */}
      <div className="absolute inset-0 bg-[radial-gradient(var(--color-secondary)_1px,transparent_1px)] [background-size:36px_36px] opacity-[0.015] pointer-events-none -z-10" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-primary)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-primary)_1px,transparent_1px)] [background-size:72px_72px] opacity-[0.008] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-10 space-y-4"
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
            className="text-xs font-sans font-extrabold text-[var(--color-primary)] tracking-widest uppercase bg-[var(--color-primary)]/8 border border-[var(--color-primary)]/15 px-3.5 py-1.5 rounded-full inline-block"
          >
            Nuestra Metodología
          </motion.span>
          <motion.h2 
            variants={{
              hidden: { opacity: 0, y: 20, filter: 'blur(5px)' },
              visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
            }}
            className="text-3xl sm:text-4xl font-display font-extrabold text-[var(--color-secondary)] tracking-tight leading-tight"
          >
            Flujo de Trabajo Orientado al Éxito
          </motion.h2>
          <motion.p 
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
            }}
            className="text-base text-[var(--color-text-secondary)] max-w-2xl mx-auto font-sans"
          >
            La ingeniería formal requiere un proceso estructurado. Así es como llevamos tu idea tecnológica desde el concepto inicial hasta el despliegue de alta disponibilidad.
          </motion.p>
        </motion.div>

        {/* Process Timeline wrapper */}
        <div className="max-w-3xl mx-auto relative pl-6 sm:pl-8 border-l border-[var(--color-text)]/15 space-y-4">
          {steps.map((step, idx) => {
            const isExpanded = expandedStep === step.number;
            return (
              <motion.div
                key={step.number}
                className={`relative group bg-[var(--color-surface)] hover:bg-slate-50 border ${
                  isExpanded ? 'border-[var(--color-primary)]/45 bg-[var(--color-surface)] shadow-sm' : 'border-[var(--color-text)]/10'
                } p-5 rounded-2xl transition-all duration-300 text-left`}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: idx * 0.1 }}
              >
                {/* Bullet node on timeline */}
                <div
                  className={`absolute -left-[35px] sm:-left-[43px] top-6 w-4 h-4 rounded-full border-2 bg-[var(--color-background)] transition-all ${
                    isExpanded ? 'border-[var(--color-primary)] scale-125 shadow-[0_0_8px_rgba(108, 76, 245,0.25)]' : 'border-[var(--color-text)]/35'
                  }`}
                />

                {/* Step Header */}
                <div
                  onClick={() => toggleStep(step.number)}
                  className="flex items-center justify-between cursor-pointer select-none"
                >
                  <div className="flex items-center space-x-3.5">
                    <span className="text-sm font-sans font-extrabold text-[var(--color-primary)] bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 px-2.5 py-1 rounded">
                      {step.number}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-[var(--color-secondary)] tracking-tight font-display">
                      {step.title}
                    </h3>
                  </div>
                  <button className="text-[var(--color-text-secondary)] hover:text-[var(--color-secondary)] transition-all p-1">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>

                {/* Step Expandable Body */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 pt-3 border-t border-[var(--color-text)]/5 space-y-4">
                        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed font-sans">
                          {step.description}
                        </p>

                        {/* Step specific checks */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 font-sans text-[11px] text-[var(--color-text)]">
                          {step.details.map((detail, dIdx) => (
                            <div key={dIdx} className="flex items-center space-x-2 bg-[var(--color-background)] border border-[var(--color-text)]/5 p-1.5 rounded">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[var(--color-secondary)] shrink-0" />
                              <span className="truncate">{detail}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
