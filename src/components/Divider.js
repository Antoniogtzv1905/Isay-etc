import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../hooks/useTheme';

/**
 * Divisor horizontal o vertical
 * @param {string} orientation - horizontal, vertical
 * @param {number} spacing - Margen vertical/horizontal
 */
export default function Divider({ orientation = 'horizontal', spacing = 0 }) {
  const { theme } = useTheme();

  if (orientation === 'vertical') {
    return (
      <View
        style={{
          width: 1,
          height: '100%',
          backgroundColor: theme.colors.divider,
          marginHorizontal: spacing,
        }}
      />
    );
  }

  return (
    <View
      style={{
        height: 1,
        width: '100%',
        backgroundColor: theme.colors.divider,
        marginVertical: spacing,
      }}
    />
  );
}
