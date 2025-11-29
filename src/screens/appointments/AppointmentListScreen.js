import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, Alert, Text } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../hooks/useTheme';
import * as appointmentService from '../../api/services/appointmentService';
import * as patientService from '../../api/services/patientService';
import {
  AppointmentCard,
  FAB,
  LoadingSpinner,
  EmptyState,
  Badge,
} from '../../components';

export default function AppointmentListScreen({ navigation }) {
  const { theme } = useTheme();
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all'); // all, today, week

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    try {
      setLoading(true);

      // Cargar citas y pacientes en paralelo
      const [appointmentsData, patientsData] = await Promise.all([
        appointmentService.getAppointments(),
        patientService.getPatients(),
      ]);

      setAppointments(appointmentsData);

      // Crear mapa de pacientes para lookup rápido
      const patientsMap = {};
      patientsData.forEach((p) => {
        patientsMap[p.id] = p;
      });
      setPatients(patientsMap);
    } catch (err) {
      Alert.alert('Error', err.message || 'No se pudieron cargar las citas');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleAppointmentPress = (appointment) => {
    navigation.navigate('AppointmentForm', { appointment });
  };

  const handleAddAppointment = () => {
    navigation.navigate('AppointmentForm', { appointment: null });
  };

  const getFilteredAppointments = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekFromNow = new Date(today);
    weekFromNow.setDate(weekFromNow.getDate() + 7);

    return appointments
      .map((apt) => ({
        ...apt,
        patient_name: patients[apt.patient_id]?.name || 'Paciente desconocido',
      }))
      .filter((apt) => {
        const aptDate = new Date(apt.datetime);

        if (filter === 'today') {
          const aptDay = new Date(aptDate.getFullYear(), aptDate.getMonth(), aptDate.getDate());
          return aptDay.getTime() === today.getTime();
        }

        if (filter === 'week') {
          return aptDate >= today && aptDate <= weekFromNow;
        }

        return true; // all
      })
      .sort((a, b) => new Date(a.datetime) - new Date(b.datetime));
  };

  const filteredAppointments = getFilteredAppointments();

  const renderAppointment = ({ item }) => (
    <AppointmentCard appointment={item} onPress={() => handleAppointmentPress(item)} />
  );

  if (loading) {
    return <LoadingSpinner fullscreen message="Cargando citas..." />;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Filters */}
      <View style={styles.filtersContainer}>
        <Text style={[styles.filtersLabel, { color: theme.colors.textSecondary }]}>
          Filtrar:
        </Text>
        <View style={styles.filters}>
          <Badge
            status={filter === 'all' ? 'info' : 'default'}
            onPress={() => setFilter('all')}
          >
            Todas
          </Badge>
          <Badge
            status={filter === 'today' ? 'info' : 'default'}
            onPress={() => setFilter('today')}
          >
            Hoy
          </Badge>
          <Badge
            status={filter === 'week' ? 'info' : 'default'}
            onPress={() => setFilter('week')}
          >
            Esta Semana
          </Badge>
        </View>
      </View>

      {/* Appointment List */}
      {filteredAppointments.length === 0 ? (
        <EmptyState
          icon="calendar-blank-outline"
          title="No hay citas"
          message={
            filter === 'all'
              ? 'Agrega la primera cita'
              : filter === 'today'
              ? 'No hay citas para hoy'
              : 'No hay citas esta semana'
          }
          actionLabel={filter === 'all' ? 'Agregar Cita' : undefined}
          onAction={filter === 'all' ? handleAddAppointment : undefined}
        />
      ) : (
        <FlatList
          data={filteredAppointments}
          renderItem={renderAppointment}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[theme.colors.primary]}
              tintColor={theme.colors.primary}
            />
          }
        />
      )}

      {/* FAB */}
      <FAB icon="plus" onPress={handleAddAppointment} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filtersContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  filtersLabel: {
    fontSize: 12,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  filters: {
    flexDirection: 'row',
    gap: 8,
  },
  listContent: {
    padding: 16,
    paddingTop: 8,
  },
});
