import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';

/**
 * Botón circular solo con icono
 * @param {string} icon - Nombre del icono
 * @param {string} variant - primary, secondary, text
 * @param {string} size - sm, md, lg
 */
export default function IconButton({
  icon,
  variant = 'text',
  size = 'md',
  onPress,
  disabled = false,
  style,
  ...props
}) {
  const { theme } = useTheme();

  const sizes = {
    sm: { button: 32, icon: 16 },
    md: { button: 44, icon: 24 },
    lg: { button: 56, icon: 32 },
  };

  const getButtonStyles = () => {
    const baseStyle = {
      width: sizes[size].button,
      height: sizes[size].button,
      borderRadius: sizes[size].button / 2,
      alignItems: 'center',
      justifyContent: 'center',
    };

    const variantStyles = {
      primary: {
        backgroundColor: theme.colors.primary,
      },
      secondary: {
        backgroundColor: theme.colors.secondary,
      },
      text: {
        backgroundColor: 'transparent',
      },
    };

    return [baseStyle, variantStyles[variant], style];
  };

  const getIconColor = () => {
    if (disabled) return theme.colors.textLight;
    if (variant === 'text') return theme.colors.primary;
    return theme.colors.textOnPrimary;
  };

  return (
    <TouchableOpacity
      style={getButtonStyles()}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      {...props}
    >
      <MaterialCommunityIcons
        name={icon}
        size={sizes[size].icon}
        color={getIconColor()}
      />
    </TouchableOpacity>
  );
}
