import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../hooks/useTheme';
import * as patientService from '../../api/services/patientService';
import {
  PatientCard,
  FAB,
  SearchBar,
  LoadingSpinner,
  EmptyState,
} from '../../components';

export default function PatientListScreen({ navigation }) {
  const { theme } = useTheme();
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useFocusEffect(
    React.useCallback(() => {
      loadPatients();
    }, [])
  );

  useEffect(() => {
    // Filtrar pacientes cuando cambia el search
    if (searchQuery.trim()) {
      const filtered = patients.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPatients(filtered);
    } else {
      setFilteredPatients(patients);
    }
  }, [searchQuery, patients]);

  const loadPatients = async () => {
    try {
      setLoading(true);
      const data = await patientService.getPatients();
      setPatients(data);
      setFilteredPatients(data);
    } catch (err) {
      Alert.alert('Error', err.message || 'No se pudieron cargar los pacientes');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadPatients();
    setRefreshing(false);
  };

  const handlePatientPress = (patient) => {
    navigation.navigate('PatientForm', { patient });
  };

  const handleAddPatient = () => {
    navigation.navigate('PatientForm', { patient: null });
  };

  const renderPatient = ({ item }) => (
    <PatientCard patient={item} onPress={() => handlePatientPress(item)} />
  );

  if (loading) {
    return <LoadingSpinner fullscreen message="Cargando pacientes..." />;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onClear={() => setSearchQuery('')}
          placeholder="Buscar paciente..."
        />
      </View>

      {/* Patient List */}
      {filteredPatients.length === 0 ? (
        <EmptyState
          icon="account-group-outline"
          title="No hay pacientes"
          message={searchQuery ? 'No se encontraron resultados' : 'Agrega tu primer paciente'}
          actionLabel={!searchQuery ? 'Agregar Paciente' : undefined}
          onAction={!searchQuery ? handleAddPatient : undefined}
        />
      ) : (
        <FlatList
          data={filteredPatients}
          renderItem={renderPatient}
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
      <FAB icon="plus" onPress={handleAddPatient} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  listContent: {
    padding: 16,
    paddingTop: 8,
  },
});
