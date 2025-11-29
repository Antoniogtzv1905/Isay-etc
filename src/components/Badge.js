import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../hooks/useTheme';

/**
 * Badge para estados (pendiente, confirmada, cancelada, etc.)
 * @param {string} status - success, warning, error, info, default
 * @param {string} size - sm, md
 * @param {function} onPress - Función a ejecutar al presionar (opcional, hace el badge clickeable)
 */
export default function Badge({ children, status = 'default', size = 'md', onPress }) {
  const { theme } = useTheme();

  const getColors = () => {
    const colorMap = {
      success: { bg: theme.colors.success + '20', text: theme.colors.success },
      warning: { bg: theme.colors.warning + '20', text: theme.colors.warning },
      error: { bg: theme.colors.error + '20', text: theme.colors.error },
      info: { bg: theme.colors.info + '20', text: theme.colors.info },
      default: { bg: theme.colors.border, text: theme.colors.textSecondary },
    };
    return colorMap[status] || colorMap.default;
  };

  const padding = size === 'sm' ? 4 : 6;
  const fontSize = size === 'sm' ? 10 : 12;
  const colors = getColors();

  const content = (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.bg,
          paddingHorizontal: padding * 2,
          paddingVertical: padding,
          borderRadius: theme.borderRadius.sm,
        },
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            color: colors.text,
            fontSize,
          },
        ]}
      >
        {children}
      </Text>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
  },
  text: {
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
