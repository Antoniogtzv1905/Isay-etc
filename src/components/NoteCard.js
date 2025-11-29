import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';

export default function NoteCard({ note, onPress }) {
  const { theme } = useTheme();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const truncateText = (text, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
          ...theme.shadows.sm,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <MaterialCommunityIcons
            name="note-text"
            size={20}
            color={theme.colors.primary}
          />
          <Text
            style={[
              styles.patientName,
              { color: theme.colors.text, ...theme.typography.h5 },
            ]}
            numberOfLines={1}
          >
            {note.patient_name}
          </Text>
        </View>
        <Text
          style={[styles.date, { color: theme.colors.textSecondary }]}
        >
          {formatDate(note.created_at)}
        </Text>
      </View>

      <Text
        style={[styles.content, { color: theme.colors.textSecondary }]}
        numberOfLines={4}
      >
        {truncateText(note.text || '', 150)}
      </Text>

      <View style={styles.footer}>
        <MaterialCommunityIcons
          name="chevron-right"
          size={20}
          color={theme.colors.textLight}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  patientName: {
    fontWeight: '600',
    flex: 1,
  },
  date: {
    fontSize: 12,
  },
  title: {
    fontWeight: '600',
    marginBottom: 6,
  },
  content: {
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    alignItems: 'flex-end',
    marginTop: 8,
  },
});
