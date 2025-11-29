import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useTheme } from '../../hooks/useTheme';
import * as noteService from '../../api/services/noteService';
import * as patientService from '../../api/services/patientService';
import { Button, TextInput as CustomTextInput, Card, IconButton } from '../../components';

export default function NoteFormScreen({ route, navigation }) {
  const { theme } = useTheme();
  const note = route.params?.note || null;

  const [patients, setPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState(note?.patient_id || null);
  const [text, setText] = useState(note?.text || '');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadPatients();
    navigation.setOptions({
      title: note ? 'Editar Nota' : 'Nueva Nota',
      headerRight: () =>
        note ? (
          <IconButton icon="delete" variant="text" onPress={handleDelete} />
        ) : null,
    });
  }, [note, navigation]);

  const loadPatients = async () => {
    try {
      const data = await patientService.getPatients();
      setPatients(data);
      if (!selectedPatientId && data.length > 0) {
        setSelectedPatientId(data[0].id);
      }
    } catch (err) {
      Alert.alert('Error', 'No se pudieron cargar los pacientes');
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!selectedPatientId) newErrors.patient = 'Selecciona un paciente';
    if (!text.trim()) newErrors.text = 'El contenido es requerido';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDelete = () => {
    Alert.alert('Eliminar Nota', '¿Estás seguro? Esta acción no se puede deshacer.', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            await noteService.deleteNote(note.id);
            Alert.alert('Éxito', 'Nota eliminada');
            navigation.goBack();
          } catch (err) {
            Alert.alert('Error', 'No se pudo eliminar');
          }
        },
      },
    ]);
  };

  const onSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const data = {
        text: text.trim(),
      };

      if (note) {
        await noteService.updateNote(note.id, data);
        Alert.alert('Éxito', 'Nota actualizada');
      } else {
        await noteService.createNote(selectedPatientId, data);
        Alert.alert('Éxito', 'Nota creada');
      }

      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', err.message || 'No se pudo guardar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Card variant="elevated">
          <Text style={[styles.formTitle, { color: theme.colors.text, ...theme.typography.h4 }]}>
            {note ? 'Editar Nota' : 'Nueva Nota Médica'}
          </Text>

          {/* Paciente */}
          <View style={styles.section}>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
              Paciente
            </Text>
            <View
              style={[
                styles.pickerContainer,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: errors.patient ? theme.colors.error : theme.colors.border,
                },
              ]}
            >
              <Picker
                selectedValue={selectedPatientId}
                onValueChange={(value) => {
                  setSelectedPatientId(value);
                  if (errors.patient) setErrors({ ...errors, patient: null });
                }}
                style={{ color: theme.colors.text }}
                enabled={!note}
              >
                <Picker.Item label="Selecciona un paciente" value={null} />
                {patients.map((p) => (
                  <Picker.Item key={p.id} label={p.name} value={p.id} />
                ))}
              </Picker>
            </View>
            {errors.patient && (
              <Text style={[styles.errorText, { color: theme.colors.error }]}>
                {errors.patient}
              </Text>
            )}
          </View>

          {/* Contenido */}
          <View style={styles.section}>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
              Contenido de la Nota
            </Text>
            <View
              style={[
                styles.textAreaContainer,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: errors.text ? theme.colors.error : theme.colors.border,
                },
              ]}
            >
              <CustomTextInput
                placeholder="Escribe las observaciones médicas, diagnóstico, tratamiento, etc."
                value={text}
                onChangeText={(value) => {
                  setText(value);
                  if (errors.text) setErrors({ ...errors, text: null });
                }}
                multiline
                numberOfLines={12}
                textAlignVertical="top"
                containerStyle={{ marginBottom: 0 }}
              />
            </View>
            {errors.text && (
              <Text style={[styles.errorText, { color: theme.colors.error }]}>
                {errors.text}
              </Text>
            )}
          </View>

          {/* Botones */}
          <View style={styles.buttonContainer}>
            <Button
              variant="outlined"
              onPress={() => navigation.goBack()}
              disabled={loading}
              style={styles.cancelButton}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onPress={onSubmit}
              loading={loading}
              disabled={loading}
              icon="content-save"
              style={styles.saveButton}
            >
              Guardar
            </Button>
          </View>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  formTitle: {
    marginBottom: 20,
  },
  section: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  pickerContainer: {
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
  },
  textAreaContainer: {
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 250,
    padding: 12,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
  },
  saveButton: {
    flex: 2,
  },
});
