import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';
import { Button, TextInput as CustomTextInput, Card } from '../../components';

export default function LoginScreen({ navigation }) {
  const { theme } = useTheme();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!email.trim()) newErrors.email = 'El email es requerido';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email inválido';
    if (!password) newErrors.password = 'La contraseña es requerida';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    const res = await signIn(email.trim(), password);
    setLoading(false);

    if (!res.ok) {
      const msg = res.error?.detail || res.error || 'Error al iniciar sesión';
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
            Iniciar Sesión
          </Text>

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
            placeholder="••••••••"
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
            icon="login"
            style={styles.submitButton}
          >
            Iniciar Sesión
          </Button>

          <Button
            variant="text"
            onPress={() => navigation.navigate('Register')}
            disabled={loading}
            style={styles.registerButton}
          >
            ¿No tienes cuenta? Regístrate
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
  registerButton: {
    marginTop: 12,
  },
});
