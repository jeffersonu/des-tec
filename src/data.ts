import { AppConfig, Service, PortfolioProject, CaseStudy, WorkStep, Technology, BudgetConfig } from './types';

export const defaultAppConfig: AppConfig = {
  nombre: 'Des-Tec',
  cargo: 'Desarrollo y Tecnología',
  ciudad: 'Bogotá',
  pais: 'Colombia',
  correo: 'informacion.destec@gmail.com',
  whatsapp: '+573192078407',
  whatsappMsg: 'Hola Des-Tec, me interesa solicitar una cotización para un proyecto tecnológico.',
  redes: {
    github: 'https://github.com/jeffersonu',
    linkedin: 'https://www.linkedin.com/in/jefferson-urbina-39b5051a8/',
    instagram: 'https://www.instagram.com/destec.dev/',
    facebook: 'https://www.facebook.com/destec.dev/'
  },
  dominio: 'des-tec.co',
  
};

export const defaultServices: Service[] = [
  {
    id: 'web-dev',
    icon: 'Globe',
    title: 'Desarrollo Web & Apps',
    description: 'Plataformas web corporativas, landing pages de alta conversión, tiendas online de gran velocidad y aplicaciones web complejas a medida.',
    features: ['React & Next.js modernos', 'E-commerce optimizados', 'Webs Ultra-Rápidas', 'Responsive Design Absoluto']
  },
  {
    id: 'automation',
    icon: 'Cpu',
    title: 'Automatización & n8n',
    description: 'Automatizamos flujos de trabajo repetitivos y unimos tus herramientas de software favoritas utilizando n8n, Zapier y scripts personalizados.',
    features: ['Flujos n8n avanzados', 'Ahorro de horas manuales', 'Disminución de errores', 'Monitoreo en tiempo real']
  },
  {
    id: 'integrations',
    icon: 'Waypoints',
    title: 'Integraciones API & CRM',
    description: 'Conectamos tus sistemas internos (ERP, CRM) con APIs externas y diseñamos e implementamos flujos eficientes para tus bases de datos.',
    features: ['Conexión segura de datos', 'Automatización de Leads', 'Sincronización bilateral', 'Webhooks en tiempo real']
  },
  {
    id: 'whatsapp-chatbots',
    icon: 'MessageSquareText',
    title: 'Chatbots para WhatsApp',
    description: 'Desarrollamos bots inteligentes que automatizan la atención al cliente en WhatsApp, califican leads y agendan citas automáticas.',
    features: ['Integración API oficial', 'Flujos interactivos', 'Respuestas inmediatas 24/7', 'Conexión con CRM']
  },
  {
    id: 'seo-speed',
    icon: 'TrendingUp',
    title: 'SEO & Optimización',
    description: 'Llevamos tu sitio web al primer nivel en Google con SEO técnico avanzado, optimización extrema de velocidad y auditorías Lighthouse.',
    features: ['Lighthouse superior a 95', 'Estructura SEO Semántica', 'Optimización Core Web Vitals', 'Indexación garantizada']
  },
  {
    id: 'hosting-consulting',
    icon: 'ShieldCheck',
    title: 'Hosting, Mantenimiento & Consultoría',
    description: 'Infraestructura en la nube de alta disponibilidad, soporte continuo y asesoramiento estratégico para tomar decisiones tecnológicas acertadas.',
    features: ['Hosting Cloud administrado', 'Soporte y parches de seguridad', 'Consultoría de arquitectura', 'Copias de seguridad diarias']
  }
];

export const defaultTechnologies: Technology[] = [
  { name: 'HTML5', category: 'frontend', iconName: 'FileCode', tooltip: 'Maquetación web semántica y moderna.' },
  { name: 'CSS3', category: 'frontend', iconName: 'Layers', tooltip: 'Estilos responsivos, variables CSS avanzadas y layouts robustos.' },
  { name: 'JavaScript', category: 'frontend', iconName: 'Flame', tooltip: 'Interactividad dinámica de alto rendimiento.' },
  { name: 'React', category: 'frontend', iconName: 'Atom', tooltip: 'Componentes reactivos y arquitectura de interfaces premium.' },
  { name: 'Node.js', category: 'backend', iconName: 'Terminal', tooltip: 'Entorno de backend veloz y altamente escalable en Javascript.' },
  { name: 'PHP & Laravel', category: 'backend', iconName: 'Server', tooltip: 'Desarrollo de API y backends estables con el framework líder.' },
  { name: 'MySQL', category: 'database', iconName: 'Database', tooltip: 'Bases de datos relacionales robustas y optimizadas.' },
  { name: 'Git & GitHub', category: 'tools', iconName: 'GitBranch', tooltip: 'Control de versiones e integración continua profesional.' },
  { name: 'n8n', category: 'tools', iconName: 'Workflow', tooltip: 'Automatizaciones visuales e integraciones fluidas.' }
];

export const defaultProjects: PortfolioProject[] = [
  {
    id: 'proj-financial',
    title: 'Oracle Calc Suite',
    subtitle: 'Simulador Financiero Corporativo',
    category: 'Aplicaciones Web / Consultoría',
    tags: ['React', 'Tailwind', 'Recharts', 'Financial Engine'],
    description: 'Una suite financiera altamente interactiva que calcula retornos de inversión (ROI) con variables dinámicas, gráficos de dispersión/áreas en tiempo real y descarga de simulaciones. Diseñado para optimizar procesos de cotización y ventas de fondos.',
    liveAppType: 'calculator'
  },
  {
    id: 'proj-cargoflow',
    title: 'CargoFlow Web',
    subtitle: 'Logística Inteligente & Gestión de Fletes',
    category: 'Software Logístico / Panel SaaS',
    tags: ['React Router', 'Container Engine', 'Flete Calculator', 'Map Routing'],
    description: 'Plataforma para la optimización de cargamentos y logística internacional. Cuenta con un cotizador interactivo de contenedores marítimos y aéreos, calculadora de volumen cúbico y trazabilidad de rutas terrestres y marítimas en tiempo real.',
    liveAppType: 'cargoflow'
  },
  {
    id: 'proj-remodelacionesya',
    title: 'RemodelacionesYa.com',
    subtitle: 'Presupuestador de Reformas & Visualizador de Espacios',
    category: 'Desarrollo Web / Arquitectura',
    tags: ['Before-After Slider', 'Cost Estimator', 'Tailwind CSS', 'Dynamic UI'],
    description: 'Plataforma web premium que permite a los usuarios cotizar remodelaciones de interiores al instante, configurar materiales (pisos, encimeras, pintura) y comparar visualmente el "Antes y Después" interactivo de espacios residenciales.',
    liveAppType: 'remodelacionesya'
  },
  {
    id: 'proj-crm-whatsapp',
    title: 'AeroSync CRM & WhatsApp',
    subtitle: 'Automatización Inteligente de Chatbots & Leads',
    category: 'Automatización / Integración API',
    tags: ['WhatsApp Business API', 'CRM Sync', 'n8n Webhook', 'Real-time Logs'],
    description: 'Simulador en tiempo real que demuestra la automatización de un flujo de ventas: interactúa con un chatbot de WhatsApp en un teléfono simulado y observa cómo se nutren y actualizan los leads en el panel CRM de forma inmediata.',
    liveAppType: 'crm-whatsapp'
  }
];

export const defaultCaseStudies: CaseStudy[] = [
  {
    id: 'case-1',
    proyecto: 'Optimización de Plataforma E-Commerce',
    problema: 'Tasa de abandono de carrito de un 58% debido a tiempos de carga extremadamente lentos (>4 segundos) y caídas intermitentes del servidor durante campañas masivas de marketing.',
    solucion: 'Re-arquitectura completa del frontend utilizando React y optimización del checkout mediante caché perimetral inteligente, minimizando peticiones innecesarias.',
    resultado: 'Tiempos de respuesta interactiva reducidos a 400ms (una reducción del 90%) y un incremento neto del 32% en la tasa de conversión global de ventas.',
    iconName: 'TrendingUp'
  },
  {
    id: 'case-2',
    proyecto: 'Automatización de Facturación y Finanzas',
    problema: 'Más de 20 horas semanales dedicadas a registrar depósitos de clientes y conciliar facturas de forma manual, ocasionando demoras de hasta 5 días en la facturación y frecuentes errores humanos.',
    solucion: 'Sincronización en tiempo real vía webhooks integrando la pasarela de pagos con el sistema contable utilizando flujos de automatización en n8n.',
    resultado: 'Automatización del 100% del proceso de facturación, eliminando retrasos a cero minutos y reduciendo por completo los errores de conciliación manual.',
    iconName: 'Cpu'
  },
  {
    id: 'case-3',
    proyecto: 'Asistente Multiagente para WhatsApp',
    problema: 'Equipo de soporte telefónico saturado y con tiempos promedio de respuesta superiores a las 2 horas para preguntas frecuentes de clientes recurrentes.',
    solucion: 'Chatbot automatizado interactivo integrado con la API de WhatsApp Business que califica clientes potenciales y resuelve preguntas frecuentes en segundos.',
    resultado: 'Resolución inmediata del 80% de las consultas básicas y liberación de 15 horas semanales del equipo comercial para enfocarse en prospectos de alto valor.',
    iconName: 'Zap'
  }
];

export const workSteps: WorkStep[] = [
  {
    number: '01',
    title: 'Análisis Estratégico',
    description: 'Estudiamos tus metas comerciales, tus sistemas de software actuales y definimos la arquitectura idónea para escalar.',
    details: ['Reunión técnica inicial', 'Definición de requerimientos', 'Estudio de cuellos de botella']
  },
  {
    number: '02',
    title: 'Diseño UX/UI Premium',
    description: 'Diseñamos prototipos de alta fidelidad que reflejan elegancia, espacio, legibilidad extrema y una experiencia futurista memorable.',
    details: ['Dirección de marca y estilo', 'Wireframes interactivos', 'Aprobación de la paleta y layouts']
  },
  {
    number: '03',
    title: 'Desarrollo de Alta Costura',
    description: 'Escribimos código limpio, modular, tipado de punta a punta y optimizado para una velocidad y rendimiento impecable.',
    details: ['React & Next-Gen Frameworks', 'Estructuración modular sólida', 'Sin dependencias innecesarias']
  },
  {
    number: '04',
    title: 'Automatización & Pruebas',
    description: 'Implementamos flujos n8n/APIs y realizamos pruebas rigurosas de carga, latencia, accesibilidad WCAG y compatibilidad móvil.',
    details: ['Validación de automatizaciones', 'Auditoría Lighthouse > 95', 'Pruebas de respuesta extrema']
  },
  {
    number: '05',
    title: 'Implementación Cloud',
    description: 'Desplegamos en servidores cloud de alto rendimiento con redundancia, SSL, compresión Gzip/Brotli y CDN global.',
    details: ['Despliegue sin interrupciones', 'Monitoreo de telemetría de red', 'Configuración de seguridad perimetral']
  },
  {
    number: '06',
    title: 'Soporte y Evolución',
    description: 'Acompañamos a tu empresa con mantenimiento proactivo, actualizaciones periódicas de seguridad y optimizaciones de conversión.',
    details: ['Actualizaciones mensuales', 'Monitoreo de estado y SLAs', 'Asesoría de escalabilidad futura']
  }
];

export const defaultBudgetConfig: BudgetConfig = {
  COP: {
    symbol: 'COP ($)',
    ranges: [
      { key: 'low', label: '800K - 3M COP' },
      { key: 'mid', label: '3M - 8M COP' },
      { key: 'high', label: '> 8M COP' }
    ]
  },
  USD: {
    symbol: 'USD ($)',
    ranges: [
      { key: 'low', label: '$250 - $1,000 USD' },
      { key: 'mid', label: '$1,000 - $3,000 USD' },
      { key: 'high', label: '> $3,000 USD' }
    ]
  },
  EUR: {
    symbol: 'EUR (€)',
    ranges: [
      { key: 'low', label: '250 € - 1.000 €' },
      { key: 'mid', label: '1.000 € - 3.000 €' },
      { key: 'high', label: '> 3.000 €' }
    ]
  }
};

