import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useTheme } from '../../hooks/useTheme';
import * as appointmentService from '../../api/services/appointmentService';
import * as patientService from '../../api/services/patientService';
import { Button, TextInput as CustomTextInput, Card, IconButton, Badge } from '../../components';

export default function AppointmentFormScreen({ route, navigation }) {
  const { theme } = useTheme();
  const appointment = route.params?.appointment || null;

  const [patients, setPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState(appointment?.patient_id || null);
  const [date, setDate] = useState(appointment?.datetime ? new Date(appointment.datetime) : new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [reason, setReason] = useState(appointment?.reason || '');
  const [doctor, setDoctor] = useState(appointment?.doctor || '');
  const [status, setStatus] = useState(appointment?.status || 'pending');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadPatients();
    navigation.setOptions({
      title: appointment ? 'Editar Cita' : 'Nueva Cita',
      headerRight: () =>
        appointment ? (
          <IconButton icon="delete" variant="text" onPress={handleDelete} />
        ) : null,
    });
  }, [appointment, navigation]);

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
    if (!reason.trim()) newErrors.reason = 'El motivo es requerido';
    if (!doctor.trim()) newErrors.doctor = 'El doctor es requerido';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDelete = () => {
    Alert.alert('Eliminar Cita', '¿Estás seguro? Esta acción no se puede deshacer.', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            await appointmentService.deleteAppointment(appointment.patient_id, appointment.id);
            Alert.alert('Éxito', 'Cita eliminada');
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
        datetime: date.toISOString(),
        reason: reason.trim(),
        doctor: doctor.trim(),
        status,
      };

      if (appointment) {
        await appointmentService.updateAppointment(selectedPatientId, appointment.id, data);
        Alert.alert('Éxito', 'Cita actualizada');
      } else {
        await appointmentService.createAppointment(selectedPatientId, data);
        Alert.alert('Éxito', 'Cita creada');
      }

      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', err.message || 'No se pudo guardar');
    } finally {
      setLoading(false);
    }
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const onTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const newDate = new Date(date);
      newDate.setHours(selectedTime.getHours());
      newDate.setMinutes(selectedTime.getMinutes());
      setDate(newDate);
    }
  };

  const formatDate = (d) => {
    return d.toLocaleDateString('es-MX', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatTime = (d) => {
    return d.toLocaleTimeString('es-MX', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (st) => {
    const map = {
      pending: { label: 'Pendiente', status: 'warning' },
      confirmed: { label: 'Confirmada', status: 'success' },
      cancelled: { label: 'Cancelada', status: 'error' },
      completed: { label: 'Completada', status: 'info' },
    };
    return map[st] || map.pending;
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
            Información de la Cita
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

          {/* Fecha */}
          <View style={styles.section}>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
              Fecha
            </Text>
            <Button
              variant="outlined"
              icon="calendar"
              onPress={() => setShowDatePicker(true)}
            >
              {formatDate(date)}
            </Button>
            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={onDateChange}
              />
            )}
          </View>

          {/* Hora */}
          <View style={styles.section}>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
              Hora
            </Text>
            <Button
              variant="outlined"
              icon="clock-outline"
              onPress={() => setShowTimePicker(true)}
            >
              {formatTime(date)}
            </Button>
            {showTimePicker && (
              <DateTimePicker
                value={date}
                mode="time"
                display="default"
                onChange={onTimeChange}
              />
            )}
          </View>

          {/* Motivo */}
          <CustomTextInput
            label="Motivo / Tipo de Cita"
            placeholder="Consulta general, revisión, etc."
            value={reason}
            onChangeText={(text) => {
              setReason(text);
              if (errors.reason) setErrors({ ...errors, reason: null });
            }}
            error={errors.reason}
            leftIcon="note-text-outline"
            containerStyle={styles.input}
          />

          {/* Doctor */}
          <CustomTextInput
            label="Doctor"
            placeholder="Dr. Juan Pérez"
            value={doctor}
            onChangeText={(text) => {
              setDoctor(text);
              if (errors.doctor) setErrors({ ...errors, doctor: null });
            }}
            error={errors.doctor}
            leftIcon="doctor"
            containerStyle={styles.input}
          />

          {/* Estado */}
          <View style={styles.section}>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
              Estado
            </Text>
            <View style={styles.statusButtons}>
              {['pending', 'confirmed', 'cancelled', 'completed'].map((st) => {
                const badgeInfo = getStatusBadge(st);
                return (
                  <Badge
                    key={st}
                    status={status === st ? badgeInfo.status : 'default'}
                    onPress={() => setStatus(st)}
                  >
                    {badgeInfo.label}
                  </Badge>
                );
              })}
            </View>
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
  input: {
    marginBottom: 16,
  },
  statusButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
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
