import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Bot, 
  Workflow, 
  MessageSquare, 
  Zap, 
  CheckCircle2, 
  ArrowRight, 
  ChevronDown, 
  Clock, 
  Database,
  Cpu,
  Layers,
  Sparkles
} from 'lucide-react';
import { AppConfig, PortfolioProject } from '../types';
import { defaultProjects, defaultTechnologies } from '../data';

import SeoHead from '../components/ui/SeoHead';
import Portfolio from '../components/sections/Portfolio';
import TechStack from '../components/sections/TechStack';
import Contact from '../components/sections/Contact';
import Magnetic from '../components/ui/Magnetic';
import PageHeroCarousel from '../components/ui/PageHeroCarousel';
import { getAutomationSlides } from '../data/carouselData';

interface AutomationsPageProps {
  config: AppConfig;
  onSelectProject: (project: PortfolioProject) => void;
}

export default function AutomationsPage({ config, onSelectProject }: AutomationsPageProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const scrollToContact = () => {
    const el = document.getElementById('contacto');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const autoSolutions = [
    {
      icon: Workflow,
      title: 'Orquestación n8n & Webhooks',
      description: 'Conectamos tus herramientas en la nube (CRM, Google Sheets, Gmail, Stripe, Slack, bases de datos) mediante workflows automatizados autohospedados de máxima velocidad.',
      features: ['Self-hosted n8n Engine', 'Cero Costos por Tarea', 'Sincronización en Segundos']
    },
    {
      icon: MessageSquare,
      title: 'Chatbots Inteligentes para WhatsApp',
      description: 'Desarrollamos bots con la API Oficial de WhatsApp Cloud capaz de responder preguntas frecuentes, calificar leads, agendar citas y notificar a asesores humanos.',
      features: ['WhatsApp Cloud API Oficial', 'IA Gemini Integrada', 'Calificación Automática de Leads']
    },
    {
      icon: Database,
      title: 'Sincronización Multicanal de Datos',
      description: 'Elimina las tareas repetitivas y los errores manuales de digitación. Actualiza inventarios, pedidos y facturas automáticamente entre sistemas independientes.',
      features: ['Actualización en Tiempo Real', 'Manejo de Fallos con Reintentos', 'Logs de Auditoría']
    },
    {
      icon: Sparkles,
      title: 'Agentes de IA para Negocios',
      description: 'Integramos modelos avanzados de lenguaje (Gemini / OpenAI) para analizar correos, extraer datos de facturas PDF y generar respuestas inteligentes 24/7.',
      features: ['Extracción de Datos PDF/Docs', 'Análisis de Sentimiento', 'Respuestas Contextuales']
    }
  ];

  const faqs = [
    {
      q: '¿Por qué prefieren n8n sobre Zapier o Make?',
      a: 'n8n nos permite alojar el motor de automatización en servidores privados dedicados, lo que significa que no pagas tarifas por ejecuciones individuales, mantienes la privacidad total de tus datos sensibles y no tienes límites de tareas mensuales.'
    },
    {
      q: '¿Qué se necesita para implementar un Chatbot en WhatsApp?',
      a: 'Requerimos una cuenta de Meta Business Suite verificada y un número de teléfono dedicado. Nosotros realizamos todo el proceso técnico de conexión de la API oficial y configuración de webhooks.'
    },
    {
      q: '¿Qué pasa si una API falla o cambia su estructura?',
      a: 'Nuestros workflows incluyen sistemas de reintentos automáticos, captura de errores (error triggers) y alertas inmediatas por correo o Slack para garantizar la continuidad operativa.'
    },
    {
      q: '¿Cuánto tiempo de trabajo se puede ahorrar con automatizaciones?',
      a: 'En promedio, nuestros clientes ahorran entre 15 y 40 horas semanales por departamento al eliminar tareas manuales de copia de datos, envío de correos de seguimiento y generación de reportes.'
    }
  ];

  const autoTechs = defaultTechnologies.filter(t => 
    t.name.toLowerCase().includes('n8n') || 
    t.name.toLowerCase().includes('whatsapp') || 
    t.name.toLowerCase().includes('gemini') ||
    t.category === 'backend' ||
    t.category === 'database'
  );

  return (
    <div className="pb-10">
      <SeoHead
        title="Automatización de Procesos con n8n & Chatbots WhatsApp IA | Des-Tec"
        description="Ahorra cientos de horas automatizando flujos de trabajo en n8n, chatbots de WhatsApp Business API, integración con Google Sheets, webhooks e Inteligencia Artificial."
        canonicalPath="/automatizaciones"
        keywords={[
          'automatizacion n8n colombia',
          'chatbots whatsapp api empresas',
          'automatizacion de flujos de trabajo',
          'agentes inteligencia artificial whatsapp',
          'integracion n8n google sheets excel',
          'webhooks automatizados',
          'software de automatizacion colombia',
          'Des-Tec automatizaciones'
        ]}
        schemaJson={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: 'Automatización de Procesos con n8n & Chatbots de WhatsApp',
          provider: {
            '@type': 'ProfessionalService',
            name: 'Des-Tec',
            url: 'https://des-tec.co'
          },
          serviceType: 'Workflow Automation & Conversational AI',
          areaServed: 'Global',
          description: 'Implementación de flujos de trabajo automatizados con n8n, bots de atención al cliente en WhatsApp y conectores de API.'
        }}
      />

      {/* AUTOMATIONS HERO - 100% FULL WIDTH EDGE-TO-EDGE FROM TOP 0 */}
      <section className="relative w-full overflow-hidden">
        <PageHeroCarousel
          slides={getAutomationSlides(scrollToContact)}
          autoPlayInterval={5000}
        />
      </section>

      {/* VALUE PROPOSITION GRID */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {autoSolutions.map((sol, index) => {
            const Icon = sol.icon;
            return (
              <motion.div
                key={sol.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-panel-auto p-8 flex flex-col justify-between group relative overflow-hidden"
              >
                <div className="absolute -right-12 -top-12 w-32 h-32 bg-emerald-500/15 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />

                <div className="space-y-4 relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-400/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform shadow-md shadow-emerald-500/10">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold font-display text-white group-hover:text-emerald-300 transition-colors">{sol.title}</h3>
                  <p className="text-sm text-slate-300 leading-relaxed font-sans">{sol.description}</p>
                </div>

                <div className="pt-6 mt-6 border-t border-emerald-500/20 flex flex-wrap gap-2 relative z-10">
                  {sol.features.map(f => (
                    <span key={f} className="inline-flex items-center space-x-1.5 text-[11px] font-mono text-emerald-200 bg-slate-900/90 px-2.5 py-1 rounded-lg border border-emerald-500/30 shadow-sm">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{f}</span>
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* INTERACTIVE WORKFLOW DIAGRAM SIMULATOR SHOWCASE */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-emerald-500/20 rounded-3xl p-8 lg:p-12 text-center space-y-6">
          <span className="text-xs font-mono uppercase font-bold text-emerald-400 tracking-widest bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
            Arquitectura de Flujo Real
          </span>
          <h2 className="text-2xl sm:text-4xl font-display font-black text-white max-w-2xl mx-auto">
            ¿Cómo se conecta un flujo automatizado de Des-Tec?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-left pt-6">
            <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-2">
              <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase">Paso 1: Captura</span>
              <p className="text-xs font-bold text-white">Lead entra por WhatsApp / Formulario</p>
              <p className="text-[11px] text-slate-400">Webhook instantáneo activa el motor n8n.</p>
            </div>
            <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-2">
              <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase">Paso 2: Procesamiento</span>
              <p className="text-xs font-bold text-white">IA analiza y califica la consulta</p>
              <p className="text-[11px] text-slate-400">Gemini clasifica la urgencia y presupuesto.</p>
            </div>
            <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-2">
              <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase">Paso 3: Sincronización</span>
              <p className="text-xs font-bold text-white">Actualiza CRM y Google Sheets</p>
              <p className="text-[11px] text-slate-400">Crea el trato y agenda reunión automática.</p>
            </div>
            <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-2">
              <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase">Paso 4: Notificación</span>
              <p className="text-xs font-bold text-white">Alerta a Asesor por Slack/WhatsApp</p>
              <p className="text-[11px] text-slate-400">Notificación rica con resumen del lead.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FILTERED PORTFOLIO (AUTOMATION PROJECTS) */}
      <Portfolio 
        projects={defaultProjects} 
        onSelectProject={onSelectProject}
        filterCategory="automation"
      />

      {/* TECH STACK */}
      <TechStack technologies={autoTechs} />

      {/* FAQ ACCORDION */}
      <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-mono uppercase font-bold text-emerald-700 tracking-widest bg-emerald-100 border border-emerald-200 px-3 py-1 rounded-full">
            Preguntas Frecuentes
          </span>
          <h2 className="text-3xl font-display font-black text-slate-900 mt-3">
            Preguntas sobre Automatizaciones
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm transition-colors"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full text-left p-6 flex items-center justify-between space-x-4 cursor-pointer"
              >
                <span className="font-bold text-slate-800 text-sm sm:text-base">{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-emerald-600 transition-transform duration-300 shrink-0 ${openFaq === idx ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === idx && (
                <div className="px-6 pb-6 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <Contact config={config} />
    </div>
  );
}
