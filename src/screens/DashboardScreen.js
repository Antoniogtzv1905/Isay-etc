import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../hooks/useTheme';
import * as patientService from '../api/services/patientService';
import * as appointmentService from '../api/services/appointmentService';
import * as noteService from '../api/services/noteService';
import * as vitalService from '../api/services/vitalService';
import {
  StatCard,
  Card,
  Avatar,
  Divider,
  LoadingSpinner,
  AppointmentCard,
  EmptyState,
} from '../components';

export default function DashboardScreen({ navigation }) {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalPatients: 0,
    appointmentsToday: 0,
    appointmentsWeek: 0,
    totalNotes: 0,
    totalVitals: 0,
  });
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      loadDashboardData();
    }, [])
  );

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Cargar todos los datos en paralelo
      const [patients, appointments, notes, vitals] = await Promise.all([
        patientService.getPatients(),
        appointmentService.getAppointments(),
        noteService.getNotes(),
        vitalService.getVitals(),
      ]);

      // Calcular estadísticas
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekFromNow = new Date(today);
      weekFromNow.setDate(weekFromNow.getDate() + 7);

      const appointmentsToday = appointments.filter((apt) => {
        const aptDate = new Date(apt.datetime);
        const aptDay = new Date(aptDate.getFullYear(), aptDate.getMonth(), aptDate.getDate());
        return aptDay.getTime() === today.getTime();
      }).length;

      const appointmentsWeek = appointments.filter((apt) => {
        const aptDate = new Date(apt.datetime);
        return aptDate >= today && aptDate <= weekFromNow;
      }).length;

      // Obtener próximas 3 citas
      const upcoming = appointments
        .filter((apt) => new Date(apt.datetime) >= now)
        .sort((a, b) => new Date(a.datetime) - new Date(b.datetime))
        .slice(0, 3)
        .map((apt) => ({
          ...apt,
          patient_name: patients.find((p) => p.id === apt.patient_id)?.name || 'Paciente desconocido',
        }));

      setStats({
        totalPatients: patients.length,
        appointmentsToday,
        appointmentsWeek,
        totalNotes: notes.length,
        totalVitals: vitals.length,
      });
      setUpcomingAppointments(upcoming);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  if (loading) {
    return <LoadingSpinner fullscreen message="Cargando dashboard..." />;
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          colors={[theme.colors.primary]}
          tintColor={theme.colors.primary}
        />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.greeting, { color: theme.colors.textSecondary }]}>
            Bienvenido
          </Text>
          <Text style={[styles.title, { color: theme.colors.text, ...theme.typography.h2 }]}>
            Dr. MedAPP
          </Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')} activeOpacity={0.7}>
          <Avatar name="Dr. MedAPP" size="lg" />
        </TouchableOpacity>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <StatCard
          title="Total Pacientes"
          value={stats.totalPatients.toString()}
          icon="account-group"
        />
        <StatCard
          title="Citas Hoy"
          value={stats.appointmentsToday.toString()}
          icon="calendar-today"
        />
      </View>

      <View style={styles.statsContainer}>
        <StatCard
          title="Citas Semana"
          value={stats.appointmentsWeek.toString()}
          icon="calendar-week"
        />
        <StatCard
          title="Notas Médicas"
          value={stats.totalNotes.toString()}
          icon="note-text"
        />
      </View>

      <Divider spacing={theme.spacing.lg} />

      {/* Próximas Citas */}
      <Card variant="elevated">
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text, ...theme.typography.h3 }]}>
            Próximas Citas
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Appointments')}>
            <Text style={[styles.seeAll, { color: theme.colors.primary }]}>Ver todas</Text>
          </TouchableOpacity>
        </View>

        {upcomingAppointments.length === 0 ? (
          <EmptyState
            icon="calendar-blank-outline"
            title="No hay citas próximas"
            message="Agrega una nueva cita"
            compact
          />
        ) : (
          upcomingAppointments.map((apt, index) => (
            <View key={apt.id}>
              <AppointmentCard
                appointment={apt}
                onPress={() => navigation.navigate('Appointments', {
                  screen: 'AppointmentForm',
                  params: { appointment: apt },
                })}
              />
              {index < upcomingAppointments.length - 1 && (
                <Divider spacing={theme.spacing.sm} />
              )}
            </View>
          ))
        )}
      </Card>

      <View style={{ height: theme.spacing.xl }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 14,
    marginBottom: 4,
  },
  title: {
    marginBottom: 0,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 0,
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '600',
  },
});
