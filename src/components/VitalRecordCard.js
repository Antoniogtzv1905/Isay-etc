import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';

export default function VitalRecordCard({ vital, onPress }) {
  const { theme } = useTheme();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
          ...theme.shadows.sm,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <MaterialCommunityIcons
            name="clipboard-pulse"
            size={20}
            color={theme.colors.primary}
          />
          <Text
            style={[
              styles.patientName,
              { color: theme.colors.text, ...theme.typography.h5 },
            ]}
            numberOfLines={1}
          >
            {vital.patient_name}
          </Text>
        </View>
        <Text style={[styles.date, { color: theme.colors.textSecondary }]}>
          {formatDate(vital.recorded_at)}
        </Text>
      </View>

      <View style={styles.vitalsGrid}>
        {(vital.systolic || vital.diastolic) && (
          <View style={styles.vitalItem}>
            <MaterialCommunityIcons
              name="heart-pulse"
              size={16}
              color={theme.colors.primary}
            />
            <Text style={[styles.vitalLabel, { color: theme.colors.textSecondary }]}>
              Presión {vital.systolic || '?'}/{vital.diastolic || '?'} mmHg
            </Text>
          </View>
        )}

        {vital.heart_rate && (
          <View style={styles.vitalItem}>
            <MaterialCommunityIcons
              name="heart"
              size={16}
              color={theme.colors.error}
            />
            <Text style={[styles.vitalLabel, { color: theme.colors.textSecondary }]}>
              Frec. {vital.heart_rate} bpm
            </Text>
          </View>
        )}

        {vital.weight && (
          <View style={styles.vitalItem}>
            <MaterialCommunityIcons
              name="weight-kilogram"
              size={16}
              color={theme.colors.info}
            />
            <Text style={[styles.vitalLabel, { color: theme.colors.textSecondary }]}>
              Peso {vital.weight} kg
            </Text>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <MaterialCommunityIcons
          name="chevron-right"
          size={20}
          color={theme.colors.textLight}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  patientName: {
    fontWeight: '600',
    flex: 1,
  },
  date: {
    fontSize: 11,
  },
  vitalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  vitalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  vitalLabel: {
    fontSize: 12,
  },
  vitalValue: {
    fontSize: 12,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'flex-end',
    marginTop: 8,
  },
});
