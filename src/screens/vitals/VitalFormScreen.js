import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useTheme } from '../../hooks/useTheme';
import * as vitalService from '../../api/services/vitalService';
import * as patientService from '../../api/services/patientService';
import { Button, TextInput as CustomTextInput, Card, IconButton } from '../../components';

export default function VitalFormScreen({ route, navigation }) {
  const { theme } = useTheme();
  const vital = route.params?.vital || null;

  const [patients, setPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState(vital?.patient_id || null);

  // Signos vitales (solo los que soporta el backend)
  const [systolic, setSystolic] = useState(vital?.systolic?.toString() || '');
  const [diastolic, setDiastolic] = useState(vital?.diastolic?.toString() || '');
  const [heartRate, setHeartRate] = useState(vital?.heart_rate?.toString() || '');
  const [weight, setWeight] = useState(vital?.weight?.toString() || '');

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadPatients();
    navigation.setOptions({
      title: vital ? 'Editar Signos Vitales' : 'Nuevos Signos Vitales',
      headerRight: () =>
        vital ? (
          <IconButton icon="delete" variant="text" onPress={handleDelete} />
        ) : null,
    });
  }, [vital, navigation]);

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

    if (systolic && isNaN(systolic)) newErrors.systolic = 'Debe ser un número válido';
    if (diastolic && isNaN(diastolic)) newErrors.diastolic = 'Debe ser un número válido';
    if (heartRate && isNaN(heartRate)) newErrors.heartRate = 'Debe ser un número válido';
    if (weight && isNaN(weight)) newErrors.weight = 'Debe ser un número válido';

    if (!systolic && !diastolic && !heartRate && !weight) {
      newErrors.general = 'Ingresa al menos un signo vital';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDelete = () => {
    Alert.alert('Eliminar Registro', '¿Estás seguro? Esta acción no se puede deshacer.', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            await vitalService.deleteVital(vital.id);
            Alert.alert('Éxito', 'Registro eliminado');
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
        systolic: systolic ? parseInt(systolic) : null,
        diastolic: diastolic ? parseInt(diastolic) : null,
        heart_rate: heartRate ? parseInt(heartRate) : null,
        weight: weight ? parseFloat(weight) : null,
      };

      if (vital) {
        await vitalService.updateVital(vital.id, data);
        Alert.alert('Éxito', 'Signos vitales actualizados');
      } else {
        await vitalService.createVital(selectedPatientId, data);
        Alert.alert('Éxito', 'Signos vitales registrados');
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
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <Card variant="elevated">
          <Text style={[styles.formTitle, { color: theme.colors.text, ...theme.typography.h4 }]}>
            {vital ? 'Editar Signos Vitales' : 'Nuevos Signos Vitales'}
          </Text>

          <View style={styles.section}>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Paciente</Text>
            <View style={[styles.pickerContainer, { backgroundColor: theme.colors.surface, borderColor: errors.patient ? theme.colors.error : theme.colors.border }]}>
              <Picker
                selectedValue={selectedPatientId}
                onValueChange={(value) => {
                  setSelectedPatientId(value);
                  if (errors.patient) setErrors({ ...errors, patient: null });
                }}
                style={{ color: theme.colors.text }}
                enabled={!vital}
              >
                <Picker.Item label="Selecciona un paciente" value={null} />
                {patients.map((p) => (<Picker.Item key={p.id} label={p.name} value={p.id} />))}
              </Picker>
            </View>
            {errors.patient && (<Text style={[styles.errorText, { color: theme.colors.error }]}>{errors.patient}</Text>)}
          </View>

          {errors.general && (<Text style={[styles.errorText, { color: theme.colors.error, marginBottom: 16 }]}>{errors.general}</Text>)}

          <CustomTextInput label="Presión Sistólica (mmHg)" placeholder="120" value={systolic} onChangeText={(text) => { setSystolic(text); if (errors.systolic) setErrors({ ...errors, systolic: null, general: null }); }} error={errors.systolic} keyboardType="numeric" leftIcon="heart-pulse" containerStyle={styles.input} />
          <CustomTextInput label="Presión Diastólica (mmHg)" placeholder="80" value={diastolic} onChangeText={(text) => { setDiastolic(text); if (errors.diastolic) setErrors({ ...errors, diastolic: null, general: null }); }} error={errors.diastolic} keyboardType="numeric" leftIcon="heart-pulse" containerStyle={styles.input} />
          <CustomTextInput label="Frecuencia Cardíaca (bpm)" placeholder="72" value={heartRate} onChangeText={(text) => { setHeartRate(text); if (errors.heartRate) setErrors({ ...errors, heartRate: null, general: null }); }} error={errors.heartRate} keyboardType="numeric" leftIcon="heart" containerStyle={styles.input} />
          <CustomTextInput label="Peso (kg)" placeholder="70" value={weight} onChangeText={(text) => { setWeight(text); if (errors.weight) setErrors({ ...errors, weight: null, general: null }); }} error={errors.weight} keyboardType="decimal-pad" leftIcon="weight-kilogram" containerStyle={styles.input} />

          <View style={styles.buttonContainer}>
            <Button variant="outlined" onPress={() => navigation.goBack()} disabled={loading} style={styles.cancelButton}>Cancelar</Button>
            <Button variant="primary" onPress={onSubmit} loading={loading} disabled={loading} icon="content-save" style={styles.saveButton}>Guardar</Button>
          </View>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 16 },
  formTitle: { marginBottom: 20 },
  section: { marginBottom: 16 },
  label: { fontSize: 12, fontWeight: '600', marginBottom: 6, letterSpacing: 0.2 },
  pickerContainer: { borderRadius: 8, borderWidth: 1, overflow: 'hidden' },
  input: { marginBottom: 16 },
  errorText: { fontSize: 12, marginTop: 4 },
  buttonContainer: { flexDirection: 'row', gap: 12, marginTop: 8 },
  cancelButton: { flex: 1 },
  saveButton: { flex: 2 },
});
