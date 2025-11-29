import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

/**
 * Botón corporativo con variantes y estados
 * @param {string} variant - primary, secondary, outlined, text
 * @param {string} size - small, medium, large
 * @param {boolean} loading - Muestra spinner
 * @param {boolean} disabled - Deshabilita el botón
 * @param {string} icon - Nombre del icono (MaterialCommunityIcons)
 * @param {string} iconPosition - left, right
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  icon = null,
  iconPosition = 'left',
  onPress,
  style,
  textStyle,
  ...props
}) {
  const { theme } = useTheme();

  const getButtonStyles = () => {
    const baseStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: theme.borderRadius.md,
      ...theme.shadows.sm,
    };

    // Tamaños
    const sizeStyles = {
      small: {
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        minHeight: 36,
      },
      medium: {
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
        minHeight: 44,
      },
      large: {
        paddingHorizontal: theme.spacing.xl,
        paddingVertical: theme.spacing.lg,
        minHeight: 52,
      },
    };

    // Variantes
    const variantStyles = {
      primary: {
        backgroundColor: theme.colors.primary,
      },
      secondary: {
        backgroundColor: theme.colors.secondary,
      },
      outlined: {
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderColor: theme.colors.primary,
        shadowOpacity: 0,
        elevation: 0,
      },
      text: {
        backgroundColor: 'transparent',
        shadowOpacity: 0,
        elevation: 0,
      },
    };

    // Estado disabled
    const disabledStyle = disabled || loading
      ? {
          backgroundColor: theme.colors.border,
          opacity: 0.6,
        }
      : {};

    return [baseStyle, sizeStyles[size], variantStyles[variant], disabledStyle, style];
  };

  const getTextStyles = () => {
    const baseTextStyle = {
      ...theme.typography.button,
      textAlign: 'center',
    };

    const sizeTextStyles = {
      small: { fontSize: 12 },
      medium: { fontSize: 14 },
      large: { fontSize: 16 },
    };

    const variantTextStyles = {
      primary: { color: theme.colors.textOnPrimary },
      secondary: { color: theme.colors.textOnPrimary },
      outlined: { color: theme.colors.primary },
      text: { color: theme.colors.primary },
    };

    const disabledTextStyle = disabled || loading
      ? { color: theme.colors.textLight }
      : {};

    return [baseTextStyle, sizeTextStyles[size], variantTextStyles[variant], disabledTextStyle, textStyle];
  };

  const iconSize = size === 'small' ? 16 : size === 'large' ? 24 : 20;
  const iconColor = variant === 'outlined' || variant === 'text'
    ? theme.colors.primary
    : theme.colors.textOnPrimary;

  return (
    <TouchableOpacity
      style={getButtonStyles()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'outlined' || variant === 'text' ? theme.colors.primary : theme.colors.textOnPrimary}
          size="small"
        />
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <MaterialCommunityIcons
              name={icon}
              size={iconSize}
              color={iconColor}
              style={{ marginRight: theme.spacing.sm }}
            />
          )}
          <Text style={getTextStyles()}>{children}</Text>
          {icon && iconPosition === 'right' && (
            <MaterialCommunityIcons
              name={icon}
              size={iconSize}
              color={iconColor}
              style={{ marginLeft: theme.spacing.sm }}
            />
          )}
        </>
      )}
    </TouchableOpacity>
  );
}
