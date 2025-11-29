import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, Alert, Text } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../hooks/useTheme';
import * as vitalService from '../../api/services/vitalService';
import * as patientService from '../../api/services/patientService';
import {
  VitalRecordCard,
  FAB,
  LoadingSpinner,
  EmptyState,
  Badge,
} from '../../components';

export default function VitalListScreen({ navigation }) {
  const { theme } = useTheme();
  const [vitals, setVitals] = useState([]);
  const [patients, setPatients] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState('all');

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    try {
      setLoading(true);

      // Cargar signos vitales y pacientes en paralelo
      const [vitalsData, patientsData] = await Promise.all([
        vitalService.getVitals(),
        patientService.getPatients(),
      ]);

      setVitals(vitalsData);

      // Crear mapa de pacientes para lookup rápido
      const patientsMap = {};
      patientsData.forEach((p) => {
        patientsMap[p.id] = p;
      });
      setPatients(patientsMap);
    } catch (err) {
      Alert.alert('Error', err.message || 'No se pudieron cargar los signos vitales');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleVitalPress = (vital) => {
    navigation.navigate('VitalForm', { vital });
  };

  const handleAddVital = () => {
    navigation.navigate('VitalForm', { vital: null });
  };

  const getFilteredVitals = () => {
    return vitals
      .map((vital) => ({
        ...vital,
        patient_name: patients[vital.patient_id]?.name || 'Paciente desconocido',
      }))
      .filter((vital) => {
        if (selectedPatientId === 'all') return true;
        return vital.patient_id === selectedPatientId;
      })
      .sort((a, b) => new Date(b.recorded_at) - new Date(a.recorded_at));
  };

  const filteredVitals = getFilteredVitals();

  const renderVital = ({ item }) => (
    <VitalRecordCard vital={item} onPress={() => handleVitalPress(item)} />
  );

  if (loading) {
    return <LoadingSpinner fullscreen message="Cargando signos vitales..." />;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Filters */}
      <View style={styles.filtersContainer}>
        <Text style={[styles.filtersLabel, { color: theme.colors.textSecondary }]}>
          Filtrar por paciente:
        </Text>
        <View style={styles.filters}>
          <Badge
            status={selectedPatientId === 'all' ? 'info' : 'default'}
            onPress={() => setSelectedPatientId('all')}
          >
            Todos
          </Badge>
          {Object.values(patients).map((patient) => (
            <Badge
              key={patient.id}
              status={selectedPatientId === patient.id ? 'info' : 'default'}
              onPress={() => setSelectedPatientId(patient.id)}
            >
              {patient.name}
            </Badge>
          ))}
        </View>
      </View>

      {/* Vitals List */}
      {filteredVitals.length === 0 ? (
        <EmptyState
          icon="heart-pulse"
          title="No hay signos vitales"
          message={
            selectedPatientId === 'all'
              ? 'Agrega el primer registro de signos vitales'
              : 'No hay registros para este paciente'
          }
          actionLabel={selectedPatientId === 'all' ? 'Agregar Registro' : undefined}
          onAction={selectedPatientId === 'all' ? handleAddVital : undefined}
        />
      ) : (
        <FlatList
          data={filteredVitals}
          renderItem={renderVital}
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
      <FAB icon="plus" onPress={handleAddVital} />
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
    flexWrap: 'wrap',
    gap: 8,
  },
  listContent: {
    padding: 16,
    paddingTop: 8,
  },
});
