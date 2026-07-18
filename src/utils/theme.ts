export type TimeThemeId = 'morning' | 'midday' | 'afternoon' | 'night';

export interface TimeThemeConfig {
  id: TimeThemeId;
  name: string;
  emoji: string;
  range: string;
  description: string;
  
  // Body and texts
  appRootBg: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  
  // Section background styles
  heroBg: string;
  sectionBgLight: string;
  sectionBgDark: string;
  sectionBorder: string;
  
  // Cards and interactive elements
  cardBg: string;
  cardBorder: string;
  cardShadow: string;
  inputBg: string;
  inputBorder: string;
  
  // Accent colors
  accentText: string;
  accentBg: string;
  accentGradient: string;
  accentGlow: string;
  
  // Particle configuration
  particleColor: string;
  nebulaOpacity: number;
}

export const themes: Record<TimeThemeId, TimeThemeConfig> = {
  morning: {
    id: 'morning',
    name: 'Mañana',
    emoji: '🌅',
    range: '6:00 AM - 11:59 AM',
    description: 'Claridad premium, azules eléctricos suaves y superficies limpias.',
    appRootBg: 'bg-[var(--color-background)]',
    textPrimary: 'text-[var(--color-text)]',
    textSecondary: 'text-[var(--color-text-secondary)]',
    textMuted: 'text-[var(--color-text-secondary)]/70',
    heroBg: 'bg-gradient-to-b from-white via-[var(--color-background)] to-[var(--color-background)]',
    sectionBgLight: 'bg-[var(--color-background)]',
    sectionBgDark: 'bg-[var(--color-surface)]',
    sectionBorder: 'border-[var(--color-border)]',
    cardBg: 'bg-[var(--color-surface)]/90 backdrop-blur-md',
    cardBorder: 'border-[var(--color-border)]/80',
    cardShadow: 'shadow-[0_4px_25px_rgba(37,99,235,0.02)]',
    inputBg: 'bg-[var(--color-surface)]',
    inputBorder: 'border-[var(--color-border)]',
    accentText: 'text-[var(--color-primary)]',
    accentBg: 'bg-[var(--color-primary)]',
    accentGradient: 'from-[var(--color-primary)] via-[var(--color-primary-hover)] to-[var(--color-primary)]',
    accentGlow: 'bg-[var(--color-primary)]/5',
    particleColor: '#2563EB',
    nebulaOpacity: 0.1,
  },
  midday: {
    id: 'midday',
    name: 'Mediodía',
    emoji: '☀️',
    range: '12:00 PM - 4:59 PM',
    description: 'Enfoque de alta tecnología, contraste nítido y azul vibrante.',
    appRootBg: 'bg-[var(--color-background)]',
    textPrimary: 'text-[var(--color-text)]',
    textSecondary: 'text-[var(--color-text-secondary)]',
    textMuted: 'text-[var(--color-text-secondary)]/70',
    heroBg: 'bg-gradient-to-b from-white via-[var(--color-background)] to-[var(--color-background)]',
    sectionBgLight: 'bg-[var(--color-background)]',
    sectionBgDark: 'bg-[var(--color-surface)]',
    sectionBorder: 'border-[var(--color-border)]',
    cardBg: 'bg-[var(--color-surface)]/90 backdrop-blur-md',
    cardBorder: 'border-[var(--color-border)]/80',
    cardShadow: 'shadow-[0_4px_25px_rgba(37,99,235,0.03)]',
    inputBg: 'bg-[var(--color-surface)]',
    inputBorder: 'border-[var(--color-border)]',
    accentText: 'text-[var(--color-primary)]',
    accentBg: 'bg-[var(--color-primary)]',
    accentGradient: 'from-[var(--color-primary)] via-[var(--color-primary-hover)] to-[var(--color-primary)]',
    accentGlow: 'bg-[var(--color-primary)]/5',
    particleColor: '#2563EB',
    nebulaOpacity: 0.08,
  },
  afternoon: {
    id: 'afternoon',
    name: 'Tarde',
    emoji: '🌇',
    range: '5:00 PM - 7:59 PM',
    description: 'Aura tecnológica sofisticada con sutiles matices azul petróleo.',
    appRootBg: 'bg-[var(--color-background)]',
    textPrimary: 'text-[var(--color-text)]',
    textSecondary: 'text-[var(--color-text-secondary)]',
    textMuted: 'text-[var(--color-text-secondary)]/70',
    heroBg: 'bg-gradient-to-b from-white via-[var(--color-background)] to-[var(--color-background)]',
    sectionBgLight: 'bg-[var(--color-background)]',
    sectionBgDark: 'bg-[var(--color-surface)]',
    sectionBorder: 'border-[var(--color-border)]',
    cardBg: 'bg-[var(--color-surface)]/90 backdrop-blur-md',
    cardBorder: 'border-[var(--color-border)]/80',
    cardShadow: 'shadow-[0_4px_25px_rgba(37,99,235,0.03)]',
    inputBg: 'bg-[var(--color-surface)]',
    inputBorder: 'border-[var(--color-border)]',
    accentText: 'text-[var(--color-primary)]',
    accentBg: 'bg-[var(--color-primary)]',
    accentGradient: 'from-[var(--color-primary)] via-[var(--color-primary-hover)] to-[var(--color-primary)]',
    accentGlow: 'bg-[var(--color-primary)]/5',
    particleColor: '#2563EB',
    nebulaOpacity: 0.12,
  },
  night: {
    id: 'night',
    name: 'Noche',
    emoji: '🌌',
    range: '8:00 PM - 5:59 AM',
    description: 'Modo oscuro premium, grafito profundo y azules eléctricos con atmósfera espacial.',
    appRootBg: 'bg-[var(--color-support)]',
    textPrimary: 'text-[#F5F6FA]',
    textSecondary: 'text-[#94A3B8]',
    textMuted: 'text-[#64748B]',
    heroBg: 'bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,var(--color-secondary)_0%,var(--color-support)_55%,#050709_100%)]',
    sectionBgLight: 'bg-[var(--color-support)]',
    sectionBgDark: 'bg-[var(--color-secondary)]',
    sectionBorder: 'border-slate-800/80',
    cardBg: 'bg-[var(--color-secondary)]/90 backdrop-blur-md',
    cardBorder: 'border-[#2563EB]/20',
    cardShadow: 'shadow-[0_4px_30px_rgba(0,0,0,0.35)]',
    inputBg: 'bg-[#1D1F2D]',
    inputBorder: 'border-[#2563EB]/25',
    accentText: 'text-[var(--color-primary)]',
    accentBg: 'bg-[var(--color-primary)]',
    accentGradient: 'from-[var(--color-primary)] via-[var(--color-accent-cyan)] to-[var(--color-primary)]',
    accentGlow: 'bg-[var(--color-primary)]/10',
    particleColor: '#3B82F6',
    nebulaOpacity: 0.35,
  },
};

/**
 * Automatically computes the active time-of-day theme depending on an hour value (0-23).
 */
export const getThemeForHour = (hour: number): TimeThemeId => {
  if (hour >= 6 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'midday';
  if (hour >= 17 && hour < 20) return 'afternoon';
  return 'night';
};
