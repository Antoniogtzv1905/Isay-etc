import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';

/**
 * Avatar circular con iniciales o imagen
 * @param {string} name - Nombre para generar iniciales
 * @param {string} uri - URL de la imagen
 * @param {string} size - sm, md, lg, xl
 */
export default function Avatar({ name, uri, size = 'md' }) {
  const { theme } = useTheme();

  const sizes = {
    sm: 32,
    md: 48,
    lg: 64,
    xl: 96,
  };

  const fontSizes = {
    sm: 12,
    md: 16,
    lg: 24,
    xl: 36,
  };

  const getInitials = (fullName) => {
    if (!fullName) return '?';
    const parts = fullName.trim().split(' ');
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const avatarSize = sizes[size];
  const fontSize = fontSizes[size];

  return (
    <View
      style={[
        styles.container,
        {
          width: avatarSize,
          height: avatarSize,
          borderRadius: avatarSize / 2,
          backgroundColor: theme.colors.primary,
        },
      ]}
    >
      {uri ? (
        <Image
          source={{ uri }}
          style={{ width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2 }}
        />
      ) : (
        <Text style={[styles.initials, { fontSize, color: theme.colors.textOnPrimary }]}>
          {getInitials(name)}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  initials: {
    fontWeight: '600',
  },
});
