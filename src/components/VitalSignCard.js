import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import Card from './Card';

/**
 * Mini-card para mostrar un signo vital
 * @param {string} icon - Icono del signo vital
 * @param {string} label - Etiqueta
 * @param {string} value - Valor
 * @param {string} unit - Unidad de medida
 * @param {string} variant - default, success, warning, error
 */
export default function VitalSignCard({
  icon,
  label,
  value,
  unit,
  variant = 'default',
}) {
  const { theme } = useTheme();

  const getColor = () => {
    const colorMap = {
      success: theme.colors.success,
      warning: theme.colors.warning,
      error: theme.colors.error,
      default: theme.colors.primary,
    };
    return colorMap[variant] || colorMap.default;
  };

  const color = getColor();

  return (
    <Card variant="outlined" style={styles.card}>
      <View style={[styles.iconContainer, { backgroundColor: color + '15' }]}>
        <MaterialCommunityIcons name={icon} size={24} color={color} />
      </View>
      <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
        {label}
      </Text>
      <View style={styles.valueContainer}>
        <Text style={[styles.value, { color: theme.colors.text }]}>
          {value}
        </Text>
        {unit && (
          <Text style={[styles.unit, { color: theme.colors.textSecondary }]}>
            {unit}
          </Text>
        )}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    minWidth: 100,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  value: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  unit: {
    fontSize: 12,
  },
});
