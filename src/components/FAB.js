import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';

/**
 * Floating Action Button
 * @param {string} icon - Nombre del icono
 * @param {function} onPress - Función al presionar
 * @param {string} position - bottom-right, bottom-left, bottom-center
 */
export default function FAB({
  icon = 'plus',
  onPress,
  position = 'bottom-right',
  style,
  ...props
}) {
  const { theme } = useTheme();

  const getPositionStyles = () => {
    const positions = {
      'bottom-right': {
        position: 'absolute',
        bottom: theme.spacing.lg,
        right: theme.spacing.lg,
      },
      'bottom-left': {
        position: 'absolute',
        bottom: theme.spacing.lg,
        left: theme.spacing.lg,
      },
      'bottom-center': {
        position: 'absolute',
        bottom: theme.spacing.lg,
        alignSelf: 'center',
      },
    };
    return positions[position] || positions['bottom-right'];
  };

  return (
    <TouchableOpacity
      style={[
        styles.fab,
        {
          backgroundColor: theme.colors.primary,
          ...theme.shadows.lg,
        },
        getPositionStyles(),
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
      {...props}
    >
      <MaterialCommunityIcons
        name={icon}
        size={28}
        color={theme.colors.textOnPrimary}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
  },
});
