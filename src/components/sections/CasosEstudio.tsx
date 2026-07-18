import React from 'react';
import { CaseStudy } from '../../types';
import { TrendingUp, Cpu, Zap, Globe, Database, ShieldCheck, Smartphone, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

const iconMap: Record<string, React.ComponentType<any>> = {
  TrendingUp,
  Cpu,
  Zap,
  Globe,
  Database,
  ShieldCheck,
  Smartphone
};

interface CasosEstudioProps {
  casos: CaseStudy[];
}

export default function CasosEstudio({ casos }: CasosEstudioProps) {
  return (
    <section id="casos-estudio" className="py-20 relative overflow-hidden bg-[#FAFAFB]">
      {/* Decorative ambient blurred vector lights */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[radial-gradient(circle,rgba(37, 99, 235,0.06)_0%,rgba(37, 99, 235,0)_70%)] rounded-full blur-2xl pointer-events-none -z-10 animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-10 left-10 w-[450px] h-[450px] bg-[radial-gradient(circle,rgba(95,141,122,0.05)_0%,rgba(95,141,122,0)_70%)] rounded-full blur-2xl pointer-events-none -z-10" />

      {/* Grid Pattern accents */}
      <div className="absolute inset-0 bg-[radial-gradient(var(--color-primary)_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.015] pointer-events-none -z-10" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-secondary)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-secondary)_1px,transparent_1px)] [background-size:48px_48px] opacity-[0.012] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16 space-y-4"
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
            Casos de Estudio
          </motion.span>
          
          <motion.h2 
            variants={{
              hidden: { opacity: 0, y: 20, filter: 'blur(5px)' },
              visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
            }}
            className="text-3xl sm:text-4xl font-display font-extrabold text-[var(--color-secondary)] tracking-tight leading-tight"
          >
            Estrategias de Ingeniería que Transforman Negocios
          </motion.h2>
          
          <motion.p 
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
            }}
            className="text-base text-[var(--color-text-secondary)] max-w-2xl mx-auto font-sans"
          >
            Analizamos desafíos técnicos reales, diseñamos integraciones de alta fidelidad y entregamos resultados con métricas medibles. Sin adornos ni simulaciones.
          </motion.p>
        </motion.div>

        {/* Case Studies Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {casos.map((caso, index) => {
            const IconComponent = iconMap[caso.iconName] || Globe;
            return (
              <motion.div
                key={caso.id}
                className="group relative bg-[var(--color-surface)] border border-[var(--color-text)]/10 p-7 sm:p-8 rounded-2xl flex flex-col justify-between text-left shadow-[0_4px_20px_rgba(15,23,42,0.02)] overflow-hidden hover:border-[var(--color-primary)]/20 hover:shadow-[0_15px_40px_rgba(37, 99, 235,0.06)] transition-all duration-500"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{
                  duration: 0.6,
                  ease: [0.16, 1, 0.3, 1],
                  delay: index * 0.1
                }}
              >
                {/* Decorative border accent */}
                <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[var(--color-primary)]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div>
                  {/* Top Header Card Info */}
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-secondary)]/10 border border-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)] group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-sans font-bold text-gray-400 uppercase tracking-widest block">Proyecto Desarrollado</span>
                      <h3 className="text-lg font-display font-extrabold text-[var(--color-secondary)] tracking-tight group-hover:text-[var(--color-primary)] transition-colors duration-300">
                        {caso.proyecto}
                      </h3>
                    </div>
                  </div>

                  {/* Dynamic structured details */}
                  <div className="space-y-5">
                    {/* Problema */}
                    <div className="space-y-1.5">
                      <div className="flex items-center space-x-1.5 text-[#DC2626] font-sans font-bold text-[10px] uppercase tracking-wider">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Problema del cliente</span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-sans bg-gray-50 border border-gray-100 p-3 rounded-xl">
                        {caso.problema}
                      </p>
                    </div>

                    {/* Solución */}
                    <div className="space-y-1.5">
                      <div className="flex items-center space-x-1.5 text-[var(--color-secondary)] font-sans font-bold text-[10px] uppercase tracking-wider">
                        <Sparkles className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                        <span>Solución implementada</span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-sans bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/10 p-3 rounded-xl">
                        {caso.solucion}
                      </p>
                    </div>

                    {/* Resultado */}
                    <div className="space-y-1.5">
                      <div className="flex items-center space-x-1.5 text-[#15803D] font-sans font-bold text-[10px] uppercase tracking-wider">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Resultado obtenido</span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-700 font-medium leading-relaxed font-sans bg-[#15803D]/5 border border-[#15803D]/10 p-3 rounded-xl">
                        {caso.resultado}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-gray-100 flex items-center justify-between text-[11px] font-sans text-gray-400">
                  <span>Código de Producción</span>
                  <span className="font-mono text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">100% Real</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
