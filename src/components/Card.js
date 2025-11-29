import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../hooks/useTheme';

/**
 * Card corporativa con sombras sutiles
 * @param {string} variant - default, outlined, elevated
 * @param {function} onPress - Si se pasa, la card es clickeable
 */
export default function Card({
  children,
  variant = 'default',
  onPress,
  style,
  ...props
}) {
  const { theme } = useTheme();

  const getCardStyles = () => {
    const baseStyle = {
      backgroundColor: theme.colors.card,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
    };

    const variantStyles = {
      default: {
        ...theme.shadows.md,
      },
      outlined: {
        borderWidth: 1,
        borderColor: theme.colors.border,
        shadowOpacity: 0,
        elevation: 0,
      },
      elevated: {
        ...theme.shadows.lg,
      },
    };

    return [baseStyle, variantStyles[variant], style];
  };

  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container
      style={getCardStyles()}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      {...props}
    >
      {children}
    </Container>
  );
}
