import { lightColors, darkColors } from './colors';
import { typography } from './typography';
import { spacing, borderRadius, shadows } from './spacing';

/**
 * Crea un objeto de theme completo basado en el modo (claro/oscuro)
 * @param {boolean} isDark - Si el tema es oscuro
 * @returns {Object} - Objeto de theme completo
 */
export const createTheme = (isDark = false) => ({
  colors: isDark ? darkColors : lightColors,
  typography,
  spacing,
  borderRadius,
  shadows,
  isDark,
});

// Exportaciones individuales para casos de uso específicos
export { lightColors, darkColors } from './colors';
export { typography } from './typography';
export { spacing, borderRadius, shadows } from './spacing';
