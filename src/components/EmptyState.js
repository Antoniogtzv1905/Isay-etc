import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import Button from './Button';

/**
 * Estado vacío para listas sin datos
 * @param {string} icon - Nombre del icono
 * @param {string} title - Título
 * @param {string} message - Mensaje descriptivo
 * @param {string} actionLabel - Texto del botón
 * @param {function} onAction - Acción del botón
 */
export default function EmptyState({
  icon = 'inbox-outline',
  title = 'No hay datos',
  message,
  actionLabel,
  onAction,
}) {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <MaterialCommunityIcons
        name={icon}
        size={64}
        color={theme.colors.textLight}
        style={styles.icon}
      />
      <Text style={[styles.title, { color: theme.colors.text, ...theme.typography.h4 }]}>
        {title}
      </Text>
      {message && (
        <Text
          style={[
            styles.message,
            { color: theme.colors.textSecondary, ...theme.typography.body2 },
          ]}
        >
          {message}
        </Text>
      )}
      {actionLabel && onAction && (
        <Button
          variant="outlined"
          onPress={onAction}
          style={styles.button}
        >
          {actionLabel}
        </Button>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  icon: {
    marginBottom: 16,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    marginTop: 8,
  },
});
