import React, { useState, useEffect, lazy, Suspense } from 'react';
import { ChevronDown, Sparkles, Code2, ArrowUpRight, ArrowDown } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';

// Data default structures
import {
  defaultAppConfig,
  defaultServices,
  defaultTechnologies,
  defaultProjects,
  defaultCaseStudies,
  workSteps,
} from './data';
import { AppConfig, PortfolioProject } from './types';

// Modular Subcomponents
const InteractiveStarsCanvas = lazy(() => import('./components/ui/InteractiveStarsCanvas'));
import Cursor from './components/ui/Cursor';
import Header from './components/layout/Header';
import HeroSlider from './components/sections/HeroSlider';
import Services from './components/sections/Services';
import TechStack from './components/sections/TechStack';
import SobreMi from './components/sections/SobreMi';
import Stats from './components/sections/Stats';
import Portfolio from './components/sections/Portfolio';
import WorkProcess from './components/sections/WorkProcess';
import CasosEstudio from './components/sections/CasosEstudio';
import Contact from './components/sections/Contact';
import Footer from './components/layout/Footer';
import VirtualAssistant from './components/ui/VirtualAssistant';
const PortfolioModal = lazy(() => import('./components/ui/PortfolioModal'));
import Magnetic from './components/ui/Magnetic';
import FloatingNav from './components/layout/FloatingNav';
import TimeThemeSelector from './components/ui/TimeThemeSelector';
import { useTimeTheme } from './context/TimeThemeContext';

// Import generated premium background illustration
import heroFlower from './assets/images/futuristic_tech_flower_1783666089719.jpg';

export default function App() {
  const { theme } = useTimeTheme();
  
  // Config state, load from localStorage if exists
  const [config, setConfig] = useState<AppConfig>(() => {
    const saved = localStorage.getItem('des_tec_studio_config');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return defaultAppConfig;
      }
    }
    return defaultAppConfig;
  });

  const handleConfigChange = (newConfig: AppConfig) => {
    setConfig(newConfig);
    localStorage.setItem('des_tec_studio_config', JSON.stringify(newConfig));
  };

  const handleResetConfig = () => {
    setConfig(defaultAppConfig);
    localStorage.removeItem('des_tec_studio_config');
  };

  // State to track active scroll section
  const [activeSection, setActiveSection] = useState('inicio');

  // State for portfolio modal triggers
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);

  // IntersectionObserver to spy scroll and update navbar indicators automatically
  useEffect(() => {
    const sections = ['inicio', 'servicios', 'proyectos', 'tecnologias', 'sobre-mi', 'proceso', 'casos-estudio', 'contacto'];
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-20% 0px -35% 0px',
        threshold: 0.1
      }
    );

    sections.forEach((secId) => {
      const el = document.getElementById(secId);
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  // Sincronización dinámica de Schema.org (JSON-LD) para 'ProfessionalService' y 'SoftwareCompany'
  useEffect(() => {
    let script = document.getElementById('schema-jsonld') as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = 'schema-jsonld';
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }

    const city = config.ciudad || 'Bogotá';
    const country = config.pais || 'Colombia';
    const isColombia = country.toLowerCase().includes('colombia');

    const schema = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": ["ProfessionalService", "SoftwareCompany"],
          "@id": `https://${config.dominio || 'des-tec.co'}/#organization`,
          "name": config.nombre || 'Des-Tec',
          "alternateName": `${config.nombre || 'Des-Tec'} Desarrollo y Tecnología`,
          "url": `https://${config.dominio || 'des-tec.co'}`,
          "logo": {
            "@type": "ImageObject",
            "url": `https://${config.dominio || 'des-tec.com'}/logo.jpg`,
            "caption": `${config.nombre || 'Des-Tec'} Logo`
          },
          "image": `https://${config.dominio || 'des-tec.co'}/logo.jpg`,
          "description": `Expertos en desarrollo de software premium, automatización avanzada de flujos con n8n, chatbots inteligentes de WhatsApp, integraciones complejas de API/CRM y consultoría técnica de SEO con sede en ${city}, ${country} y cobertura internacional para clientes globales.`,
          "telephone": config.whatsapp || '+573192078407',
          "email": config.correo || 'informacion.destec@gmail.com',
          "priceRange": "$$$",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": isColombia ? "#" : "#",
            "addressLocality": city,
            "addressRegion": isColombia ? "Bogotá D.C." : "#",
            "postalCode": isColombia ? "#" : "#",
            "addressCountry": isColombia ? "CO" : "ES"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": isColombia ? "4.6756" : "40.4531",
            "longitude": isColombia ? "-74.0543" : "-3.6883"
          },
          "openingHoursSpecification": [
            {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
              "opens": "09:00",
              "closes": "18:00"
            }
          ],
          "areaServed": [
            {
              "@type": "Country",
              "name": "Colombia"
            },
            {
              "@type": "Country",
              "name": "España"
            },
            {
              "@type": "Country",
              "name": "United States"
            },
            {
              "@type": "Country",
              "name": "Mexico"
            },
            {
              "@type": "AdministrativeArea",
              "name": "América Latina"
            }
          ],
          "knowsAbout": [
            "Software Development",
            "Web Application Development",
            "n8n Workflow Automation",
            "WhatsApp Business API chatbots",
            "API Integrations",
            "Search Engine Optimization (SEO)",
            "Tailwind CSS",
            "React"
          ],
          "sameAs": [
            config.redes?.github || "https://github.com/jeffersonu",
            config.redes?.linkedin || "https://www.linkedin.com/in/jefferson-urbina-39b5051a8/",
            config.redes?.twitter || "https://twitter.com/des_tec",
            config.redes?.instagram || "https://www.instagram.com/destec.dev/"
          ]
        }
      ]
    };

    script.textContent = JSON.stringify(schema, null, 2);
  }, [config]);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const { scrollY } = useScroll();
  const bgY1 = useTransform(scrollY, [0, 800], [0, -80]);
  const bgY2 = useTransform(scrollY, [0, 800], [0, 60]);
  const flowerY = useTransform(scrollY, [0, 1200], [0, 120]);

  // Premium studio entrance animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 35, filter: 'blur(10px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.9,
        ease: [0.16, 1, 0.3, 1],
      }
    }
  };

  return (
    <div id="des-tec-app-root" className={`min-h-screen ${theme.appRootBg} ${theme.textPrimary} overflow-x-hidden selection:bg-[var(--color-primary-hover)]/20 selection:text-[var(--color-text)] relative transition-colors duration-700`}>
      {/* High-Performance Interactive Star & Nebula Particle Canvas */}
      <Suspense fallback={null}>
        <InteractiveStarsCanvas />
      </Suspense>

      {/* Premium lagging magnetic cursor */}
      <Cursor />

      {/* Floating high-end quick-navigation index bar */}
      <FloatingNav activeSection={activeSection} />

      {/* Main glassmorphism top navigation */}
      <Header config={config} activeSection={activeSection} />

      {/* HERO SECTION */}
      <section
        id="inicio"
        className={`min-h-[80vh] flex items-center relative py-10 px-4 sm:px-6 lg:px-8 overflow-hidden ${theme.heroBg} transition-all duration-700`}
      >
        {/* Subtle grid background for SaaS/Vercel styling */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-secondary)/[0.015]_1px,transparent_1px),linear-gradient(to_bottom,var(--color-secondary)/[0.015]_1px,transparent_1px)] bg-[size:4.5rem_4.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] -z-20 pointer-events-none animate-pulse-slow" style={{ animationDuration: '8s' }} />
        {/* CUSTOM CSS STYLES FOR THE ROTATION AND DRIFT ANIMATIONS */}
        <style>{`
          @keyframes ultra-slow-spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes subtle-float-sculpture {
            0%, 100% { transform: translateY(0px) scale(1) rotate(0deg); }
            50% { transform: translateY(-20px) scale(1.02) rotate(2deg); }
          }
          @keyframes gentle-particle-drift {
            0%, 100% { transform: translate(0, 0); opacity: 0.15; }
            50% { transform: translate(20px, -25px); opacity: 0.35; }
          }
        `}</style>

        {/* ULTRA-LARGE, ULTRA-TRANSPARENT FLOATING FLOWER DECORATION */}
        <motion.div 
          className="absolute right-[-10%] top-[10%] w-[85vw] sm:w-[65vw] max-w-[850px] aspect-square pointer-events-none -z-20 select-none opacity-[0.03]"
          style={{ 
            animation: 'subtle-float-sculpture 32s ease-in-out infinite',
            y: flowerY
          }}
        >
          <img
            src={heroFlower}
            alt="Futuristic Tech Sculpture Behind"
            className="w-full h-full object-cover rounded-full mix-blend-multiply"
            style={{ 
              animation: 'ultra-slow-spin 200s linear infinite'
            }}
            referrerPolicy="no-referrer"
          />
          {/* Subtle overlay to further soften the background flower */}
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-background)] via-transparent to-[var(--color-background)]" />
        </motion.div>

        {/* GLOW AMBIENT MAPS (SOFT ACCENTS) */}
        <motion.div style={{ y: bgY1 }} className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-[var(--color-primary-hover)]/5 rounded-full blur-[130px] pointer-events-none -z-10" />
        <motion.div style={{ y: bgY2 }} className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-[var(--color-primary)]/5 rounded-full blur-[140px] pointer-events-none -z-10" />

        {/* SUBTLE PARTICLES DRIFTING */}
        <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
          <div 
            className="absolute top-1/3 left-1/2 w-1.5 h-1.5 bg-[var(--color-primary)] rounded-full blur-[1px]" 
            style={{ animation: 'gentle-particle-drift 14s ease-in-out infinite' }}
          />
          <div 
            className="absolute top-2/3 left-1/4 w-1 h-1 bg-[var(--color-secondary)] rounded-full blur-[1px]" 
            style={{ animation: 'gentle-particle-drift 18s ease-in-out infinite 2s' }}
          />
          <div 
            className="absolute top-1/4 right-1/3 w-2 h-2 bg-[var(--color-primary-hover)] rounded-full blur-[2px]" 
            style={{ animation: 'gentle-particle-drift 16s ease-in-out infinite 4s' }}
          />
        </div>

        <div className="max-w-7xl mx-auto w-full z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* LEFT COLUMN: HERO COPY & CTAs */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="col-span-1 lg:col-span-5 text-left space-y-5 sm:space-y-6"
          >
            
            {/* Title with clean high-contrast tech typography */}
            <motion.h1 variants={itemVariants} className={`text-4xl sm:text-6xl md:text-[68px] font-display font-black tracking-tight ${theme.id === 'night' ? 'text-white' : 'text-[var(--color-secondary)]'} leading-[1.08] transition-all duration-700`}>
              Creamos el software que hace{' '}
              <span className={`bg-gradient-to-r ${theme.accentGradient} bg-clip-text text-transparent transition-all duration-700`}>
                líderes de mercado.
              </span>
            </motion.h1>

            {/* Subtitle with proper hierarchy and line height */}
            <motion.p variants={itemVariants} className={`text-sm sm:text-base md:text-lg ${theme.textMuted} font-sans max-w-xl leading-relaxed transition-all duration-700`}>
              Sistemas web estables, flujos de automatización inteligentes con n8n y chatbots corporativos diseñados en {config.ciudad}, {config.pais}. No hacemos plantillas; desarrollamos interfaces futuristas de alto impacto comercial.
            </motion.p>

            {/* Interactive buttons CTAs with generous breathing room */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2 font-sans text-xs">
              <Magnetic>
                <button
                  onClick={() => scrollTo('contacto')}
                  id="hero-cta-quote-btn"
                  className="group px-8 py-4 bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-primary-hover)] to-[var(--color-primary)] bg-[length:200%_auto] hover:bg-[right_center] text-white rounded-xl border border-[var(--color-primary)]/10 transition-all duration-500 shadow-[0_4px_20px_rgba(108, 76, 245,0.2)] hover:shadow-[0_4px_25px_rgba(108, 76, 245,0.45)] font-bold flex items-center justify-center space-x-1.5 cursor-pointer hover:scale-[1.02] active:scale-[0.985]"
                >
                  <span>Solicitar Cotización</span>
                  <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              </Magnetic>
              <Magnetic>
                <button
                  onClick={() => scrollTo('proyectos')}
                  id="hero-cta-projects-btn"
                  className="group px-8 py-4 bg-gradient-to-r from-white to-[var(--color-background)] hover:to-[#F1F5F9] border border-[var(--color-text)]/10 hover:border-[var(--color-primary)]/35 text-[var(--color-text)] hover:text-[var(--color-primary)] rounded-xl shadow-sm hover:shadow-md transition-all duration-300 font-bold flex items-center justify-center space-x-1 cursor-pointer hover:scale-[1.02] active:scale-[0.985]"
                >
                  <span>Ver Proyectos</span>
                </button>
              </Magnetic>
            </motion.div>
          </motion.div>

          {/* RIGHT COLUMN: PROFESSIONAL PROJECT SLIDER */}
          <motion.div 
            className="col-span-1 lg:col-span-7 flex items-center justify-center pt-4 lg:pt-0"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          >
            <HeroSlider />
          </motion.div>
        </div>

        {/* Scroll down indicator */}
        <div
          onClick={() => scrollTo('servicios')}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center cursor-pointer text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-all select-none font-sans text-[9px] tracking-widest uppercase gap-1"
        >
          <span>Scroll down</span>
          <ChevronDown className="w-4 h-4 animate-bounce" />
        </div>
      </section>

      {/* Subtle Gradient Section Separator with soft shadow anchor */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[var(--color-secondary)]/[0.05] to-transparent relative z-10 shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />

      {/* SERVICES GRID */}
      <Services services={defaultServices} />

      {/* Subtle Gradient Section Separator with soft shadow anchor */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[var(--color-secondary)]/[0.05] to-transparent relative z-10 shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />

      {/* PORTFOLIO EXPERIENCES */}
      <Portfolio projects={defaultProjects} onSelectProject={setSelectedProject} />

      {/* Subtle Gradient Section Separator with soft shadow anchor */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[var(--color-secondary)]/[0.05] to-transparent relative z-10 shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />

      {/* TECH ECOSYSTEM */}
      <TechStack technologies={defaultTechnologies} />

      {/* Subtle Gradient Section Separator with soft shadow anchor */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[var(--color-secondary)]/[0.05] to-transparent relative z-10 shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />

      {/* ABOUT ME & STATS */}
      <SobreMi config={config} />

      {/* Subtle Gradient Section Separator with soft shadow anchor */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[var(--color-secondary)]/[0.05] to-transparent relative z-10 shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />

      {/* APPLE INSPIRED STUDIO STATISTICS BAND */}
      <Stats />

      {/* Subtle Gradient Section Separator with soft shadow anchor */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[var(--color-secondary)]/[0.05] to-transparent relative z-10 shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />

      {/* WORK PROCESS TIMELINE */}
      <WorkProcess steps={workSteps} />

      {/* Subtle Gradient Section Separator with soft shadow anchor */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[var(--color-secondary)]/[0.05] to-transparent relative z-10 shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />

      {/* CASOS DE ESTUDIO */}
      <CasosEstudio casos={defaultCaseStudies} />

      {/* Subtle Gradient Section Separator with soft shadow anchor */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[var(--color-secondary)]/[0.05] to-transparent relative z-10 shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />

      {/* PREMIUM MULTI-FIELD CONTACT FORM */}
      <Contact config={config} />

      {/* Subtle Gradient Section Separator with soft shadow anchor */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[var(--color-secondary)]/[0.05] to-transparent relative z-10 shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />

      {/* DETAILED RGPD COMPLIANT LEGAL FOOTER */}
      <Footer config={config} />

      {/* CORPORATE DES-TEC VIRTUAL ASSISTANT */}
      <VirtualAssistant config={config} />

      {/* TIME OF DAY SIMULATION DIAL */}
      <TimeThemeSelector />

      {/* IMMERSIVE PORTFOLIO APPLICATION MODAL OVERLAY */}
      <AnimatePresence>
        {selectedProject && (
          <Suspense fallback={null}>
            <PortfolioModal project={selectedProject} onClose={() => setSelectedProject(null)} />
          </Suspense>
        )}
      </AnimatePresence>
    </div>
  );
}
