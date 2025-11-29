import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import Card from './Card';
import Avatar from './Avatar';

/**
 * Tarjeta de paciente para listas
 * @param {object} patient - Objeto paciente { id, name, age, gender }
 * @param {function} onPress - Función al presionar
 */
export default function PatientCard({ patient, onPress }) {
  const { theme } = useTheme();

  const getGenderIcon = () => {
    if (patient.gender === 'M') return 'gender-male';
    if (patient.gender === 'F') return 'gender-female';
    return 'help-circle-outline';
  };

  return (
    <Card onPress={onPress} style={styles.card}>
      <View style={styles.container}>
        <Avatar name={patient.name} size="md" />

        <View style={styles.info}>
          <Text style={[styles.name, { color: theme.colors.text, ...theme.typography.h4 }]}>
            {patient.name}
          </Text>
          <View style={styles.details}>
            <View style={styles.detailItem}>
              <MaterialCommunityIcons
                name="cake-variant"
                size={14}
                color={theme.colors.textSecondary}
              />
              <Text style={[styles.detailText, { color: theme.colors.textSecondary }]}>
                {patient.age} años
              </Text>
            </View>
            <View style={styles.detailItem}>
              <MaterialCommunityIcons
                name={getGenderIcon()}
                size={14}
                color={theme.colors.textSecondary}
              />
              <Text style={[styles.detailText, { color: theme.colors.textSecondary }]}>
                {patient.gender === 'M' ? 'Masculino' : patient.gender === 'F' ? 'Femenino' : 'N/A'}
              </Text>
            </View>
          </View>
        </View>

        <MaterialCommunityIcons
          name="chevron-right"
          size={24}
          color={theme.colors.textLight}
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    marginBottom: 4,
  },
  details: {
    flexDirection: 'row',
    gap: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 12,
  },
});
