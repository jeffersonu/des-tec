import React from 'react';
import { motion } from 'motion/react';
import { 
  Globe, 
  Bot, 
  BarChart3, 
  ArrowUpRight, 
  ArrowRight
} from 'lucide-react';
import { AppConfig, PortfolioProject } from '../types';
import { defaultProjects } from '../data';
import { getProjectsSlides } from '../data/carouselData';
import SeoHead from '../components/ui/SeoHead';
import Magnetic from '../components/ui/Magnetic';
import PageHeroCarousel from '../components/ui/PageHeroCarousel';
import Contact from '../components/sections/Contact';

interface ProjectsPageProps {
  config: AppConfig;
  onSelectProject: (project: PortfolioProject) => void;
}

export default function ProjectsPage({ config, onSelectProject }: ProjectsPageProps) {
  const scrollToContact = () => {
    const el = document.getElementById('contacto');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Group projects by category
  const webProjects = defaultProjects.filter(p => p.routeCategory?.includes('web'));
  const automationProjects = defaultProjects.filter(p => p.routeCategory?.includes('automation'));
  const crmProjects = defaultProjects.filter(p => p.routeCategory?.includes('crm'));

  const categories = [
    {
      id: 'sec-web',
      filterKey: 'web' as const,
      title: 'Desarrollo Web & Aplicaciones SaaS',
      subtitle: 'Plataformas web ultra-rápidas, portales corporativos y presupuestadores interactivos.',
      badge: 'Categoría 01',
      icon: Globe,
      themeColor: 'sky',
      accentGradient: 'from-sky-500 via-blue-500 to-indigo-500',
      badgeBg: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
      cardHoverBorder: 'hover:border-sky-500/50 hover:shadow-sky-500/10',
      projects: webProjects
    },
    {
      id: 'sec-automation',
      filterKey: 'automation' as const,
      title: 'Automatizaciones & Chatbots de WhatsApp',
      subtitle: 'Workflows en n8n, asistentes con Inteligencia Artificial e integración de procesos 24/7.',
      badge: 'Categoría 02',
      icon: Bot,
      themeColor: 'emerald',
      accentGradient: 'from-emerald-500 via-teal-500 to-green-500',
      badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      cardHoverBorder: 'hover:border-emerald-500/50 hover:shadow-emerald-500/10',
      projects: automationProjects
    },
    {
      id: 'sec-crm',
      filterKey: 'crm' as const,
      title: 'Sistemas CRM & Paneles de Control Comercial',
      subtitle: 'Pipelines Kanban de ventas, cotizadores inteligentes en tiempo real y trazabilidad operativa.',
      badge: 'Categoría 03',
      icon: BarChart3,
      themeColor: 'amber',
      accentGradient: 'from-amber-500 via-orange-500 to-amber-600',
      badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      cardHoverBorder: 'hover:border-amber-500/50 hover:shadow-amber-500/10',
      projects: crmProjects
    }
  ];

  return (
    <div className="pb-12 text-slate-100">
      <SeoHead
        title="Portafolio de Proyectos & Casos de Éxito | Des-Tec"
        description="Explora los proyectos de software desarrollados por Des-Tec: plataformas web en React, flujos automatizados con n8n, chatbots empresariales de WhatsApp y sistemas CRM."
        canonicalPath="/proyectos"
        keywords={[
          'portafolio desarrollo web',
          'casos de exito software colombia',
          'demos de software interactivas',
          'proyectos n8n automatizacion',
          'ejemplos crm empresarial',
          'chatbots whatsapp casos reales',
          'desarrollo saas proyectos',
          'Des-Tec portafolio'
        ]}
        schemaJson={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Portafolio de Proyectos - Des-Tec',
          description: 'Catálogo de proyectos reales y demos interactivas de software, automatizaciones n8n y sistemas CRM.',
          url: 'https://des-tec.co/proyectos',
          mainEntity: {
            '@type': 'ItemList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Proyectos de Desarrollo Web & SaaS',
                description: 'Plataformas web reactivas, dashboards interactivos y tiendas e-commerce.'
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'Proyectos de Automatización con n8n & IA',
                description: 'Bots de WhatsApp Business API, agentes IA y sincronización de datos.'
              },
              {
                '@type': 'ListItem',
                position: 3,
                name: 'Proyectos de Sistemas CRM A Medida',
                description: 'CRM logístico, cotizadores de carga en tiempo real y embudos de ventas.'
              }
            ]
          }
        }}
      />

      {/* HERO SECTION - PAGE HERO CAROUSEL (15s) */}
      <section className="relative w-full overflow-hidden">
        <PageHeroCarousel
          slides={getProjectsSlides(scrollToContact)}
          autoPlayInterval={15000}
        />
      </section>

      {/* 3 CATEGORY SECTIONS WITH PRESENTATION CARDS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 space-y-20 sm:space-y-28">
        {categories.map((cat) => {
          const IconComponent = cat.icon;

          return (
            <section
              key={cat.id}
              id={cat.id}
              className="scroll-mt-28 space-y-8"
            >
              {/* CATEGORY PRESENTATION HEADER BAR */}
              <div className="relative p-6 sm:p-8 rounded-2xl bg-slate-900/90 border border-white/10 backdrop-blur-xl overflow-hidden shadow-xl">
                <div className={`absolute top-0 left-0 w-2 h-full bg-gradient-to-b ${cat.accentGradient}`} />
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border ${cat.badgeBg}`}>
                        {cat.badge}
                      </span>
                      <span className="text-xs font-mono text-slate-400">
                        {cat.projects.length} Proyectos Destacados
                      </span>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-xl bg-slate-800/80 border border-white/10 flex items-center justify-center`}>
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight">
                        {cat.title}
                      </h2>
                    </div>

                    <p className="text-sm text-slate-300 font-sans max-w-2xl">
                      {cat.subtitle}
                    </p>
                  </div>

                  <Magnetic>
                    <button
                      onClick={scrollToContact}
                      className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white transition-all cursor-pointer shrink-0"
                    >
                      <span>Solicitar Proyecto Similar</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </Magnetic>
                </div>
              </div>

              {/* 3 PRESENTATION CARDS GRID FOR THIS CATEGORY */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 justify-center items-stretch">
                {cat.projects.map((proj) => (
                  <motion.div
                    key={proj.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className={`group relative bg-slate-900/80 border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between shadow-xl ${cat.cardHoverBorder} hover:-translate-y-1.5 h-full`}
                  >
                    {/* CARD TOP: IMAGE MOCKUP & BADGES */}
                    <div>
                      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-950">
                        {/* Background Mockup Image */}
                        <img
                          src={proj.mockupUrl || proj.featuredImage}
                          alt={proj.title}
                          className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                          referrerPolicy="no-referrer"
                        />

                        {/* Dark Gradient Overlay for legibility */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                        {/* Top Badges */}
                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                          <span className="px-2.5 py-1 rounded-md bg-slate-950/85 backdrop-blur-md text-[10px] font-mono font-bold text-cyan-300 border border-cyan-500/30">
                            {proj.clientIndustry || proj.category}
                          </span>

                          {proj.isIntegrated !== false ? (
                            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-emerald-500/20 text-[9px] font-mono font-bold text-emerald-300 border border-emerald-500/30">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                              <span>Código Integrado</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-amber-500/20 text-[9px] font-mono font-bold text-amber-300 border border-amber-500/30">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                              <span>Pendiente de Código</span>
                            </span>
                          )}
                        </div>

                        {/* Bottom Metric Pill Overlay on Image */}
                        {proj.metrics && proj.metrics.length > 0 && (
                          <div className="absolute bottom-3 left-3 right-3 z-10 flex flex-wrap gap-1.5">
                            {proj.metrics.map((m, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-900/90 text-slate-200 border border-white/15 backdrop-blur-md"
                              >
                                {m}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* CARD CONTENT BODY */}
                      <div className="p-6 space-y-4">
                        <div>
                          <h3 className="text-xl font-display font-black text-white group-hover:text-cyan-300 transition-colors">
                            {proj.title}
                          </h3>
                          <p className="text-xs font-mono font-bold text-slate-400 mt-0.5">
                            {proj.subtitle}
                          </p>
                        </div>

                        <p className="text-xs text-slate-300 font-sans leading-relaxed line-clamp-3">
                          {proj.description}
                        </p>

                        {/* Tech Stack Chips */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {proj.tags.map((tag, tIdx) => (
                            <span
                              key={tIdx}
                              className="px-2 py-1 rounded-md bg-slate-800/80 text-[10px] font-mono text-slate-300 border border-white/10"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* CARD FOOTER ACTION BUTTON */}
                    <div className="p-6 pt-0 border-t border-white/5 mt-4">
                      <button
                        onClick={() => onSelectProject(proj)}
                        className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#8B5CF6] via-[#3B82F6] to-[#22D3EE] hover:opacity-95 text-white font-bold text-xs flex items-center justify-center text-center transition-all duration-300 cursor-pointer shadow-lg shadow-purple-500/20 group/btn"
                      >
                        <span>Explorar Demo & Detalles</span>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {/* FOOTER CTA SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <Contact config={config} />
      </section>
    </div>
  );
}
