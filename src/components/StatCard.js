import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import Card from './Card';

/**
 * Tarjeta estadística para Dashboard
 * @param {string} title - Título de la estadística
 * @param {string|number} value - Valor principal
 * @param {string} icon - Icono
 * @param {string} trend - up, down, neutral (opcional)
 * @param {string} trendValue - Valor del cambio (opcional)
 */
export default function StatCard({
  title,
  value,
  icon,
  trend,
  trendValue,
  onPress,
}) {
  const { theme } = useTheme();

  const getTrendColor = () => {
    if (trend === 'up') return theme.colors.success;
    if (trend === 'down') return theme.colors.error;
    return theme.colors.textSecondary;
  };

  const getTrendIcon = () => {
    if (trend === 'up') return 'trending-up';
    if (trend === 'down') return 'trending-down';
    return 'minus';
  };

  return (
    <Card variant="elevated" onPress={onPress} style={styles.card}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: theme.colors.primary + '15' }]}>
          <MaterialCommunityIcons
            name={icon}
            size={24}
            color={theme.colors.primary}
          />
        </View>
      </View>

      <Text style={[styles.value, { color: theme.colors.text, ...theme.typography.h2 }]}>
        {value}
      </Text>

      <Text style={[styles.title, { color: theme.colors.textSecondary }]}>
        {title}
      </Text>

      {trendValue && (
        <View style={styles.trendContainer}>
          <MaterialCommunityIcons
            name={getTrendIcon()}
            size={14}
            color={getTrendColor()}
          />
          <Text style={[styles.trendText, { color: getTrendColor() }]}>
            {trendValue}
          </Text>
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    minWidth: 150,
  },
  header: {
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    marginBottom: 4,
  },
  title: {
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
  },
  trendText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
