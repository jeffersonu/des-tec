export interface Service {
  id: string;
  icon: string;
  title: string;
  description: string;
  features: string[];
}

export interface Technology {
  name: string;
  category: 'frontend' | 'backend' | 'database' | 'tools';
  iconName: string;
  tooltip: string;
}

export interface PortfolioProject {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  tags: string[];
  description: string;
  mockupUrl?: string;
  // Specific properties to render the live functional site in the modal!
  liveAppType: 'calculator' | 'kanban' | 'visualizer' | 'cargoflow' | 'remodelacionesya' | 'crm-whatsapp';
}

export interface CaseStudy {
  id: string;
  proyecto: string;
  problema: string;
  solucion: string;
  resultado: string;
  iconName: string;
}

export interface WorkStep {
  number: string;
  title: string;
  description: string;
  details: string[];
}

export interface ContactFormData {
  nombre: string;
  empresa: string;
  correo: string;
  whatsapp: string;
  ciudad: string;
  servicio: string;
  presupuesto: string;
  mensaje: string;
}

export interface AppConfig {
  nombre: string;
  cargo: string;
  ciudad: string;
  pais: string;
  correo: string;
  whatsapp: string;
  whatsappMsg: string;
  redes: {
    github: string;
    linkedin: string;
    twitter?: string;
    instagram: string;
    facebook: string;
  };
  dominio: string;
  legalInfo?: {
    razonSocial: string;
    nit: string;
    politicaPrivacidad: string;
    terminosServicio: string;
  };
}

export type CurrencyCode = 'COP' | 'USD' | 'EUR';

export interface BudgetRange {
  key: string;
  label: string;
}

export type BudgetConfig = Record<CurrencyCode, {
  symbol: string;
  ranges: BudgetRange[];
}>;
