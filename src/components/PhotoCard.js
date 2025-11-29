import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';

export default function PhotoCard({ photo, onPress, baseUrl }) {
  const { theme } = useTheme();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  // Construir URL completa de la imagen
  const imageUrl = photo.url.startsWith('http')
    ? photo.url
    : `${baseUrl}${photo.url}`;

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
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <MaterialCommunityIcons
              name="account"
              size={16}
              color={theme.colors.primary}
            />
            <Text
              style={[
                styles.patientName,
                { color: theme.colors.text, ...theme.typography.body },
              ]}
              numberOfLines={1}
            >
              {photo.patient_name}
            </Text>
          </View>
          <Text style={[styles.date, { color: theme.colors.textSecondary }]}>
            {formatDate(photo.taken_at)}
          </Text>
        </View>

        {photo.caption && (
          <Text
            style={[styles.caption, { color: theme.colors.textSecondary }]}
            numberOfLines={2}
          >
            {photo.caption}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
    borderWidth: 1,
  },
  imageContainer: {
    width: '100%',
    height: 200,
    backgroundColor: '#E5E5EA',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  content: {
    padding: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  patientName: {
    fontWeight: '600',
    flex: 1,
  },
  date: {
    fontSize: 12,
  },
  caption: {
    fontSize: 13,
    lineHeight: 18,
  },
});
