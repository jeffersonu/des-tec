import React, { useState } from 'react';
import { Technology } from '../../types';
import * as Icons from 'lucide-react';
import { motion } from 'motion/react';
import iconHtml5 from '../../assets/tech-icons/html5.svg';
import iconCss3 from '../../assets/tech-icons/css3.svg';
import iconJavascript from '../../assets/tech-icons/javascript.svg';
import iconReact from '../../assets/tech-icons/react.svg';
import iconNodejs from '../../assets/tech-icons/nodejs.svg';
import iconPhp from '../../assets/tech-icons/php.svg';
import iconMysql from '../../assets/tech-icons/mysql.svg';
import iconGithub from '../../assets/tech-icons/github.svg';
import iconN8n from '../../assets/tech-icons/n8n.svg';

// Mapa de logo real por nombre de tecnología (fallback al ícono genérico si no hay match)
const REAL_TECH_LOGOS: Record<string, string> = {
  'HTML5': iconHtml5,
  'CSS3': iconCss3,
  'JavaScript': iconJavascript,
  'React': iconReact,
  'Node.js': iconNodejs,
  'PHP & Laravel': iconPhp,
  'MySQL': iconMysql,
  'Git & GitHub': iconGithub,
  'n8n': iconN8n,
};

interface TechStackProps {
  technologies: Technology[];
}

export default function TechStack({ technologies }: TechStackProps) {
  const [hoveredTech, setHoveredTech] = useState<Technology | null>(null);

  const getIcon = (tech: Technology) => {
    const realLogo = REAL_TECH_LOGOS[tech.name];
    if (realLogo) {
      return <img src={realLogo} alt={tech.name} className="w-6 h-6 object-contain" draggable={false} />;
    }
    const IconComponent = (Icons as any)[tech.iconName];
    if (!IconComponent) return <Icons.Cpu className="w-6 h-6 text-[var(--color-primary)]" />;
    return <IconComponent className="w-6 h-6 text-[var(--color-primary)] group-hover:text-[var(--color-primary-hover)] transition-all duration-[260ms] ease-[cubic-bezier(0.16,1,0.3,1)]" />;
  };

  return (
    <section id="tecnologias" className="py-16 relative overflow-hidden bg-[var(--color-surface)]">
      {/* Glow effects & Radial Lights */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[radial-gradient(circle,rgba(37, 99, 235,0.06)_0%,rgba(37, 99, 235,0)_70%)] pointer-events-none -z-10 blur-3xl animate-pulse" style={{ animationDuration: '9s' }} />
      <div className="absolute -top-10 left-10 w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(95,141,122,0.04)_0%,rgba(95,141,122,0)_70%)] pointer-events-none -z-10 blur-2xl" />

      {/* Subtle tech background patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(var(--color-primary)_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.012] pointer-events-none -z-10" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-secondary)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-secondary)_1px,transparent_1px)] [background-size:40px_40px] opacity-[0.012] pointer-events-none -z-10" />

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
            Ecosistema Tecnológico
          </motion.span>
          <motion.h2 
            variants={{
              hidden: { opacity: 0, y: 20, filter: 'blur(5px)' },
              visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
            }}
            className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight leading-tight"
          >
            Nuestra Fórmula de Alto Rendimiento
          </motion.h2>
          <motion.p 
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
            }}
            className="text-base text-[var(--color-text-secondary)] max-w-2xl mx-auto font-sans"
          >
            Evitamos el desorden. Desarrollamos con un stack depurado y moderno que garantiza velocidad óptima, SEO técnico estelar y escalabilidad ilimitada.
          </motion.p>
        </motion.div>

        {/* Tech grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 max-w-4xl mx-auto">
          {technologies.map((tech, index) => (
            <motion.div
              key={tech.name}
              onMouseEnter={() => setHoveredTech(tech)}
              onMouseLeave={() => setHoveredTech(null)}
              className="group relative cursor-default"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ 
                duration: 0.5, 
                ease: [0.16, 1, 0.3, 1], 
                delay: index * 0.035 
              }}
            >
              {/* Inner animated card element with static outer boundary tracking */}
              <div className="w-full h-full bg-white/[0.05] backdrop-blur-xl border border-white/10 p-5 rounded-2xl flex flex-col items-center justify-center space-y-3 shadow-[0_8px_30px_rgba(0,0,0,0.25)] transition-all duration-[260ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1.5 group-hover:border-[var(--color-primary)]/40 group-hover:shadow-[0_12px_36px_rgba(37,99,235,0.18)] relative overflow-hidden">
                {/* Glow border dot */}
                <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-[var(--color-primary)] rounded-full opacity-0 group-hover:opacity-100 transition-all duration-[260ms] ease-[cubic-bezier(0.16,1,0.3,1)]" />

                <div className="w-12 h-12 rounded-xl bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/15 flex items-center justify-center group-hover:bg-[var(--color-primary)]/20 group-hover:border-[var(--color-primary)] transition-all duration-[260ms] ease-[cubic-bezier(0.16,1,0.3,1)] shadow-inner">
                  {getIcon(tech)}
                </div>
                <span className="text-xs font-sans font-bold text-slate-200 group-hover:text-white transition-colors duration-[260ms] ease-[cubic-bezier(0.16,1,0.3,1)]">
                  {tech.name}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* DYNAMIC TOOLTIP FOOTER */}
        <motion.div 
          className="mt-10 max-w-2xl mx-auto h-28 relative"
          initial={{ opacity: 0, scale: 0.98, y: 15 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-5%" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="bg-[var(--color-surface)] border border-[var(--color-text)]/10 rounded-2xl px-5 py-4 text-center relative overflow-hidden shadow-sm backdrop-blur-md h-full flex flex-col justify-center items-center">
            {hoveredTech ? (
              <div className="space-y-1 w-full animate-fade-in flex flex-col items-center justify-center">
                <div className="flex items-center justify-center space-x-1.5">
                  <span className="w-1.5 h-1.5 bg-[var(--color-secondary)] rounded-full animate-ping" />
                  <span className="text-[10px] font-sans font-extrabold text-white uppercase tracking-wider">
                    {hoveredTech.category.toUpperCase()} ESPECIFICACIÓN
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white font-sans leading-none">{hoveredTech.name}</h4>
                <p className="text-xs text-[var(--color-text-secondary)] font-sans leading-normal max-w-lg mx-auto">
                  {hoveredTech.tooltip}
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-[var(--color-text-secondary)] font-sans text-xs">
                <Icons.HelpCircle className="w-5 h-5 text-[var(--color-primary)]/40 mb-1.5 animate-pulse" />
                <span>Pasa el cursor sobre cualquier tecnología para ver detalles de arquitectura técnica</span>
              </div>
            )}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
