import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import Card from './Card';
import Badge from './Badge';

/**
 * Tarjeta de cita
 * @param {object} appointment - { datetime, patient_name, type, status }
 * @param {function} onPress - Función al presionar
 */
export default function AppointmentCard({ appointment, onPress }) {
  const { theme } = useTheme();

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { label: 'Pendiente', status: 'warning' },
      confirmed: { label: 'Confirmada', status: 'success' },
      cancelled: { label: 'Cancelada', status: 'error' },
      completed: { label: 'Completada', status: 'info' },
    };
    return statusMap[status] || { label: status, status: 'default' };
  };

  const formatDateTime = (datetime) => {
    const date = new Date(datetime);
    const dateStr = date.toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
    const timeStr = date.toLocaleTimeString('es-MX', {
      hour: '2-digit',
      minute: '2-digit'
    });
    return { date: dateStr, time: timeStr };
  };

  const { date, time } = formatDateTime(appointment.datetime);
  const badgeInfo = getStatusBadge(appointment.status);

  return (
    <Card onPress={onPress} style={styles.card}>
      <View style={styles.header}>
        <Badge status={badgeInfo.status} size="sm">
          {badgeInfo.label}
        </Badge>
      </View>

      <View style={styles.content}>
        <View style={styles.row}>
          <MaterialCommunityIcons
            name="calendar"
            size={16}
            color={theme.colors.primary}
          />
          <Text style={[styles.infoText, { color: theme.colors.text }]}>
            {date}
          </Text>
        </View>

        <View style={styles.row}>
          <MaterialCommunityIcons
            name="clock-outline"
            size={16}
            color={theme.colors.primary}
          />
          <Text style={[styles.infoText, { color: theme.colors.text }]}>
            {time}
          </Text>
        </View>

        {appointment.patient_name && (
          <View style={styles.row}>
            <MaterialCommunityIcons
              name="account"
              size={16}
              color={theme.colors.primary}
            />
            <Text style={[styles.infoText, { color: theme.colors.text }]}>
              {appointment.patient_name}
            </Text>
          </View>
        )}

        {appointment.type && (
          <Text style={[styles.type, { color: theme.colors.textSecondary }]}>
            {appointment.type}
          </Text>
        )}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
  },
  header: {
    marginBottom: 12,
  },
  content: {
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 14,
  },
  type: {
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 4,
  },
});
