import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';
import { Button, TextInput as CustomTextInput, Card } from '../../components';

export default function RegisterScreen({ navigation }) {
  const { theme } = useTheme();
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'El nombre es requerido';
    if (!email.trim()) newErrors.email = 'El email es requerido';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email inválido';
    if (!password) newErrors.password = 'La contraseña es requerida';
    else if (password.length < 6) newErrors.password = 'Mínimo 6 caracteres';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    const res = await signUp(name.trim(), email.trim(), password);
    setLoading(false);

    if (!res.ok) {
      const msg = res.error?.detail || res.error || 'Error al registrar';
      Alert.alert('Error', msg);
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
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.primary, ...theme.typography.h1 }]}>
            MedAPP
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary, ...theme.typography.body1 }]}>
            Gestión médica profesional
          </Text>
        </View>

        {/* Form Card */}
        <Card variant="elevated" style={styles.formCard}>
          <Text style={[styles.formTitle, { color: theme.colors.text, ...theme.typography.h3 }]}>
            Crear Cuenta
          </Text>

          <CustomTextInput
            label="Nombre Completo"
            placeholder="Dr. Juan Pérez"
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
            label="Correo Electrónico"
            placeholder="doctor@ejemplo.com"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (errors.email) setErrors({ ...errors, email: null });
            }}
            error={errors.email}
            leftIcon="email-outline"
            autoCapitalize="none"
            keyboardType="email-address"
            containerStyle={styles.input}
          />

          <CustomTextInput
            label="Contraseña"
            placeholder="Mínimo 6 caracteres"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (errors.password) setErrors({ ...errors, password: null });
            }}
            error={errors.password}
            leftIcon="lock-outline"
            secureTextEntry
            containerStyle={styles.input}
          />

          <Button
            variant="primary"
            onPress={onSubmit}
            loading={loading}
            disabled={loading}
            icon="account-plus"
            style={styles.submitButton}
          >
            Crear Cuenta
          </Button>

          <Button
            variant="text"
            onPress={() => navigation.goBack()}
            disabled={loading}
            style={styles.backButton}
          >
            ¿Ya tienes cuenta? Inicia sesión
          </Button>
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
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    marginBottom: 8,
    letterSpacing: 1,
  },
  subtitle: {
    textAlign: 'center',
  },
  formCard: {
    padding: 24,
  },
  formTitle: {
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
  },
  submitButton: {
    marginTop: 8,
  },
  backButton: {
    marginTop: 12,
  },
});
