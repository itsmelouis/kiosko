/**
 * Thème de l'application Kiosko
 * Charte graphique bleue
 */

export const Colors = {
  // Couleurs principales
  primary: '#1E88E5',
  primaryDark: '#1565C0',
  primaryLight: '#42A5F5',

  // Couleurs secondaires
  secondary: '#FF6B35',
  secondaryDark: '#E55A2B',

  // Couleurs de fond
  background: '#F5F7FA',
  surface: '#FFFFFF',
  surfaceVariant: '#E3E8EF',

  // Texte
  textPrimary: '#1A1A2E',
  textSecondary: '#64748B',
  textLight: '#FFFFFF',

  // États
  success: '#4CAF50',
  error: '#EF4444',
  warning: '#F59E0B',

  // Bordures
  border: '#E2E8F0',
  borderLight: '#F1F5F9',

  // Overlay
  overlay: 'rgba(0, 0, 0, 0.5)',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const FontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  display: 48,
};

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
};

export default {
  Colors,
  Spacing,
  BorderRadius,
  FontSizes,
  Shadows,
};
