import React, { useState } from 'react';
import { View, TextInput as RNTextInput, Text, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

/**
 * TextInput corporativo con label y estados
 * @param {string} label - Etiqueta del campo
 * @param {string} error - Mensaje de error
 * @param {string} leftIcon - Icono izquierdo
 * @param {string} rightIcon - Icono derecho
 * @param {boolean} disabled - Campo deshabilitado
 */
export default function CustomTextInput({
  label,
  error,
  leftIcon,
  rightIcon,
  disabled = false,
  style,
  containerStyle,
  onFocus,
  onBlur,
  ...props
}) {
  const { theme } = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = (e) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const getBorderColor = () => {
    if (error) return theme.colors.error;
    if (isFocused) return theme.colors.primary;
    return theme.colors.border;
  };

  return (
    <View style={[containerStyle]}>
      {label && (
        <Text style={[styles.label, { color: error ? theme.colors.error : theme.colors.textSecondary }]}>
          {label}
        </Text>
      )}
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: disabled ? theme.colors.background : theme.colors.surface,
            borderColor: getBorderColor(),
            borderWidth: isFocused ? 2 : 1,
            ...theme.shadows.sm,
          },
        ]}
      >
        {leftIcon && (
          <MaterialCommunityIcons
            name={leftIcon}
            size={20}
            color={error ? theme.colors.error : theme.colors.textSecondary}
            style={{ marginRight: theme.spacing.sm }}
          />
        )}
        <RNTextInput
          style={[
            styles.input,
            {
              color: theme.colors.text,
              ...theme.typography.input,
            },
            style,
          ]}
          placeholderTextColor={theme.colors.textLight}
          onFocus={handleFocus}
          onBlur={handleBlur}
          editable={!disabled}
          {...props}
        />
        {rightIcon && (
          <MaterialCommunityIcons
            name={rightIcon}
            size={20}
            color={error ? theme.colors.error : theme.colors.textSecondary}
            style={{ marginLeft: theme.spacing.sm }}
          />
        )}
      </View>
      {error && (
        <Text style={[styles.errorText, { color: theme.colors.error }]}>
          {error}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 16,
    minHeight: 48,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});
