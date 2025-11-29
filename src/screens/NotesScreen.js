import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function NotesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.placeholder}>Módulo de Notas Médicas - Próximamente</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' },
  placeholder: { fontSize: 14, color: '#666' },
});
