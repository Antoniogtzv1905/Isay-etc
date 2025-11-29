import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';

/**
 * Indicador de carga centrado
 * @param {boolean} fullscreen - Ocupa toda la pantalla
 * @param {string} message - Mensaje opcional
 */
export default function LoadingSpinner({ fullscreen = false, message, size = 'large' }) {
  const { theme } = useTheme();

  const Container = fullscreen ? View : React.Fragment;
  const containerProps = fullscreen
    ? {
        style: [
          styles.fullscreen,
          { backgroundColor: theme.colors.background },
        ],
      }
    : {};

  return (
    <Container {...containerProps}>
      <View style={styles.content}>
        <ActivityIndicator size={size} color={theme.colors.primary} />
        {message && (
          <Text
            style={[
              styles.message,
              {
                color: theme.colors.textSecondary,
                ...theme.typography.body2,
              },
            ]}
          >
            {message}
          </Text>
        )}
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  fullscreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    marginTop: 12,
  },
});
