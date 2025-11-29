import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, Alert, Text } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../hooks/useTheme';
import * as noteService from '../../api/services/noteService';
import * as patientService from '../../api/services/patientService';
import {
  NoteCard,
  FAB,
  LoadingSpinner,
  EmptyState,
  Badge,
} from '../../components';

export default function NoteListScreen({ navigation }) {
  const { theme } = useTheme();
  const [notes, setNotes] = useState([]);
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

      // Cargar notas y pacientes en paralelo
      const [notesData, patientsData] = await Promise.all([
        noteService.getNotes(),
        patientService.getPatients(),
      ]);

      setNotes(notesData);

      // Crear mapa de pacientes para lookup rápido
      const patientsMap = {};
      patientsData.forEach((p) => {
        patientsMap[p.id] = p;
      });
      setPatients(patientsMap);
    } catch (err) {
      Alert.alert('Error', err.message || 'No se pudieron cargar las notas');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleNotePress = (note) => {
    navigation.navigate('NoteForm', { note });
  };

  const handleAddNote = () => {
    navigation.navigate('NoteForm', { note: null });
  };

  const getFilteredNotes = () => {
    return notes
      .map((note) => ({
        ...note,
        patient_name: patients[note.patient_id]?.name || 'Paciente desconocido',
      }))
      .filter((note) => {
        if (selectedPatientId === 'all') return true;
        return note.patient_id === selectedPatientId;
      })
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  };

  const filteredNotes = getFilteredNotes();

  const renderNote = ({ item }) => (
    <NoteCard note={item} onPress={() => handleNotePress(item)} />
  );

  if (loading) {
    return <LoadingSpinner fullscreen message="Cargando notas..." />;
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

      {/* Notes List */}
      {filteredNotes.length === 0 ? (
        <EmptyState
          icon="note-text-outline"
          title="No hay notas"
          message={
            selectedPatientId === 'all'
              ? 'Agrega la primera nota médica'
              : 'No hay notas para este paciente'
          }
          actionLabel={selectedPatientId === 'all' ? 'Agregar Nota' : undefined}
          onAction={selectedPatientId === 'all' ? handleAddNote : undefined}
        />
      ) : (
        <FlatList
          data={filteredNotes}
          renderItem={renderNote}
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
      <FAB icon="plus" onPress={handleAddNote} />
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
