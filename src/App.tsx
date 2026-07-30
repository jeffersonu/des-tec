import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';

// Data default structures
import { defaultAppConfig } from './data';
import { AppConfig, PortfolioProject } from './types';

// Modular Layout & UI Subcomponents
const InteractiveStarsCanvas = lazy(() => import('./components/ui/InteractiveStarsCanvas'));
import CosmicBackdrop from './components/ui/CosmicBackdrop';
import Cursor from './components/ui/Cursor';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import VirtualAssistant from './components/ui/VirtualAssistant';
const PortfolioModal = lazy(() => import('./components/ui/PortfolioModal'));
import FloatingNav from './components/layout/FloatingNav';
import TimeThemeSelector from './components/ui/TimeThemeSelector';
import { useTimeTheme } from './context/TimeThemeContext';

// Multi-page Views
import HomePage from './pages/HomePage';
import ProjectsPage from './pages/ProjectsPage';
import WebDevPage from './pages/WebDevPage';
import AutomationsPage from './pages/AutomationsPage';
import CrmPage from './pages/CrmPage';

export default function App() {
  const { theme } = useTimeTheme();
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

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

  // State to track active scroll section on homepage
  const [activeSection, setActiveSection] = useState('inicio');

  // State for portfolio modal triggers
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);

  // IntersectionObserver to spy scroll and update navbar indicators automatically when on home route
  useEffect(() => {
    if (location.pathname !== '/') return;

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
  }, [location.pathname]);

  return (
    <div id="des-tec-app-root" className={`min-h-screen ${theme.appRootBg} ${theme.textPrimary} overflow-x-hidden selection:bg-[var(--color-primary-hover)]/20 selection:text-[var(--color-text)] relative transition-colors duration-700`}>
      {/* Immersive continuous space backdrop: nebulas, drifting blurred planets, parallax */}
      <CosmicBackdrop />

      {/* High-Performance Interactive Star & Nebula Particle Canvas */}
      <Suspense fallback={null}>
        <InteractiveStarsCanvas />
      </Suspense>

      {/* Premium lagging magnetic cursor */}
      <Cursor />

      {/* Floating high-end quick-navigation index bar (active on home) */}
      {location.pathname === '/' && <FloatingNav activeSection={activeSection} />}

      {/* Main glassmorphism top navigation */}
      <Header config={config} activeSection={activeSection} />

      {/* MULTI-PAGE ROUTES */}
      <main id="main-content-router">
        <Routes>
          <Route path="/" element={<HomePage config={config} onSelectProject={setSelectedProject} />} />
          <Route path="/proyectos" element={<ProjectsPage config={config} onSelectProject={setSelectedProject} />} />
          <Route path="/desarrollo-web" element={<WebDevPage config={config} onSelectProject={setSelectedProject} />} />
          <Route path="/automatizaciones" element={<AutomationsPage config={config} onSelectProject={setSelectedProject} />} />
          <Route path="/crm" element={<CrmPage config={config} onSelectProject={setSelectedProject} />} />
          <Route path="*" element={<HomePage config={config} onSelectProject={setSelectedProject} />} />
        </Routes>
      </main>

      {/* DETAILED RGPD COMPLIANT LEGAL FOOTER */}
      <Footer config={config} />

      {/* CORPORATE DES-TEC VIRTUAL ASSISTANT (Robot) */}
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
