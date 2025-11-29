import React, { createContext, useState, useEffect } from 'react';
import { createTheme } from '../theme';
import { getThemePreference, saveThemePreference } from '../utils/storage';

// Crear el contexto
export const ThemeContext = createContext({
  theme: createTheme(false),
  isDark: false,
  toggleTheme: () => {},
});

/**
 * Provider del tema que maneja el estado y persistencia del modo claro/oscuro
 */
export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  // Cargar la preferencia guardada al montar el componente
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedTheme = await getThemePreference();
        if (savedTheme !== null) {
          setIsDark(savedTheme === 'dark');
        }
      } catch (error) {
        console.error('Error cargando preferencia de tema:', error);
      }
    };

    loadThemePreference();
  }, []);

  // Función para cambiar entre modo claro y oscuro
  const toggleTheme = async () => {
    try {
      const newTheme = !isDark;
      setIsDark(newTheme);
      await saveThemePreference(newTheme ? 'dark' : 'light');
    } catch (error) {
      console.error('Error guardando preferencia de tema:', error);
    }
  };

  // Crear el objeto de theme basado en el estado
  const theme = createTheme(isDark);

  const value = {
    theme,
    isDark,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
