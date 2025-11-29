import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import IconButton from './IconButton';

/**
 * Barra de búsqueda estilizada
 * @param {string} value - Valor del input
 * @param {function} onChangeText - Callback de cambio
 * @param {function} onClear - Callback de limpiar (opcional)
 * @param {string} placeholder - Placeholder
 */
export default function SearchBar({
  value,
  onChangeText,
  onClear,
  placeholder = 'Buscar...',
  style,
  ...props
}) {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background,
          borderColor: theme.colors.border,
          ...theme.shadows.sm,
        },
        style,
      ]}
    >
      <MaterialCommunityIcons
        name="magnify"
        size={20}
        color={theme.colors.textSecondary}
        style={styles.searchIcon}
      />
      <TextInput
        style={[
          styles.input,
          {
            color: theme.colors.text,
            ...theme.typography.body1,
          },
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textLight}
        {...props}
      />
      {value && onClear && (
        <IconButton
          icon="close-circle"
          variant="text"
          size="sm"
          onPress={onClear}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    minHeight: 48,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
  },
});
