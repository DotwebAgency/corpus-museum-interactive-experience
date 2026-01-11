/**
 * DIGITALE SCHWEIZ — Swiss Federal Color System
 * Schweizerische Eidgenossenschaft
 * 
 * Official Bundesfarben + Digital Extensions
 */

export const SWISS_COLORS = {
  // Primary Federal Colors
  red: '#DC0018',
  redDark: '#B50014',
  redLight: '#E6334A',
  
  // Secondary Federal Colors
  blue: '#2F5496',
  blueDark: '#1E3A6E',
  blueLight: '#4A70B0',
  
  // Neutrals
  white: '#FFFFFF',
  gray50: '#FAFAFA',
  gray100: '#F5F5F5',
  gray200: '#EEEEEE',
  gray300: '#E0E0E0',
  gray400: '#BDBDBD',
  gray500: '#9E9E9E',
  gray600: '#757575',
  gray700: '#616161',
  gray800: '#424242',
  gray900: '#212121',
  black: '#000000',
  
  // Swiss Alpine Accents
  glacier: '#E3F2FD',
  glacierDeep: '#90CAF9',
  alpine: '#4CAF50',
  gold: '#FFC107'
};

/**
 * Particle Theme Definitions
 * Each theme uses the Swiss Federal palette as foundation
 */
export const PARTICLE_THEMES = {
  // Default: Swiss Red
  swiss: {
    name: 'Eidgenössisch',
    primary: SWISS_COLORS.red,
    secondary: SWISS_COLORS.redLight,
    accent: SWISS_COLORS.blue,
    background: SWISS_COLORS.white,
    particles: [
      SWISS_COLORS.red,
      SWISS_COLORS.redDark,
      SWISS_COLORS.redLight,
      SWISS_COLORS.gray600,
      SWISS_COLORS.gray800
    ],
    meshLines: 'rgba(220, 0, 24, 0.15)',
    meshNodes: 'rgba(220, 0, 24, 0.4)'
  },
  
  // Glacier: Cool tones
  gletscher: {
    name: 'Gletscher',
    primary: SWISS_COLORS.blue,
    secondary: SWISS_COLORS.glacierDeep,
    accent: SWISS_COLORS.glacier,
    background: SWISS_COLORS.white,
    particles: [
      SWISS_COLORS.blue,
      SWISS_COLORS.blueLight,
      SWISS_COLORS.glacierDeep,
      SWISS_COLORS.glacier,
      '#64B5F6'
    ],
    meshLines: 'rgba(47, 84, 150, 0.15)',
    meshNodes: 'rgba(47, 84, 150, 0.4)'
  },
  
  // Alpine: Natural greens
  alpin: {
    name: 'Alpin',
    primary: SWISS_COLORS.alpine,
    secondary: '#66BB6A',
    accent: SWISS_COLORS.gold,
    background: SWISS_COLORS.white,
    particles: [
      SWISS_COLORS.alpine,
      '#66BB6A',
      '#81C784',
      '#A5D6A7',
      SWISS_COLORS.gray600
    ],
    meshLines: 'rgba(76, 175, 80, 0.15)',
    meshNodes: 'rgba(76, 175, 80, 0.4)'
  },
  
  // Nacht: Dark mode alternative
  nacht: {
    name: 'Nacht',
    primary: SWISS_COLORS.gray200,
    secondary: SWISS_COLORS.gray400,
    accent: SWISS_COLORS.red,
    background: SWISS_COLORS.gray900,
    particles: [
      SWISS_COLORS.gray200,
      SWISS_COLORS.gray300,
      SWISS_COLORS.gray400,
      SWISS_COLORS.red,
      SWISS_COLORS.redLight
    ],
    meshLines: 'rgba(255, 255, 255, 0.08)',
    meshNodes: 'rgba(255, 255, 255, 0.25)'
  },
  
  // Digital: Tech-forward
  digital: {
    name: 'Digital',
    primary: '#00BCD4',
    secondary: '#26C6DA',
    accent: SWISS_COLORS.red,
    background: SWISS_COLORS.white,
    particles: [
      '#00BCD4',
      '#26C6DA',
      '#4DD0E1',
      '#80DEEA',
      SWISS_COLORS.gray600
    ],
    meshLines: 'rgba(0, 188, 212, 0.15)',
    meshNodes: 'rgba(0, 188, 212, 0.4)'
  }
};

/**
 * Get theme by name
 */
export function getTheme(themeName) {
  return PARTICLE_THEMES[themeName] || PARTICLE_THEMES.swiss;
}

/**
 * Get all theme names
 */
export function getThemeNames() {
  return Object.keys(PARTICLE_THEMES);
}

/**
 * Cycle to next theme
 */
export function getNextTheme(currentTheme) {
  const names = getThemeNames();
  const currentIndex = names.indexOf(currentTheme);
  const nextIndex = (currentIndex + 1) % names.length;
  return names[nextIndex];
}

/**
 * Parse hex color to RGB object
 */
export function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 200, g: 200, b: 200 };
}

/**
 * Create RGBA string from hex + alpha
 */
export function hexToRgba(hex, alpha = 1) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Interpolate between two colors
 */
export function lerpColor(color1, color2, t) {
  const c1 = hexToRgb(color1);
  const c2 = hexToRgb(color2);
  
  const r = Math.round(c1.r + (c2.r - c1.r) * t);
  const g = Math.round(c1.g + (c2.g - c1.g) * t);
  const b = Math.round(c1.b + (c2.b - c1.b) * t);
  
  return `rgb(${r}, ${g}, ${b})`;
}
