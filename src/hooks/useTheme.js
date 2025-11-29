import { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';

/**
 * Hook para acceder al tema actual y funciones relacionadas
 * @returns {Object} - { theme, isDark, toggleTheme }
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme debe ser usado dentro de un ThemeProvider');
  }

  return context;
};

export default useTheme;
