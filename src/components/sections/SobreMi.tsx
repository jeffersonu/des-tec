import React from 'react';
import { AppConfig } from '../../types';
import { Code2, Target, Server, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import developerPortrait from '../../assets/images/developer_portrait_real_1783794065776.jpg';

interface SobreMiProps {
  config: AppConfig;
}

export default function SobreMi({ config }: SobreMiProps) {
  const specialties = [
    { title: 'Arquitectura SPA & JAMstack', desc: 'Desarrollo web reactivo ultra veloz con renderizado optimizado.', icon: Code2 },
    { title: 'Automatización & Pipelines API', desc: 'Integraciones estables con n8n, webhooks seguros y sincronizaciones.', icon: Server },
    { title: 'Optimización de Conversión (CRO)', desc: 'Estructuras fluidas diseñadas para maximizar ventas e interactividad.', icon: Target },
    { title: 'Seguridad & Despliegue Cloud', desc: 'Nubes redundantes con certificados SSL, firewalls y SLAs formales.', icon: ShieldCheck },
  ];

  return (
    <section id="sobre-mi" className="py-20 relative overflow-hidden bg-[#FAFAFB]">
      {/* Premium background flows & lights */}
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-[radial-gradient(circle,rgba(37, 99, 235,0.05)_0%,rgba(37, 99, 235,0)_70%)] rounded-full blur-2xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-[radial-gradient(circle,rgba(95,141,122,0.03)_0%,rgba(95,141,122,0)_70%)] rounded-full blur-2xl pointer-events-none -z-10" />

      {/* Sutiles patrones tecnológicos */}
      <div className="absolute inset-0 bg-[radial-gradient(var(--color-secondary)_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.015] pointer-events-none -z-10" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-primary)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-primary)_1px,transparent_1px)] [background-size:64px_64px] opacity-[0.008] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* LEFT COLUMN: PORTRAIT WITH NEON ACCENTS */}
          <motion.div 
            className="col-span-1 lg:col-span-5 flex justify-center relative select-none"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Main Outer Container for absolute positioning and orbit radius */}
            <div className="relative w-[300px] h-[300px] sm:w-[350px] sm:h-[350px] flex items-center justify-center">
              
              {/* Very sutil underlying color backlighting - premium and soft */}
              <div className="absolute w-[240px] h-[240px] bg-gradient-to-tr from-[var(--color-primary)]/12 to-[var(--color-secondary)]/10 rounded-full blur-3xl pointer-events-none -z-10" />

              {/* SPINNING ORBIT OF TECHNOLOGIES */}
              <motion.div
                className="absolute inset-0 pointer-events-none z-20"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 32, ease: "linear" }}
              >
                {[
                  { name: 'Laravel', url: 'https://cdn.simpleicons.org/laravel' },
                  { name: 'PHP', url: 'https://cdn.simpleicons.org/php' },
                  { name: 'JavaScript', url: 'https://cdn.simpleicons.org/javascript' },
                  { name: 'Docker', url: 'https://cdn.simpleicons.org/docker' },
                  { name: 'Flutter', url: 'https://cdn.simpleicons.org/flutter' },
                  { name: 'n8n', url: 'https://cdn.simpleicons.org/n8n' },
                  { name: 'GitHub', url: 'https://cdn.simpleicons.org/github' },
                ].map((tech, index, arr) => {
                  const angle = (index * 360) / arr.length;
                  const radius = 135; // orbit radius in pixels
                  return (
                    <div
                      key={tech.name}
                      className="absolute top-1/2 left-1/2 w-10 h-10 -mt-5 -ml-5 pointer-events-auto"
                      style={{
                        transform: `rotate(${angle}deg) translate(${radius}px) rotate(${-angle}deg)`,
                      }}
                    >
                      {/* Counter-rotate the inner element so the logo remains perfectly upright while orbiting */}
                      <motion.div
                        className="w-10 h-10 bg-[var(--color-surface)] border border-[var(--color-text)]/10 p-2 rounded-full shadow-[0_4px_10px_rgba(15,23,42,0.06)] flex items-center justify-center transition-colors duration-300 hover:border-[var(--color-primary)]/30 cursor-help"
                        whileHover={{ scale: 1.15 }}
                        animate={{ rotate: -360 }}
                        transition={{ 
                          rotate: { repeat: Infinity, duration: 32, ease: "linear" },
                          scale: { duration: 0.2 }
                        }}
                        title={tech.name}
                      >
                        <img
                          src={tech.url}
                          alt={tech.name}
                          className="w-5 h-5 object-contain"
                          referrerPolicy="no-referrer"
                        />
                      </motion.div>
                    </div>
                  );
                })}
              </motion.div>

              {/* Central Circular Portrait Container */}
              <motion.div 
                className="relative w-[190px] h-[190px] sm:w-[220px] sm:h-[220px] rounded-full p-1 bg-gradient-to-tr from-[var(--color-primary)]/30 via-white/50 to-[var(--color-secondary)]/30 shadow-[0_20px_50px_rgba(15,23,42,0.1)] overflow-visible z-10"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                {/* Clean white interior ring */}
                <div className="w-full h-full rounded-full bg-white p-1 flex items-center justify-center overflow-hidden relative">
                  <img
                    src={developerPortrait}
                    alt="Des-Tec Developer"
                    className="w-full h-full rounded-full object-cover select-none pointer-events-none"
                    referrerPolicy="no-referrer"
                  />
                </div>
                
                {/* Embedded Status overlay hovering at the bottom center of the circular frame */}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 py-1.5 px-3 bg-white/95 backdrop-blur-md border border-[var(--color-text)]/10 rounded-full flex items-center space-x-1.5 font-sans text-[9px] shadow-md z-20 whitespace-nowrap">
                  <span className="flex h-1.5 w-1.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-secondary)] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[var(--color-secondary)]"></span>
                  </span>
                  <span className="text-[var(--color-text)] font-bold">Disponible</span>
                  <span className="text-gray-300">|</span>
                  <span className="text-[var(--color-primary)] font-bold">{config.ciudad}</span>
                </div>
              </motion.div>

            </div>
          </motion.div>

          {/* RIGHT COLUMN: BRAND STORY */}
          <motion.div 
            className="col-span-1 lg:col-span-7 text-left space-y-6"
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
              Sobre Des-Tec
            </motion.span>
            <motion.h2 
              variants={{
                hidden: { opacity: 0, y: 20, filter: 'blur(4px)' },
                visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
              }}
              className="text-3xl sm:text-4xl font-display font-extrabold text-[var(--color-secondary)] tracking-tight leading-tight"
            >
              Diseño de Nivel Enterprise, Código Sin Plantillas
            </motion.h2>
            <motion.p 
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
              }}
              className="text-sm sm:text-base text-[var(--color-text-secondary)] leading-relaxed font-sans"
            >
              En <strong>Des-Tec</strong>, creemos que tu presencia digital no debe limitarse a una plantilla de WordPress lenta y sobrecargada de plugins obsoletos. Fundada por un equipo de desarrolladores senior de {config.ciudad}, {config.pais}, nos dedicamos a construir soluciones integrales con tecnologías de última generación.
            </motion.p>
            <motion.p 
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
              }}
              className="text-sm sm:text-base text-[var(--color-text-secondary)] leading-relaxed font-sans"
            >
              Cada botón, animación y base de datos se diseña a medida con un enfoque estricto en el <strong>CRO (Optimización de Conversión)</strong>, asegurando que tu sitio no solo se vea espectacular, sino que cargue en milisegundos y convierta a tus visitantes en clientes leales de forma automática.
            </motion.p>

            {/* Specialties Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[var(--color-text)]/5">
              {specialties.map((spec, sIdx) => (
                <motion.div
                  key={sIdx}
                  className="flex items-start space-x-3 p-3 bg-[var(--color-surface)] border border-[var(--color-text)]/10 rounded-xl shadow-sm cursor-pointer"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: sIdx * 0.08 }}
                  whileHover={{
                    x: 4,
                    borderColor: 'rgba(37, 99, 235, 0.35)',
                    boxShadow: '0 8px 30px rgba(37, 99, 235,0.03)'
                  }}
                >
                  <div className="p-1.5 bg-[var(--color-primary)]/10 rounded-lg border border-[var(--color-primary)]/20 text-[var(--color-primary)] mt-0.5 shrink-0">
                    <spec.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[var(--color-secondary)] font-sans">{spec.title}</h4>
                    <p className="text-[11px] text-[var(--color-text-secondary)] leading-snug font-sans mt-0.5">{spec.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
