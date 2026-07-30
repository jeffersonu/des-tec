import webDevBanner1 from '../assets/images/web_dev_banner_1_1785294526701.jpg';
import webDevBanner2 from '../assets/images/web_dev_banner_2_1785294542037.jpg';
import webDevBanner3 from '../assets/images/web_dev_banner_3_1785294561371.jpg';
import autoBanner1 from '../assets/images/automation_banner_1_1785294577660.jpg';
import autoBanner2 from '../assets/images/automation_banner_2_1785294598803.jpg';
import crmBanner1 from '../assets/images/crm_banner_1_1785294614169.jpg';
import crmBanner2 from '../assets/images/crm_banner_2_1785294631380.jpg';
import sobreMiBanner1 from '../assets/images/sobre_mi_banner_1_1785294647888.jpg';

import { CarouselSlide } from '../components/ui/PageHeroCarousel';

// 1. HOME PAGE CAROUSEL SLIDES
export const getHomeSlides = (scrollToContact: () => void): CarouselSlide[] => [
  {
    id: 'home-web',
    image: webDevBanner1,
    badge: 'Desarrollo Web & SaaS',
    title: 'Soluciones Web Rápidas, Modernas y Escalables',
    description: 'Creamos experiencias digitales de alto impacto que transforman visitantes en clientes con React y TypeScript.',
    ctaText: 'Cotizar Proyecto Web',
    ctaAction: scrollToContact,
    tags: ['React 18', 'TypeScript', 'Tailwind CSS', 'Performance <150ms'],
    themeColor: 'sky'
  },
  {
    id: 'home-auto',
    image: autoBanner1,
    badge: 'Automatización & n8n',
    title: 'Automatizamos Tus Procesos, Optimizamos Tu Éxito',
    description: 'Workflows inteligentes que integran tus apps, eliminan el trabajo repetitivo y ahorran cientos de horas.',
    ctaText: 'Diseñar Automatización',
    ctaAction: scrollToContact,
    tags: ['n8n Self-Hosted', 'WhatsApp API', 'Integración CRM', 'Workflows IA'],
    themeColor: 'emerald'
  },
  {
    id: 'home-crm',
    image: crmBanner1,
    badge: 'CRM & Paneles Comercial',
    title: 'CRM Inteligente: Conecta, Gestiona y Haz Crecer Tu Empresa',
    description: 'Tableros Kanban de ventas, cotizadores automáticos y reportes en tiempo real adaptados a tu negocio.',
    ctaText: 'Ver Demostración CRM',
    ctaAction: scrollToContact,
    tags: ['Pipelines Visuales', 'Generador PDF', 'Métricas KPI', 'Control de Roles'],
    themeColor: 'amber'
  },
  {
    id: 'home-tech',
    image: webDevBanner2,
    badge: 'Ingeniería Artesanal',
    title: 'Tecnología Que Conecta Ideas Con Resultados Reales',
    description: 'Desarrollo de software a medida sin plantillas obsoletas para empresas preparadas para escalar.',
    ctaText: 'Hablar Con Un Desarrollador',
    ctaAction: scrollToContact,
    tags: ['Next.js', 'Node.js', 'Laravel', 'Docker Cloud'],
    themeColor: 'purple'
  }
];

// 2. WEB DEV PAGE CAROUSEL SLIDES
export const getWebDevSlides = (scrollToContact: () => void): CarouselSlide[] => [
  {
    id: 'web-1',
    image: webDevBanner1,
    badge: 'Plataformas Web & SaaS',
    title: 'Creamos Experiencias Digitales de Alto Rendimiento',
    description: 'Sitios corporativos y aplicaciones web ultrarrápidas con arquitectura React modular y diseño responsive.',
    ctaText: 'Solicitar Cotización',
    ctaAction: scrollToContact,
    tags: ['Sin Plantillas', 'Lighthouse 95+', 'SEO Avanzado', 'Core Web Vitals'],
    themeColor: 'sky'
  },
  {
    id: 'web-2',
    image: webDevBanner2,
    badge: 'Stack Tecnológico',
    title: 'Tecnología Que Conecta Ideas Con Resultados Reales',
    description: 'Usamos las mejores tecnologías del mercado: React, Next.js, Vue, Node.js, Laravel y MySQL para la máxima estabilidad.',
    ctaText: 'Consultar Tecnologías',
    ctaAction: scrollToContact,
    tags: ['React 18', 'Next.js', 'Node.js Core', 'Laravel API'],
    themeColor: 'sky'
  },
  {
    id: 'web-3',
    image: webDevBanner3,
    badge: 'Presencia Digital 360°',
    title: 'Llevamos Tu Presencia Digital Al Siguiente Nivel',
    description: 'Diseño UI/UX atractivo, desarrollo escalable, optimización extrema de velocidad y soporte continuo.',
    ctaText: 'Iniciar Mi Proyecto',
    ctaAction: scrollToContact,
    tags: ['Diseño UI/UX', 'Mobile-First', 'Seguridad SSL', 'Soporte 24/7'],
    themeColor: 'sky'
  }
];

// 3. AUTOMATIONS PAGE CAROUSEL SLIDES
export const getAutomationSlides = (scrollToContact: () => void): CarouselSlide[] => [
  {
    id: 'auto-1',
    image: autoBanner1,
    badge: 'Motor n8n Enterprise',
    title: 'Automatizamos Tus Procesos, Optimizamos Tu Éxito',
    description: 'Conectamos tus formularios, bases de datos y herramientas comerciales en un flujo continuo y rápido.',
    ctaText: 'Crear Mi Flujo',
    ctaAction: scrollToContact,
    tags: ['Captura de Datos', 'Procesamiento IA', 'Almacenamiento', 'Notificaciones'],
    themeColor: 'emerald'
  },
  {
    id: 'auto-2',
    image: autoBanner2,
    badge: 'Workflows & Chatbots',
    title: 'Automatizamos Hoy Para Que Tu Negocio Avance Siempre',
    description: 'Diseñamos flujos inteligentes que eliminan lo repetitivo y te dan resultados desde el primer día.',
    ctaText: 'Agendar Demostración',
    ctaAction: scrollToContact,
    tags: ['WhatsApp Cloud API', 'Slack & Sheets', '98% Ejecuciones Exitosas', 'Ahorro 320h/mes'],
    themeColor: 'emerald'
  }
];

// 4. CRM PAGE CAROUSEL SLIDES
export const getCrmSlides = (scrollToContact: () => void): CarouselSlide[] => [
  {
    id: 'crm-1',
    image: crmBanner1,
    badge: 'CRM Personalizado',
    title: 'CRM Inteligente: Relaciones Que Impulsan Tu Negocio',
    description: 'Gestiona clientes, oportunidades y equipos desde un solo lugar con total claridad y mejores decisiones.',
    ctaText: 'Solicitar Demo CRM',
    ctaAction: scrollToContact,
    tags: ['Vista 360° Cliente', 'Funnel de Ventas', 'Cotizador PDF', 'Control de Roles'],
    themeColor: 'amber'
  },
  {
    id: 'crm-2',
    image: crmBanner2,
    badge: 'Plataforma Integrada',
    title: 'Conecta, Gestiona y Haz Crecer Tu Empresa',
    description: 'Una plataforma todo en uno para automatizar procesos comerciales y convertir oportunidades en resultados.',
    ctaText: 'Probar CRM A Medida',
    ctaAction: scrollToContact,
    tags: ['Google Workspace', 'Microsoft 365', 'WhatsApp Integration', 'HubSpot / Slack'],
    themeColor: 'amber'
  }
];

// 5. PROJECTS PAGE CAROUSEL SLIDES
export const getProjectsSlides = (scrollToContact: () => void): CarouselSlide[] => [
  {
    id: 'proj-slide-1',
    image: webDevBanner1,
    badge: 'Portafolio de Ingeniería',
    title: 'Proyectos Desarrollados para Empresas de Alto Rendimiento',
    description: 'Explora nuestra galería de soluciones reales: portales web, workflows automatizados con n8n y sistemas CRM personalizados.',
    ctaText: 'Solicitar Mi Proyecto',
    ctaAction: scrollToContact,
    tags: ['Desarrollo Web', 'Automatización n8n', 'Sistemas CRM', 'Demos Interactivas'],
    themeColor: 'purple'
  },
  {
    id: 'proj-slide-2',
    image: autoBanner1,
    badge: 'Flujos & Automatizaciones',
    title: 'Workflows Inteligentes e Integraciones 24/7',
    description: 'Procesos de negocio automatizados con WhatsApp Cloud API, n8n y modelos de inteligencia artificial.',
    ctaText: 'Ver Automatizaciones',
    ctaAction: scrollToContact,
    tags: ['WhatsApp Cloud API', 'Ahorro 320h/mes', 'n8n Workflows', 'OCR Inteligente'],
    themeColor: 'emerald'
  },
  {
    id: 'proj-slide-3',
    image: crmBanner1,
    badge: 'Plataformas CRM A Medida',
    title: 'CRM y Paneles de Control Comercial Personalizados',
    description: 'Pipelines Kanban interactivos, cotizadores en tiempo real y gestión operativa eficiente para empresas.',
    ctaText: 'Probar Demos CRM',
    ctaAction: scrollToContact,
    tags: ['Tableros Kanban', 'Facturación PDF', 'Logística & Fletes', 'Métricas KPI'],
    themeColor: 'amber'
  }
];

// 6. SOBRE MI / NOSOTROS CAROUSEL SLIDES
export const getSobreMiSlides = (scrollToContact: () => void): CarouselSlide[] => [
  {
    id: 'sobre-1',
    image: sobreMiBanner1,
    badge: 'Des-Tec Equipo',
    title: 'Desarrollo y Tecnología Sin Compromisos',
    description: 'Equipo senior apasionado por crear arquitectura de software limpia, ultrarrápida y enfocada en conversión.',
    ctaText: 'Conocer Nuestro Enfoque',
    ctaAction: scrollToContact,
    tags: ['Código Artesanal', 'Ecosistema Laravel/React', 'n8n Workflows', 'Despliegues Cloud'],
    themeColor: 'purple'
  },
  {
    id: 'sobre-2',
    image: webDevBanner2,
    badge: 'Especialidades',
    title: 'Ingeniería de Software de Alto Nivel',
    description: 'Construimos cada línea de código a medida sin depender de plantillas lentas ni plugins inseguros.',
    ctaText: 'Hablar Con Nosotros',
    ctaAction: scrollToContact,
    tags: ['Optimización CRO', 'Seguridad SSL/WAF', 'SLA Garantizado', 'Escalabilidad'],
    themeColor: 'purple'
  }
];
