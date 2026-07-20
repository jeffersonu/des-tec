import React from 'react';
import { motion } from 'motion/react';
import { PortfolioProject } from '../../types';
import Magnetic from '../ui/Magnetic';

// Import Icons from lucide-react
import {
  MessageSquare,
  Cpu,
  TrendingUp,
  QrCode,
  ArrowUpRight,
  Columns,
  Shield,
  Calculator
} from 'lucide-react';

// Import newly modularized subcomponents
import AnimatedCounter from '../portfolio/AnimatedCounter';
import WhatsAppChatDemo from '../portfolio/WhatsAppChatDemo';
import CRMKanbanDemo from '../portfolio/CRMKanbanDemo';
import N8nWorkflowDemo from '../portfolio/N8nWorkflowDemo';
import SmartQuoteDemo from '../portfolio/SmartQuoteDemo';
import DashboardDemo from '../portfolio/DashboardDemo';
import RestaurantQrDemo from '../portfolio/RestaurantQrDemo';

interface PortfolioProps {
  projects: PortfolioProject[];
  onSelectProject: (project: PortfolioProject) => void;
}

/**
 * Portfolio Component (Interactive Laboratory).
 * Displays our custom developed interactive simulations alongside real-world SaaS statistics.
 * Acts as an entry point orchestrating all modular sandbox demos.
 */
export default function Portfolio({ projects, onSelectProject }: PortfolioProps) {
  
  // Custom definitions for the 6 Demos representing the Interactive Laboratory
  const demos = [
    {
      id: 'demo-1',
      title: 'Chatbot Inteligente WhatsApp',
      subtitle: 'Respuestas 24/7 y Calificación de Clientes',
      description: 'Interactúa con un asistente virtual automatizado capaz de responder consultas corporativas, calificar clientes potenciales en tiempo real y nutrir bases de datos instantáneamente sin intervención manual.',
      complexity: 'Media',
      devTime: '4 días',
      tags: ['React', 'Node.js', 'WhatsApp Cloud API', 'webhooks'],
      icon: MessageSquare,
      liveAppType: 'crm-whatsapp', // Mapped project
      component: <WhatsAppChatDemo />
    },
    {
      id: 'demo-2',
      title: 'Kanban CRM Automático',
      subtitle: 'Sincronización Multicanal de Fases de Venta',
      description: 'Una demo de nuestro pipeline comercial automatizado. Haz clic en las tarjetas de leads para avanzarlas de fase y mira cómo n8n procesa correos, Google Sheets y webhooks de manera integrada.',
      complexity: 'Alta',
      devTime: '1 semana',
      tags: ['React', 'Laravel', 'n8n Webhook', 'PostgreSQL'],
      icon: Columns,
      liveAppType: 'crm-whatsapp', // Mapped project
      component: <CRMKanbanDemo />
    },
    {
      id: 'demo-3',
      title: 'Automatización workflow n8n',
      subtitle: 'Integración Inteligente de Herramientas Cloud',
      description: 'Ejecuta y visualiza en vivo la orquestación técnica de un webhook n8n que conecta WhatsApp, IA Gemini, Google Sheets, Gmail y Google Calendar de forma secuencial en menos de 5 segundos.',
      complexity: 'Experto',
      devTime: '5 días',
      tags: ['n8n', 'Gemini AI', 'Docker', 'REST API'],
      icon: Cpu,
      liveAppType: 'crm-whatsapp', // Mapped project
      component: <N8nWorkflowDemo />
    },
    {
      id: 'demo-4',
      title: 'Cotizador Inteligente de Proyectos',
      subtitle: 'Estimador Dinámico de Costos y Complejidad',
      description: 'Calcula al instante presupuestos de desarrollo de software variando el tipo de proyecto, número de usuarios corporativos asignados, plazos deseados y nivel del proyecto con un motor de cálculo matemático reactivo.',
      complexity: 'Media',
      devTime: '3 días',
      tags: ['React', 'Tailwind', 'JavaScript', 'CSS Animations'],
      icon: Calculator,
      liveAppType: 'remodelacionesya', // Mapped project or oracle
      component: <SmartQuoteDemo />
    },
    {
      id: 'demo-5',
      title: 'Dashboard de Estadísticas en Vivo',
      subtitle: 'Visualización Dinámica de Métricas del Negocio',
      description: 'Monitorea métricas clave de tu negocio con este panel interactivo. Cambia de periodos de tiempo y activa el tráfico simulado en tiempo real para observar cómo se mueven e iluminan las gráficas de rendimiento SVG.',
      complexity: 'Alta',
      devTime: '1 semana',
      tags: ['React', 'SVG Charts', 'Tailwind', 'Git'],
      icon: TrendingUp,
      liveAppType: 'calculator', // Mapped project
      component: <DashboardDemo />
    },
    {
      id: 'demo-6',
      title: 'Sistema de Menú QR Restaurante',
      subtitle: 'Mesa a Cocina Directa sin Intermediarios',
      description: 'Simula el escaneo de un código QR en tu mesa, explora el menú interactivo, agrega deliciosos platos al carrito y simula el envío del pedido directo a la cocina mediante simulación WebSocket integrada.',
      complexity: 'Alta',
      devTime: '2 semanas',
      tags: ['React', 'QrCode', 'Tailwind', 'MySQL'],
      icon: QrCode,
      liveAppType: 'cargoflow', // Mapped project or custom
      component: <RestaurantQrDemo />
    }
  ];

  /**
   * Dispatches the launch action to display the interactive SaaS project in the main modal.
   */
  const handleLaunchModal = (liveAppType: string) => {
    // Attempt to match the projects from props to provide an immersive modal experience
    const matchedProject = projects.find((p) => p.liveAppType === liveAppType);
    if (matchedProject) {
      onSelectProject(matchedProject);
    } else if (projects.length > 0) {
      onSelectProject(projects[0]);
    }
  };

  return (
    <section id="proyectos" className="py-24 relative overflow-hidden bg-[var(--color-background)]">
      {/* SaaS Ambient Glow spots */}
      <div
        className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(37, 99, 235,0.04)_0%,rgba(37, 99, 235,0)_70%)] pointer-events-none -z-10 blur-3xl animate-pulse"
        style={{ animationDuration: '10s' }}
      />
      <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(95,141,122,0.03)_0%,rgba(95,141,122,0)_70%)] pointer-events-none -z-10 blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(var(--color-secondary)_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.015] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section title & branding header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-[10px] font-sans font-extrabold text-[var(--color-primary)] tracking-widest uppercase bg-[var(--color-primary)]/8 border border-[var(--color-primary)]/15 px-4 py-1.5 rounded-full inline-block"
          >
            Sistemas Interactivos Propios
          </motion.span>
          
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-white tracking-tight leading-tight"
          >
            Laboratorio Interactivo <span className="whitespace-nowrap">Des-Tec</span>
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-sm sm:text-base text-[#4B5563] max-w-2xl mx-auto font-sans leading-relaxed"
          >
            Experimenta versiones funcionales de algunas de nuestras soluciones. Cada demostración fue diseñada para mostrar cómo automatizamos procesos reales de empresas.
          </motion.p>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-[11px] font-bold text-white max-w-md mx-auto font-mono uppercase tracking-wider bg-[var(--color-secondary)]/5 border border-[var(--color-secondary)]/15 py-1 px-3 rounded-lg"
          >
            No utilizamos videos ni imágenes estáticas. Todas las demostraciones son simulaciones funcionales que representan el comportamiento real del software desarrollado.
          </motion.p>
        </div>

        {/* INDICATORS STATS BOARD */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-20">
          <AnimatedCounter value={45} label="Proyectos desarrollados" suffix="+" />
          <AnimatedCounter value={32} label="Clientes atendidos" suffix="+" />
          <AnimatedCounter value={150000} label="Automatizaciones creadas" suffix="+" />
          <AnimatedCounter value={12000} label="Horas ahorradas" suffix="h+" />
          <AnimatedCounter value={80} label="APIs integradas" suffix="+" />
        </div>

        {/* 6 DEMOS LABORATORY BENTO GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {demos.map((demo, index) => {
            const IconComponent = demo.icon;
            return (
              <motion.div
                key={demo.id}
                id={`laboratory-card-${demo.id}`}
                className="group bg-[var(--color-surface)]/90 backdrop-blur-md border border-[var(--color-secondary)]/[0.06] p-6 sm:p-8 rounded-[24px] flex flex-col justify-between text-left shadow-[0_8px_30px_-6px_rgba(15,23,42,0.015)] overflow-hidden transition-all duration-500 hover:shadow-[0_24px_50px_-12px_rgba(15,23,42,0.08)] hover:border-[var(--color-primary)]/30"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-stretch h-full">
                  {/* Left Column: Information Card details */}
                  <div className="md:col-span-7 flex flex-col justify-between space-y-5">
                    <div className="space-y-3.5">
                      {/* Title with icon */}
                      <div className="flex items-center space-x-2.5">
                        <div className="p-2 rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20">
                          <IconComponent className="w-5 h-5 animate-pulse" />
                        </div>
                        <div>
                          <h3 className="text-base sm:text-lg font-black text-white tracking-tight group-hover:text-[var(--color-primary)] transition-colors font-display leading-tight">
                            {demo.title}
                          </h3>
                          <span className="text-[10px] font-bold text-white uppercase tracking-wide">
                            {demo.subtitle}
                          </span>
                        </div>
                      </div>

                      {/* Description copy */}
                      <p className="text-[12px] text-[#4B5563] leading-relaxed font-sans font-medium">
                        {demo.description}
                      </p>
                    </div>

                    <div className="space-y-4">
                      {/* Metric Specifications */}
                      <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 border border-[var(--color-secondary)]/[0.03] rounded-xl text-[10.5px]">
                        <div>
                          <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider block">Complejidad</span>
                          <span className="font-bold text-white font-mono">{demo.complexity}</span>
                        </div>
                        <div>
                          <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider block">Est. Desarrollo</span>
                          <span className="font-bold text-white font-mono">{demo.devTime}</span>
                        </div>
                      </div>

                      {/* Tech Pills */}
                      <div className="flex flex-wrap gap-1">
                        {demo.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[9px] font-mono font-bold text-slate-500 bg-slate-100 border border-[var(--color-secondary)]/[0.03] px-2 py-0.5 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Launch Interactive Full SaaS client */}
                      <div className="pt-2 border-t border-[var(--color-secondary)]/[0.04]">
                        <Magnetic>
                          <button
                            onClick={() => handleLaunchModal(demo.liveAppType)}
                            className="group/btn w-full py-2 bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-text)] hover:from-[var(--color-primary)] hover:to-[var(--color-primary-hover)] text-white text-[10px] font-bold font-sans rounded-xl flex items-center justify-center space-x-1 shadow-md shadow-[var(--color-secondary)]/5 hover:shadow-lg hover:shadow-[var(--color-primary)]/15 transition-all duration-300 cursor-pointer"
                          >
                            <span>Lanzar SaaS Completo</span>
                            <ArrowUpRight className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 w-3 h-3 transition-transform duration-300" strokeWidth={2.5} />
                          </button>
                        </Magnetic>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Immersive active simulator panel */}
                  <div className="md:col-span-5 flex items-center justify-center bg-gradient-to-br from-slate-950 to-[#0B0F14] border border-[var(--color-primary)]/10 rounded-2xl p-3 md:p-4 relative overflow-hidden min-h-[270px] shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_10px_30px_-10px_rgba(0,0,0,0.25)]">
                    {/* Subtle grid styling */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none" />
                    {/* Soft ambient accent glow to give the simulator more presence */}
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-[var(--color-primary)]/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="w-full h-full flex flex-col justify-center relative z-10">
                      {demo.component}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Laboratory footnotes confidentiality policy block */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 text-center max-w-xl mx-auto space-y-2 p-4 bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.25)]"
        >
          <div className="flex items-center justify-center space-x-2 text-white">
            <Shield className="w-4 h-4 animate-pulse" />
            <span className="text-[10px] font-sans font-bold uppercase tracking-wider">ENTORNO DEMO SEGURO Y CONFIGURABLE</span>
          </div>
          <p className="text-[11px] text-[var(--color-text-secondary)] leading-relaxed font-sans font-medium">
            Todas las demostraciones son simulaciones interactivas desarrolladas exclusivamente para mostrar el funcionamiento de nuestras soluciones sin exponer información confidencial de clientes.
          </p>
        </motion.div>

      </div>
    </section>
  );
}
