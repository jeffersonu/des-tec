import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  BarChart3, 
  Users, 
  Columns, 
  Calculator, 
  CheckCircle2, 
  ArrowRight, 
  ChevronDown, 
  ShieldCheck, 
  TrendingUp,
  Sliders,
  PieChart
} from 'lucide-react';
import { AppConfig, PortfolioProject } from '../types';
import { defaultProjects, defaultTechnologies } from '../data';

import SeoHead from '../components/ui/SeoHead';
import Portfolio from '../components/sections/Portfolio';
import TechStack from '../components/sections/TechStack';
import Contact from '../components/sections/Contact';
import Magnetic from '../components/ui/Magnetic';
import PageHeroCarousel from '../components/ui/PageHeroCarousel';
import { getCrmSlides } from '../data/carouselData';

interface CrmPageProps {
  config: AppConfig;
  onSelectProject: (project: PortfolioProject) => void;
}

export default function CrmPage({ config, onSelectProject }: CrmPageProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const scrollToContact = () => {
    const el = document.getElementById('contacto');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const crmSolutions = [
    {
      icon: Columns,
      title: 'Pipelines Comercial Kanban A Medida',
      description: 'Tableros de control visuales para rastrear el progreso de tus clientes potenciales desde la primera consulta hasta el cierre del contrato.',
      features: ['Drag & Drop Intuitivo', 'Fases Personalizadas', 'Sincronización Multicanal']
    },
    {
      icon: Calculator,
      title: 'Cotizadores y Simuladores en Tiempo Real',
      description: 'Calculadoras dinámicas de presupuestos con generación automática de propuestas comerciales en PDF y envío directo al cliente.',
      features: ['Generador de Propuestas PDF', 'Lógica de Precios Dinámica', 'Aprobaciones en Línea']
    },
    {
      icon: PieChart,
      title: 'Paneles Analíticos & Métricas',
      description: 'Visualiza indicadores clave de rendimiento (KPIs), conversiones por embudo, ingresos proyectados y efectividad de cada vendedor en gráficos interactivos.',
      features: ['Gráficos Dinámicos SVG/Recharts', 'Exportación Excel/PDF', 'Filtros por Fecha y Rol']
    },
    {
      icon: Users,
      title: 'Control de Usuarios & Permisos',
      description: 'Gestión jerárquica de acceso por roles (Administrador, Vendedor, Supervisor) para proteger la confidencialidad de tu base de clientes.',
      features: ['RBAC (Role Based Access)', 'Autenticación Segura', 'Registro de Actividad']
    }
  ];

  const faqs = [
    {
      q: '¿Por qué contratar un CRM personalizado en lugar de HubSpot o Salesforce?',
      a: 'Un CRM a medida cuesta una fracción del precio a largo plazo al eliminar suscripciones mensuales por usuario, no incluye funciones innecesarias que confunden a tu equipo y se adapta 100% a tus flujos operativos actuales.'
    },
    {
      q: '¿Se pueden migrar los datos de nuestro sistema o Excel actual?',
      a: 'Sí, realizamos el proceso de limpieza, estructuración e importación de tus bases de datos actuales desde archivos Excel, CSV o APIs de otros sistemas sin interrumpir tus ventas.'
    },
    {
      q: '¿Es posible integrar el CRM con WhatsApp y correo electrónico?',
      a: 'Por supuesto. Integración total con WhatsApp Business API, Gmail, Outlook y servicios de mailing para registrar todas las interacciones con los clientes de forma centralizada.'
    },
    {
      q: '¿El CRM se puede usar desde teléfonos móviles?',
      a: 'Sí, todas nuestras interfaces CRM se construyen como Progressive Web Apps (PWA) responsivas, lo que permite a tus asesores de campo usar el sistema desde su teléfono móvil como si fuera una app nativa.'
    }
  ];

  const crmTechs = defaultTechnologies.filter(t => 
    ['database', 'backend', 'frontend'].includes(t.category)
  );

  return (
    <div className="pb-10">
      <SeoHead
        title="Sistemas CRM A Medida & Cotizadores en Tiempo Real | Des-Tec"
        description="Desarrollamos sistemas CRM personalizados, tableros Kanban de ventas, cotizadores automáticos en tiempo real y dashboards comerciales adaptados a tu empresa."
        canonicalPath="/crm"
        keywords={[
          'desarrollo crm personalizado',
          'crm a medida empresas',
          'sistema crm colombia',
          'tablero kanban ventas software',
          'cotizador automatico fcl lcl',
          'panel administrativo comercial',
          'software de ventas y prospectos',
          'Des-Tec crm'
        ]}
        schemaJson={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: 'Sistemas CRM A Medida & Paneles Comerciales',
          provider: {
            '@type': 'ProfessionalService',
            name: 'Des-Tec',
            url: 'https://des-tec.co'
          },
          serviceType: 'Custom CRM Software Development',
          areaServed: 'Global',
          description: 'Desarrollo de CRM a medida, software para gestión de ventas, pipeline comercial y cotizadores automáticos.'
        }}
      />

      {/* CRM HERO - 100% FULL WIDTH EDGE-TO-EDGE FROM TOP 0 */}
      <section className="relative w-full overflow-hidden">
        <PageHeroCarousel
          slides={getCrmSlides(scrollToContact)}
          autoPlayInterval={5000}
        />
      </section>

      {/* VALUE PROPOSITION GRID */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {crmSolutions.map((sol, index) => {
            const Icon = sol.icon;
            return (
              <motion.div
                key={sol.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-panel-crm p-8 flex flex-col justify-between group relative overflow-hidden"
              >
                <div className="absolute -right-12 -top-12 w-32 h-32 bg-amber-500/15 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />

                <div className="space-y-4 relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-400/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform shadow-md shadow-amber-500/10">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold font-display text-white group-hover:text-amber-300 transition-colors">{sol.title}</h3>
                  <p className="text-sm text-slate-300 leading-relaxed font-sans">{sol.description}</p>
                </div>

                <div className="pt-6 mt-6 border-t border-amber-500/20 flex flex-wrap gap-2 relative z-10">
                  {sol.features.map(f => (
                    <span key={f} className="inline-flex items-center space-x-1.5 text-[11px] font-mono text-amber-200 bg-slate-900/90 px-2.5 py-1 rounded-lg border border-amber-500/30 shadow-sm">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                      <span>{f}</span>
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* FILTERED PORTFOLIO (CRM PROJECTS) */}
      <Portfolio 
        projects={defaultProjects} 
        onSelectProject={onSelectProject}
        filterCategory="crm"
      />

      {/* TECH STACK */}
      <TechStack technologies={crmTechs} />

      {/* FAQ ACCORDION */}
      <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-mono uppercase font-bold text-amber-800 tracking-widest bg-amber-100 border border-amber-200 px-3 py-1 rounded-full">
            Preguntas Frecuentes
          </span>
          <h2 className="text-3xl font-display font-black text-slate-900 mt-3">
            Preguntas sobre CRM y Paneles
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
                <ChevronDown className={`w-5 h-5 text-amber-600 transition-transform duration-300 shrink-0 ${openFaq === idx ? 'rotate-180' : ''}`} />
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
