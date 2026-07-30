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
    description: 'Laboratorio de IA en calma, azules eléctricos suaves y aura difusa.',
    appRootBg: 'bg-transparent',
    textPrimary: 'text-[#F8FAFC]',
    textSecondary: 'text-[#94A3B8]',
    textMuted: 'text-[#64748B]',
    heroBg: 'bg-transparent',
    sectionBgLight: 'bg-transparent',
    sectionBgDark: 'bg-[#0E131F]/30 backdrop-blur-sm',
    sectionBorder: 'border-white/[0.08]',
    cardBg: 'bg-white/[0.035] backdrop-blur-xl',
    cardBorder: 'border-[#3B82F6]/20',
    cardShadow: 'shadow-[0_8px_40px_rgba(0,0,0,0.45)]',
    inputBg: 'bg-white/[0.05]',
    inputBorder: 'border-white/10',
    accentText: 'text-[var(--color-primary)]',
    accentBg: 'bg-[var(--color-primary)]',
    accentGradient: 'from-[#3B82F6] via-[#2563EB] to-[#6366F1]',
    accentGlow: 'bg-[var(--color-primary)]/10',
    particleColor: '#22D3EE',
    nebulaOpacity: 0.3,
  },
  midday: {
    id: 'midday',
    name: 'Mediodía',
    emoji: '☀️',
    range: '12:00 PM - 4:59 PM',
    description: 'Máxima nitidez, contraste alto y azul vibrante con tecnología de punta.',
    appRootBg: 'bg-transparent',
    textPrimary: 'text-[#F8FAFC]',
    textSecondary: 'text-[#94A3B8]',
    textMuted: 'text-[#64748B]',
    heroBg: 'bg-transparent',
    sectionBgLight: 'bg-transparent',
    sectionBgDark: 'bg-[#0E131F]/35 backdrop-blur-sm',
    sectionBorder: 'border-white/[0.08]',
    cardBg: 'bg-white/[0.04] backdrop-blur-xl',
    cardBorder: 'border-[#3B82F6]/22',
    cardShadow: 'shadow-[0_8px_40px_rgba(0,0,0,0.45)]',
    inputBg: 'bg-white/[0.05]',
    inputBorder: 'border-white/10',
    accentText: 'text-[var(--color-primary)]',
    accentBg: 'bg-[var(--color-primary)]',
    accentGradient: 'from-[#3B82F6] via-[#2563EB] to-[#6366F1]',
    accentGlow: 'bg-[var(--color-primary)]/10',
    particleColor: '#22D3EE',
    nebulaOpacity: 0.32,
  },
  afternoon: {
    id: 'afternoon',
    name: 'Tarde',
    emoji: '🌇',
    range: '5:00 PM - 7:59 PM',
    description: 'Aura tecnológica sofisticada, cian y morado profundo.',
    appRootBg: 'bg-transparent',
    textPrimary: 'text-[#F8FAFC]',
    textSecondary: 'text-[#94A3B8]',
    textMuted: 'text-[#64748B]',
    heroBg: 'bg-transparent',
    sectionBgLight: 'bg-transparent',
    sectionBgDark: 'bg-[#0E131F]/40 backdrop-blur-sm',
    sectionBorder: 'border-white/[0.08]',
    cardBg: 'bg-white/[0.04] backdrop-blur-xl',
    cardBorder: 'border-[#6366F1]/25',
    cardShadow: 'shadow-[0_8px_40px_rgba(0,0,0,0.45)]',
    inputBg: 'bg-white/[0.05]',
    inputBorder: 'border-white/10',
    accentText: 'text-[var(--color-primary)]',
    accentBg: 'bg-[var(--color-primary)]',
    accentGradient: 'from-[#6366F1] via-[#3B82F6] to-[#22D3EE]',
    accentGlow: 'bg-[var(--color-primary)]/10',
    particleColor: '#6366F1',
    nebulaOpacity: 0.35,
  },
  night: {
    id: 'night',
    name: 'Noche',
    emoji: '🌌',
    range: '8:00 PM - 5:59 AM',
    description: 'Modo oscuro cibernético, grafito profundo y auroras moradas.',
    appRootBg: 'bg-transparent',
    textPrimary: 'text-[#F8FAFC]',
    textSecondary: 'text-[#94A3B8]',
    textMuted: 'text-[#64748B]',
    heroBg: 'bg-transparent',
    sectionBgLight: 'bg-transparent',
    sectionBgDark: 'bg-[#0E131F]/45 backdrop-blur-sm',
    sectionBorder: 'border-white/[0.09]',
    cardBg: 'bg-white/[0.045] backdrop-blur-xl',
    cardBorder: 'border-[#3B82F6]/25',
    cardShadow: 'shadow-[0_8px_40px_rgba(0,0,0,0.55)]',
    inputBg: 'bg-white/[0.05]',
    inputBorder: 'border-[#3B82F6]/25',
    accentText: 'text-[var(--color-primary)]',
    accentBg: 'bg-[var(--color-primary)]',
    accentGradient: 'from-[#3B82F6] via-[#22D3EE] to-[#6366F1]',
    accentGlow: 'bg-[var(--color-primary)]/10',
    particleColor: '#22D3EE',
    nebulaOpacity: 0.4,
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
