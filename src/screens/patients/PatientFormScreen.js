import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import * as patientService from '../../api/services/patientService';
import { Button, TextInput as CustomTextInput, Card, IconButton } from '../../components';

export default function PatientFormScreen({ route, navigation }) {
  const { theme } = useTheme();
  const patient = route.params?.patient || null;
  const [name, setName] = useState(patient?.name || '');
  const [age, setAge] = useState(patient?.age ? patient.age.toString() : '');
  const [gender, setGender] = useState(patient?.gender || '');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    navigation.setOptions({
      title: patient ? 'Editar Paciente' : 'Nuevo Paciente',
      headerRight: () =>
        patient ? (
          <IconButton icon="delete" variant="text" onPress={handleDelete} />
        ) : null,
    });
  }, [patient, navigation]);

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'El nombre es requerido';
    if (!age) newErrors.age = 'La edad es requerida';
    else if (isNaN(age) || parseInt(age) < 0 || parseInt(age) > 150)
      newErrors.age = 'Edad inválida';
    if (!gender) newErrors.gender = 'El sexo es requerido';
    else if (!['M', 'F'].includes(gender.toUpperCase()))
      newErrors.gender = 'Debe ser M o F';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDelete = () => {
    Alert.alert('Eliminar Paciente', '¿Estás seguro? Esta acción no se puede deshacer.', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            await patientService.deletePatient(patient.id);
            Alert.alert('Éxito', 'Paciente eliminado');
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
        name: name.trim(),
        age: parseInt(age),
        gender: gender.toUpperCase(),
      };

      if (patient) {
        await patientService.updatePatient(patient.id, data);
        Alert.alert('Éxito', 'Paciente actualizado');
      } else {
        await patientService.createPatient(data);
        Alert.alert('Éxito', 'Paciente creado');
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
            Información del Paciente
          </Text>

          <CustomTextInput
            label="Nombre Completo"
            placeholder="Juan Pérez García"
            value={name}
            onChangeText={(text) => {
              setName(text);
              if (errors.name) setErrors({ ...errors, name: null });
            }}
            error={errors.name}
            leftIcon="account-outline"
            containerStyle={styles.input}
          />

          <CustomTextInput
            label="Edad"
            placeholder="35"
            value={age}
            onChangeText={(text) => {
              setAge(text);
              if (errors.age) setErrors({ ...errors, age: null });
            }}
            error={errors.age}
            leftIcon="cake-variant"
            keyboardType="numeric"
            containerStyle={styles.input}
          />

          <CustomTextInput
            label="Sexo"
            placeholder="M o F"
            value={gender}
            onChangeText={(text) => {
              setGender(text);
              if (errors.gender) setErrors({ ...errors, gender: null });
            }}
            error={errors.gender}
            leftIcon="gender-male-female"
            autoCapitalize="characters"
            maxLength={1}
            containerStyle={styles.input}
          />

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
  input: {
    marginBottom: 16,
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
