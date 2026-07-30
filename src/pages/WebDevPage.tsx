import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Globe, 
  Zap, 
  Layout, 
  Code2, 
  CheckCircle2, 
  ArrowRight, 
  ChevronDown, 
  ShieldCheck, 
  Layers, 
  Cpu,
  Smartphone,
  Gauge
} from 'lucide-react';
import { AppConfig, PortfolioProject } from '../types';
import { defaultProjects, defaultTechnologies } from '../data';

import SeoHead from '../components/ui/SeoHead';
import Portfolio from '../components/sections/Portfolio';
import TechStack from '../components/sections/TechStack';
import Contact from '../components/sections/Contact';
import Magnetic from '../components/ui/Magnetic';
import PageHeroCarousel from '../components/ui/PageHeroCarousel';
import { getWebDevSlides } from '../data/carouselData';

interface WebDevPageProps {
  config: AppConfig;
  onSelectProject: (project: PortfolioProject) => void;
}

export default function WebDevPage({ config, onSelectProject }: WebDevPageProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const scrollToContact = () => {
    const el = document.getElementById('contacto');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const webSolutions = [
    {
      icon: Layout,
      title: 'Plataformas Web & SaaS A Medida',
      description: 'Interfaces de alto impacto con React, TypeScript y Tailwind CSS. Sin plantillas genéricas; arquitectura limpia pensada para escalar a millones de usuarios.',
      features: ['TypeScript Nativo', 'Arquitectura Modular', 'Componentes UI Reutilizables']
    },
    {
      icon: Gauge,
      title: 'Optimización SEO & Velocidad Extrema',
      description: 'Lighthouse 95+ garantizado. Carga en menos de 150ms con Server-Side Rendering (SSR) y optimización avanzada de assets web.',
      features: ['Carga < 150ms', 'Indexación Schema.org', 'Core Web Vitals Verificados']
    },
    {
      icon: Smartphone,
      title: 'Diseño Ultra-Responsive Mobile-First',
      description: 'Experiencia perfecta en smartphones, tablets, laptops y pantallas 4K con animaciones fluidas a 60 FPS guiadas por hardware.',
      features: ['Touch Targets > 44px', 'Animaciones Fluidas Motion', 'Adaptabilidad Total']
    },
    {
      icon: ShieldCheck,
      title: 'Seguridad & Despliegue Cloud',
      description: 'Infraestructura en Cloud Run, Vercel o servidores dedicados. Certificados SSL, protección WAF y monitoreo de uptime 99.9%.',
      features: ['SSL Gratis', 'Cloud Infrastructure', 'Copias de Seguridad Automáticas']
    }
  ];

  const faqs = [
    {
      q: '¿Por qué elegir un desarrollo web a medida en vez de WordPress o Shopify?',
      a: 'Un desarrollo a medida en React/TypeScript no tiene limitaciones de plugins, no sufre por lentitud de código legacy, ofrece seguridad absoluta contra vulnerabilidades conocidas de CMS y se adapta exactamente a las reglas de negocio únicas de tu empresa.'
    },
    {
      q: '¿Cómo garantizan una velocidad de carga (Lighthouse) superior a 95 puntos?',
      a: 'Optimizamos el tamaño del bundle, aplicamos lazy loading de componentes e imágenes en formato Next-Gen (WebP/AVIF), ejecutamos minificación avanzada y servimos contenido desde CDNs globales.'
    },
    {
      q: '¿El sitio web será responsive y funcionará bien en celulares?',
      a: 'Sí, aplicamos una metodología desktop-first de precisión con código mobile-first responsive. Probamos todas las interfaces en dispositivos reales de múltiples dimensiones.'
    },
    {
      q: '¿Incluye soporte post-lanzamiento y mantenimiento?',
      a: 'Todos nuestros proyectos incluyen garantía contra errores de código, capacitación técnica para tu equipo y planes opcionales de mantenimiento preventivo y escalabilidad.'
    }
  ];

  const webTechs = defaultTechnologies.filter(t => 
    ['frontend', 'tools'].includes(t.category) || t.name === 'Node.js'
  );

  return (
    <div className="pb-10">
      <SeoHead
        title="Desarrollo Web & Aplicaciones SaaS de Alto Rendimiento | Des-Tec"
        description="Servicio profesional de desarrollo web a medida, sitios corporativos y plataformas SaaS con React, Node.js y Tailwind CSS. Velocidad ultrarrápida e interfaces 60 FPS."
        canonicalPath="/desarrollo-web"
        keywords={[
          'desarrollo web profesional',
          'desarrollo saas a medida',
          'paginas web corporativas colombia',
          'programadores react bogota',
          'desarrollo frontend react tailwind',
          'paginas web rapidas 60fps',
          'agencia desarrollo web bogota',
          'Des-Tec desarrollo web'
        ]}
        schemaJson={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: 'Desarrollo Web & Aplicaciones SaaS',
          provider: {
            '@type': 'ProfessionalService',
            name: 'Des-Tec',
            url: 'https://des-tec.co'
          },
          serviceType: 'Software Development',
          areaServed: 'Global',
          description: 'Diseño y desarrollo de plataformas web modernas, sitios corporativos e interfaces de usuario avanzadas.',
          offers: {
            '@type': 'Offer',
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock'
          }
        }}
      />

      {/* WEB DEV HERO - 100% FULL WIDTH EDGE-TO-EDGE FROM TOP 0 */}
      <section className="relative w-full overflow-hidden">
        <PageHeroCarousel
          slides={getWebDevSlides(scrollToContact)}
          autoPlayInterval={15000}
        />
      </section>

      {/* VALUE PROPOSITION GRID */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {webSolutions.map((sol, index) => {
            const Icon = sol.icon;
            return (
              <motion.div
                key={sol.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-panel-web p-8 flex flex-col justify-between group relative overflow-hidden"
              >
                <div className="absolute -right-12 -top-12 w-32 h-32 bg-sky-500/15 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />

                <div className="space-y-4 relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-400/30 flex items-center justify-center text-sky-400 group-hover:scale-110 transition-transform shadow-md shadow-sky-500/10">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold font-display text-white group-hover:text-sky-300 transition-colors">{sol.title}</h3>
                  <p className="text-sm text-slate-300 leading-relaxed font-sans">{sol.description}</p>
                </div>

                <div className="pt-6 mt-6 border-t border-sky-500/20 flex flex-wrap gap-2 relative z-10">
                  {sol.features.map(f => (
                    <span key={f} className="inline-flex items-center space-x-1.5 text-[11px] font-mono text-sky-200 bg-slate-900/90 px-2.5 py-1 rounded-lg border border-sky-500/30 shadow-sm">
                      <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
                      <span>{f}</span>
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* FILTERED PORTFOLIO (WEB PROJECTS) */}
      <Portfolio 
        projects={defaultProjects} 
        onSelectProject={onSelectProject}
        filterCategory="web"
      />

      {/* TECH STACK */}
      <TechStack technologies={webTechs} />

      {/* FAQ ACCORDION */}
      <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-mono uppercase font-bold text-sky-700 tracking-widest bg-sky-100 border border-sky-200 px-3 py-1 rounded-full">
            Preguntas Frecuentes
          </span>
          <h2 className="text-3xl font-display font-black text-slate-900 mt-3">
            Resuelve tus dudas sobre Desarrollo Web
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
                <ChevronDown className={`w-5 h-5 text-sky-600 transition-transform duration-300 shrink-0 ${openFaq === idx ? 'rotate-180' : ''}`} />
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
