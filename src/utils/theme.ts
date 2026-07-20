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

/**
 * Las 4 franjas horarias comparten una misma identidad visual continua:
 * laboratorio tecnológico espacial, fondo oscuro profundo (ver
 * CosmicBackdrop.tsx), paneles de vidrio (glassmorphism) y texto claro.
 * Solo varía sutilmente la intensidad de la nebulosa/partículas entre
 * franjas, para dar variación sin romper la continuidad del universo.
 */
export const themes: Record<TimeThemeId, TimeThemeConfig> = {
  morning: {
    id: 'morning',
    name: 'Mañana',
    emoji: '🌅',
    range: '6:00 AM - 11:59 AM',
    description: 'Laboratorio espacial en calma, azules eléctricos suaves y luz difusa.',
    appRootBg: 'bg-[var(--color-support)]',
    textPrimary: 'text-[#F5F6FA]',
    textSecondary: 'text-[#94A3B8]',
    textMuted: 'text-[#64748B]',
    heroBg: 'bg-[radial-gradient(ellipse_90%_70%_at_50%_-10%,rgba(37,99,235,0.16)_0%,transparent_60%)]',
    sectionBgLight: 'bg-transparent',
    sectionBgDark: 'bg-[var(--color-secondary)]/25',
    sectionBorder: 'border-white/[0.06]',
    cardBg: 'bg-white/[0.04] backdrop-blur-xl',
    cardBorder: 'border-[var(--color-primary)]/15',
    cardShadow: 'shadow-[0_8px_40px_rgba(0,0,0,0.35)]',
    inputBg: 'bg-white/[0.05]',
    inputBorder: 'border-white/10',
    accentText: 'text-[var(--color-primary)]',
    accentBg: 'bg-[var(--color-primary)]',
    accentGradient: 'from-[var(--color-primary)] via-[var(--color-primary-hover)] to-[var(--color-primary)]',
    accentGlow: 'bg-[var(--color-primary)]/10',
    particleColor: '#3B82F6',
    nebulaOpacity: 0.22,
  },
  midday: {
    id: 'midday',
    name: 'Mediodía',
    emoji: '☀️',
    range: '12:00 PM - 4:59 PM',
    description: 'Máxima nitidez del laboratorio, contraste alto y azul vibrante.',
    appRootBg: 'bg-[var(--color-support)]',
    textPrimary: 'text-[#F5F6FA]',
    textSecondary: 'text-[#94A3B8]',
    textMuted: 'text-[#64748B]',
    heroBg: 'bg-[radial-gradient(ellipse_90%_70%_at_50%_-10%,rgba(37,99,235,0.20)_0%,transparent_60%)]',
    sectionBgLight: 'bg-transparent',
    sectionBgDark: 'bg-[var(--color-secondary)]/25',
    sectionBorder: 'border-white/[0.06]',
    cardBg: 'bg-white/[0.045] backdrop-blur-xl',
    cardBorder: 'border-[var(--color-primary)]/18',
    cardShadow: 'shadow-[0_8px_40px_rgba(0,0,0,0.35)]',
    inputBg: 'bg-white/[0.05]',
    inputBorder: 'border-white/10',
    accentText: 'text-[var(--color-primary)]',
    accentBg: 'bg-[var(--color-primary)]',
    accentGradient: 'from-[var(--color-primary)] via-[var(--color-primary-hover)] to-[var(--color-primary)]',
    accentGlow: 'bg-[var(--color-primary)]/10',
    particleColor: '#3B82F6',
    nebulaOpacity: 0.26,
  },
  afternoon: {
    id: 'afternoon',
    name: 'Tarde',
    emoji: '🌇',
    range: '5:00 PM - 7:59 PM',
    description: 'Aura tecnológica sofisticada, azul petróleo y polvo cósmico cálido.',
    appRootBg: 'bg-[var(--color-support)]',
    textPrimary: 'text-[#F5F6FA]',
    textSecondary: 'text-[#94A3B8]',
    textMuted: 'text-[#64748B]',
    heroBg: 'bg-[radial-gradient(ellipse_90%_70%_at_50%_-10%,rgba(15,59,76,0.35)_0%,transparent_60%)]',
    sectionBgLight: 'bg-transparent',
    sectionBgDark: 'bg-[var(--color-secondary)]/30',
    sectionBorder: 'border-white/[0.06]',
    cardBg: 'bg-white/[0.045] backdrop-blur-xl',
    cardBorder: 'border-[var(--color-primary)]/18',
    cardShadow: 'shadow-[0_8px_40px_rgba(0,0,0,0.35)]',
    inputBg: 'bg-white/[0.05]',
    inputBorder: 'border-white/10',
    accentText: 'text-[var(--color-primary)]',
    accentBg: 'bg-[var(--color-primary)]',
    accentGradient: 'from-[var(--color-primary)] via-[var(--color-primary-hover)] to-[var(--color-primary)]',
    accentGlow: 'bg-[var(--color-primary)]/10',
    particleColor: '#3B82F6',
    nebulaOpacity: 0.3,
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
    sectionBgLight: 'bg-transparent',
    sectionBgDark: 'bg-[var(--color-secondary)]/35',
    sectionBorder: 'border-white/[0.07]',
    cardBg: 'bg-white/[0.05] backdrop-blur-xl',
    cardBorder: 'border-[#2563EB]/20',
    cardShadow: 'shadow-[0_8px_40px_rgba(0,0,0,0.45)]',
    inputBg: 'bg-white/[0.05]',
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
