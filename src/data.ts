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
  // ==========================================
  // CATEGORÍA 1: DESARROLLO WEB (3 PROYECTOS)
  // ==========================================
  {
    id: 'proj-remodelacionesya',
    title: 'RemodelacionesYa.com',
    subtitle: 'Presupuestador Web & Visualizador 3D',
    category: 'Desarrollo Web / SaaS',
    clientIndustry: 'Bienes Raíces & Arquitectura',
    routeCategory: ['web'],
    tags: ['React 18', 'TypeScript', 'Tailwind CSS', 'Dynamic Engine'],
    metrics: ['⚡ Carga < 120ms', '🎨 Comparador Antes/Después', '🎯 +45% Cotizaciones'],
    description: 'Plataforma web interactiva para cotizar remodelaciones en tiempo real. Configuración dinámica de acabados, presupuesto inmediato y comparador visual interactivo.',
    mockupUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    liveAppType: 'remodelacionesya',
    isIntegrated: true,
    sourcePath: 'github.com/jeffersonu/pagina-remodelaciones',
    demoId: 'proj-remodelacionesya'
  },
  {
    id: 'proj-financial',
    title: 'CargoFlow ERP',
    subtitle: 'Sistema CRM & ERP para Logística e Importaciones',
    category: 'Plataformas Web & Logística',
    clientIndustry: 'Agencias de Carga & Logística',
    routeCategory: ['web'],
    tags: ['React', 'TypeScript', 'Tailwind CSS', 'Cotizador CBM', 'Tracking'],
    metrics: ['🚢 Cotizador CBM', '📍 Tracking Marítimo', '📦 +10K Envíos/Mes'],
    description: 'Plataforma ERP y CRM integral para agencias de carga internacional. Sistema interactivo para cálculo de volumen cúbico (CBM), cotización automática de fletes marinos/aéreos y seguimiento de contenedores.',
    mockupUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
    liveAppType: 'cargoflow',
    isIntegrated: true,
    sourcePath: 'github.com/jeffersonu/CargoFlowERP',
    demoId: 'proj-financial'
  },
  {
    id: 'proj-nexustech',
    title: 'Restaurant System POS',
    subtitle: 'Menú Digital, Comandas de Cocina (KDS) & Control de Mesas',
    category: 'Plataformas Web & Gastronomía',
    clientIndustry: 'Restaurantes & Gastronomía',
    routeCategory: ['web'],
    tags: ['React', 'TypeScript', 'POS System', 'KDS Cocina', 'Menú Digital'],
    metrics: ['🍽️ Menú Interactivo', '⚡ Pedidos < 5s', '📊 +45% Eficiencia'],
    description: 'Sistema web integral para restaurantes y negocios gastronómicos. Incluye punto de venta (POS), comandas digitales en cocina (KDS), gestión visual de mesas y control de ventas.',
    mockupUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
    liveAppType: 'restaurant',
    isIntegrated: true,
    sourcePath: 'src/demos/restaurant',
    demoId: 'proj-nexustech'
  },

  // ==========================================
  // CATEGORÍA 2: AUTOMATIZACIONES (3 PROYECTOS)
  // ==========================================
  {
    id: 'proj-crm-whatsapp',
    title: 'AeroSync Chatbot WhatsApp',
    subtitle: 'Atención 24/7 con Meta Cloud API & n8n',
    category: 'Automatización / WhatsApp',
    clientIndustry: 'E-Commerce & Servicios',
    routeCategory: ['automation'],
    tags: ['WhatsApp Cloud API', 'n8n Webhook', 'Gemini AI', 'CRM Sync'],
    metrics: ['🤖 Respuesta < 3 Segundos', '⚡ 24/7 Disponible', '🎯 Ahorro 320h/mes'],
    description: 'Bot de WhatsApp inteligente conectado con la API Oficial de Meta. Califica clientes potenciales en tiempo real, resuelve preguntas frecuentes e inserta prospectos al CRM.',
    mockupUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
    liveAppType: 'crm-whatsapp',
    isIntegrated: true,
    sourcePath: 'src/demos/proj-crm-whatsapp',
    demoId: 'proj-crm-whatsapp'
  },
  {
    id: 'proj-n8n-workflow',
    title: 'WorkFlow Sync Engine',
    subtitle: 'Orquestación de Procesos & Sync Multicanal',
    category: 'Automatización / n8n',
    clientIndustry: 'Operaciones & Finanzas',
    routeCategory: ['automation'],
    tags: ['n8n Self-Hosted', 'Google Sheets API', 'Slack Bot', 'Webhooks'],
    metrics: ['🔄 Sincronización Automática', '0% Errores Manuales', '⚡ +500 Triggers/Día'],
    description: 'Motor de integración n8n autohospedado que procesa correos, actualiza hojas de cálculo en tiempo real, genera comprobantes en PDF y notifica alertas críticas por Slack y WhatsApp.',
    mockupUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
    liveAppType: 'crm-whatsapp',
    isIntegrated: true,
    sourcePath: 'src/demos/proj-n8n-workflow',
    demoId: 'proj-n8n-workflow'
  },
  {
    id: 'proj-auto-invoice',
    title: 'SmartDoc AI & Invoice Extractor',
    subtitle: 'Procesamiento Inteligente de Documentos con IA',
    category: 'Automatización / OCR & IA',
    clientIndustry: 'Legaltech & Contabilidad',
    routeCategory: ['automation'],
    tags: ['Gemini AI Vision', 'n8n Workflow', 'PDF OCR Engine', 'ERP Sync'],
    metrics: ['🧠 Extracción IA con Gemini', '⏱️ Procesamiento en 2s', '📄 100% Sin Papel'],
    description: 'Workflow automatizado que extrae campos clave de facturas, contratos y PDFs escaneados utilizando modelos de IA, sincronizándolos automáticamente con el sistema contable.',
    mockupUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    liveAppType: 'visualizer',
    isIntegrated: true,
    sourcePath: 'src/demos/proj-auto-invoice',
    demoId: 'proj-auto-invoice'
  },

  // ==========================================
  // CATEGORÍA 3: CRM & PANELES (3 PROYECTOS)
  // ==========================================
  {
    id: 'proj-cargoflow',
    title: 'CargoFlow CRM Logístico',
    subtitle: 'Gestión de Fletes, Pedidos & Trazabilidad',
    category: 'Software CRM / Panel SaaS',
    clientIndustry: 'Logística & Comercio Exterior',
    routeCategory: ['crm'],
    tags: ['React Router', 'Flete Calculator', 'Dashboard Realtime', 'TypeScript'],
    metrics: ['🚢 Cotizador de Fletes CBM', '📍 Tracking en Vivo', '📦 +10K Envíos/Mes'],
    description: 'Plataforma CRM especializada para empresas de carga internacional. Cotización automática de contenedores FCL/LCL, cálculo de volumen cúbico y rastreo marítimo.',
    mockupUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
    liveAppType: 'cargoflow',
    isIntegrated: true,
    sourcePath: 'src/demos/proj-cargoflow',
    demoId: 'proj-cargoflow'
  },
  {
    id: 'proj-apex-crm',
    title: 'Apex Sales CRM',
    subtitle: 'Pipeline Kanban & Control de Facturación',
    category: 'Software Empresarial / CRM',
    clientIndustry: 'Distribución & Ventas B2B',
    routeCategory: ['crm'],
    tags: ['Kanban Drag & Drop', 'Roles & RBAC', 'PDF Invoicing', 'Recharts'],
    metrics: ['📊 Pipeline Kanban Interactivo', '📈 +38% Cierre de Ventas', '🧾 Facturación PDF'],
    description: 'CRM comercial con tablero Kanban arrastrable para gestionar etapas de ventas, seguimiento de prospectos, generación de cotizaciones PDF y reportes analíticos de rendimiento.',
    mockupUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80',
    liveAppType: 'kanban',
    isIntegrated: true,
    sourcePath: 'src/demos/proj-apex-crm',
    demoId: 'proj-apex-crm'
  },
  {
    id: 'proj-medismart-crm',
    title: 'MediSmart CRM Médico & Agendamiento',
    subtitle: 'Gestión de Pacientes & Citas con WhatsApp',
    category: 'Software Médico / CRM Especializado',
    clientIndustry: 'Salud & Clínicas Privadas',
    routeCategory: ['crm'],
    tags: ['Agendamiento React', 'WhatsApp API', 'Seguridad de Datos', 'Analytics'],
    metrics: ['🏥 0% Citas Perdidas', '📲 Recordatorios WhatsApp', '📋 Ficha Clínica Segura'],
    description: 'CRM médico adaptado para centros de salud. Agendamiento inteligente de turnos, recordatorios automáticos de citas por WhatsApp y panel de historia clínica para especialistas.',
    mockupUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
    liveAppType: 'pending',
    isIntegrated: false,
    sourcePath: 'github.com/des-tec/medismart-crm',
    demoId: 'proj-medismart-crm'
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

