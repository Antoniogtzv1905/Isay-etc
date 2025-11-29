import React from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';
import { Card, Button, Avatar, Divider } from '../../components';

export default function ProfileScreen({ navigation }) {
  const { theme, isDark, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();

  const handleSignOut = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro que deseas cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: async () => {
            await signOut();
          },
        },
      ]
    );
  };

  const getUserInitials = () => {
    if (user?.name) {
      return user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    }
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  const getUserDisplayName = () => {
    return user?.name || user?.email?.split('@')[0] || 'Usuario';
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.content}
    >
      {/* Header with Avatar */}
      <Card variant="elevated" style={styles.profileCard}>
        <View style={styles.profileHeader}>
          <Avatar size="xl" name={getUserInitials()} />
          <View style={styles.profileInfo}>
            <Text style={[styles.userName, { color: theme.colors.text, ...theme.typography.h3 }]}>
              {getUserDisplayName()}
            </Text>
            <Text style={[styles.userEmail, { color: theme.colors.textSecondary }]}>
              {user?.email || 'email@ejemplo.com'}
            </Text>
          </View>
        </View>
      </Card>

      {/* Settings Section */}
      <Card variant="elevated" style={styles.settingsCard}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text, ...theme.typography.h4 }]}>
          Configuración
        </Text>

        {/* Dark Mode Toggle */}
        <View style={styles.settingRow}>
          <View style={styles.settingLeft}>
            <MaterialCommunityIcons
              name={isDark ? 'weather-night' : 'weather-sunny'}
              size={24}
              color={theme.colors.primary}
            />
            <View style={styles.settingText}>
              <Text style={[styles.settingLabel, { color: theme.colors.text }]}>
                Modo Oscuro
              </Text>
              <Text style={[styles.settingDescription, { color: theme.colors.textSecondary }]}>
                {isDark ? 'Activado' : 'Desactivado'}
              </Text>
            </View>
          </View>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
            thumbColor={theme.colors.surface}
          />
        </View>

        <Divider style={styles.divider} />

        {/* App Info */}
        <View style={styles.settingRow}>
          <View style={styles.settingLeft}>
            <MaterialCommunityIcons
              name="information-outline"
              size={24}
              color={theme.colors.primary}
            />
            <View style={styles.settingText}>
              <Text style={[styles.settingLabel, { color: theme.colors.text }]}>
                Versión
              </Text>
              <Text style={[styles.settingDescription, { color: theme.colors.textSecondary }]}>
                MedAPP v1.0.0
              </Text>
            </View>
          </View>
        </View>
      </Card>

      {/* Actions */}
      <View style={styles.actionsContainer}>
        <Button
          variant="outlined"
          icon="logout"
          onPress={handleSignOut}
          style={styles.logoutButton}
        >
          Cerrar Sesión
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  profileCard: {
    marginBottom: 16,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  profileInfo: {
    alignItems: 'center',
    marginTop: 16,
  },
  userName: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
  },
  settingsCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 16,
  },
  settingText: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 13,
  },
  divider: {
    marginVertical: 4,
  },
  actionsContainer: {
    marginTop: 8,
  },
  logoutButton: {
    borderColor: '#DC2626',
  },
});
