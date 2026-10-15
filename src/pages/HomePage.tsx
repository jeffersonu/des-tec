import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowUpRight, 
  Globe, 
  Bot, 
  BarChart3, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  Code2, 
  Cpu, 
  Sparkles,
  Users
} from 'lucide-react';
import { motion } from 'motion/react';
import { AppConfig, PortfolioProject } from '../types';
import { defaultCaseStudies } from '../data';

import SeoHead from '../components/ui/SeoHead';
import PageHeroCarousel from '../components/ui/PageHeroCarousel';
import { getHomeSlides } from '../data/carouselData';
import SobreMi from '../components/sections/SobreMi';
import Stats from '../components/sections/Stats';
import CasosEstudio from '../components/sections/CasosEstudio';
import Contact from '../components/sections/Contact';
import Magnetic from '../components/ui/Magnetic';

interface HomePageProps {
  config: AppConfig;
  onSelectProject: (project: PortfolioProject) => void;
}

export default function HomePage({ config }: HomePageProps) {
  const scrollToContact = () => {
    const element = document.getElementById('contacto');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const solutions = [
    {
      title: 'Desarrollo Web & SaaS',
      description: 'Plataformas web de alto rendimiento construidas en React, TypeScript y Tailwind CSS. Carga en <150ms y rendimiento garantizado.',
      icon: Globe,
      link: '/desarrollo-web',
      color: 'from-purple-500/20 to-blue-500/10',
      badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
      highlights: ['Sitios Ultra Rápida Carga', 'SaaS & Portales A Medida', 'SEO 95+ en Lighthouse']
    },
    {
      title: 'Automatizaciones & AI',
      description: 'Workflows con n8n y chatbots inteligentes de WhatsApp Cloud API. Ahorra cientos de horas automatizando tareas repetitivas.',
      icon: Bot,
      link: '/automatizaciones',
      color: 'from-emerald-500/20 to-teal-500/10',
      badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      highlights: ['Engine n8n Self-Hosted', 'Chatbots WhatsApp 24/7', 'Integración Gemini AI']
    },
    {
      title: 'Sistemas CRM Empresariales',
      description: 'Paneles de administración comercial, tableros Kanban de ventas, cotizadores dinámicos y control de inventarios sin cuotas mensuales.',
      icon: BarChart3,
      link: '/crm',
      color: 'from-amber-500/20 to-orange-500/10',
      badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      highlights: ['Pipelines de Venta Kanban', 'Cotizaciones PDF al Instante', 'Reportes KPI en Tiempo Real']
    }
  ];

  const whyChooseUs = [
    {
      icon: Code2,
      title: '100% Código A Medida',
      desc: 'Cero plantillas genéricas o CMS pesados. Código limpio, escalable y mantenible construido para durar.'
    },
    {
      icon: Cpu,
      title: 'Servidores Self-Hosted',
      desc: 'Alojamientos dedicados que eliminan costos ocultos por ejecuciones o licencias por usuario.'
    },
    {
      icon: Zap,
      title: 'Velocidad de Respuesta',
      desc: 'Interfaces optimizadas a 60 FPS con tiempos de carga inferiores a 150 milisegundos.'
    },
    {
      icon: ShieldCheck,
      title: 'Garantía & Mantenimiento',
      desc: 'Soporte técnico directo, monitoreo de uptime y actualizaciones preventivas sin fricciones.'
    }
  ];

  return (
    <>
      <SeoHead
        title="Des-Tec | Empresa de Desarrollo Web, Automatización n8n & CRM"
        description="Empresa especializada en desarrollo de software a medida, aplicaciones web SPA con React, automatización de flujos con n8n, chatbots de WhatsApp Cloud API y CRM empresariales."
        canonicalPath="/"
        keywords={[
          'Des-Tec',
          'desarrollo web colombia',
          'desarrollo de software bogota',
          'automatizacion n8n colombia',
          'chatbots whatsapp api',
          'sistemas crm personalizados',
          'agencia de software colombia',
          'desarrollo react nodejs',
          'integracion inteligencia artificial empresas',
          'desarrollo saas a medida'
        ]}
        schemaJson={{
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'WebSite',
              '@id': 'https://des-tec.co/#website',
              url: 'https://des-tec.co',
              name: 'Des-Tec | Desarrollo y Tecnología',
              description: 'Plataforma oficial de Des-Tec: servicios de desarrollo web, automatizaciones inteligentes y sistemas CRM.',
              inLanguage: 'es-CO'
            },
            {
              '@type': 'ProfessionalService',
              '@id': 'https://des-tec.co/#organization',
              name: 'Des-Tec',
              url: 'https://des-tec.co',
              logo: 'https://des-tec.co/logo.jpg',
              image: 'https://des-tec.co/logo.jpg',
              description: 'Servicios profesionales de desarrollo web de alto rendimiento, automatización de procesos con n8n y chatbots de WhatsApp.',
              telephone: '+573192078407',
              email: 'informacion.destec@gmail.com',
              priceRange: '$$$',
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Bogotá',
                addressRegion: 'Bogotá D.C.',
                addressCountry: 'CO'
              },
              hasOfferCatalog: {
                '@type': 'OfferCatalog',
                name: 'Servicios de Tecnología Des-Tec',
                itemListElement: [
                  {
                    '@type': 'Offer',
                    itemOffered: {
                      '@type': 'Service',
                      name: 'Desarrollo Web & SaaS',
                      description: 'Desarrollo de plataformas web interactivas con carga ultrarrápida.'
                    }
                  },
                  {
                    '@type': 'Offer',
                    itemOffered: {
                      '@type': 'Service',
                      name: 'Automatización n8n & WhatsApp Bots',
                      description: 'Integración de flujos de trabajo empresariales y chatbots con IA.'
                    }
                  },
                  {
                    '@type': 'Offer',
                    itemOffered: {
                      '@type': 'Service',
                      name: 'Sistemas CRM Empresariales',
                      description: 'Gestión de clientes, cotizadores en tiempo real y análisis comercial.'
                    }
                  }
                ]
              }
            }
          ]
        }}
      />

      {/* HERO SECTION - 100% FULL WIDTH EDGE-TO-EDGE CAROUSEL FROM TOP 0 */}
      <section id="inicio" className="relative w-full overflow-hidden">
        <PageHeroCarousel 
          slides={getHomeSlides(scrollToContact)} 
          autoPlayInterval={5000} 
        />
      </section>

      {/* QUÉ SOLUCIONES OFRECEMOS */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-purple-700 bg-purple-100 border border-purple-200 px-3 py-1 rounded-full">
            Nuestras Soluciones Core
          </span>
          <h2 className="text-3xl sm:text-5xl font-display font-black text-slate-900">
            Tres Especialidades. Máxima Calidad.
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Diseñamos soluciones digitales enfocadas en resultados de negocio medibles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {solutions.map((sol, index) => {
            const Icon = sol.icon;
            const glassClass = 
              sol.link === '/desarrollo-web' ? 'glass-panel-web' :
              sol.link === '/automatizaciones' ? 'glass-panel-auto' : 'glass-panel-crm';
            const iconColor = 
              sol.link === '/desarrollo-web' ? 'text-sky-400 bg-sky-500/10 border-sky-500/30' :
              sol.link === '/automatizaciones' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' : 'text-amber-400 bg-amber-500/10 border-amber-500/30';

            return (
              <motion.div
                key={sol.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`${glassClass} p-8 flex flex-col justify-between group relative overflow-hidden`}
              >
                {/* Subtle internal gradient glow */}
                <div className={`absolute -right-16 -top-16 w-32 h-32 rounded-full bg-gradient-to-br ${sol.color} blur-2xl group-hover:scale-150 transition-transform duration-500`} />

                <div className="space-y-5 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${iconColor} group-hover:scale-110 transition-transform shadow-md`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`text-[11px] font-mono font-bold uppercase px-2.5 py-1 rounded-lg border ${sol.badgeColor}`}>
                      Especialidad
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold font-display text-white group-hover:text-cyan-300 transition-colors">
                    {sol.title}
                  </h3>

                  <p className="text-sm text-slate-300 leading-relaxed font-sans">
                    {sol.description}
                  </p>

                  <ul className="space-y-2.5 pt-3 border-t border-slate-700/50">
                    {sol.highlights.map(item => (
                      <li key={item} className="flex items-center space-x-2 text-xs font-medium text-slate-200">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 mt-6 relative z-10">
                  <Link
                    to={sol.link}
                    className="w-full py-3.5 bg-gradient-to-r from-[#8B5CF6] via-[#3B82F6] to-[#22D3EE] hover:opacity-95 text-white font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center text-center transition-all shadow-md"
                  >
                    <span>Explorar Servicio</span>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* POR QUÉ ELEGIR DES-TEC */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-b from-slate-900/90 via-slate-900/60 to-slate-950/90 border border-slate-800/80 rounded-3xl p-8 lg:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3 relative z-10">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-full">
              Diferenciadores Técnicos
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-black text-white">
              ¿Por qué las empresas eligen Des-Tec?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {whyChooseUs.map((reason, index) => {
              const Icon = reason.icon;
              return (
                <div
                  key={reason.title}
                  className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-3 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10 transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-base text-white group-hover:text-cyan-300 transition-colors">{reason.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{reason.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* INFORMACIÓN SOBRE LA EMPRESA / SOBRE MÍ - FOTO Y TECNOLOGÍAS ORBITANDO */}
      <SobreMi config={config} />

      {/* RESULTADOS / ESTADÍSTICAS */}
      <Stats />

      {/* CASOS DE ÉXITO */}
      <CasosEstudio casos={defaultCaseStudies} />

      {/* CÓMO CONTACTAR / FORMULARIO */}
      <Contact config={config} />
    </>
  );
}

