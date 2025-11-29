import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import DashboardStackNavigator from './DashboardStackNavigator';
import PatientStackNavigator from './PatientStackNavigator';
import AppointmentStackNavigator from './AppointmentStackNavigator';
import NoteStackNavigator from './NoteStackNavigator';
import VitalStackNavigator from './VitalStackNavigator';
import PhotoStackNavigator from './PhotoStackNavigator';
import ProfileScreen from '../screens/settings/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function MainNavigator() {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = 'view-dashboard-outline';
          } else if (route.name === 'Patients') {
            iconName = 'account-group-outline';
          } else if (route.name === 'Appointments') {
            iconName = 'calendar-clock';
          } else if (route.name === 'Notes') {
            iconName = 'note-text-outline';
          } else if (route.name === 'Vitals') {
            iconName = 'heart-pulse';
          } else if (route.name === 'Photos') {
            iconName = 'image-multiple-outline';
          } else if (route.name === 'Settings') {
            iconName = 'cog-outline';
          }

          return (
            <MaterialCommunityIcons
              name={iconName}
              size={size}
              color={color}
            />
          );
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textLight,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          borderTopWidth: 1,
          elevation: 8,
          shadowColor: theme.colors.shadow,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardStackNavigator}
        options={{
          title: 'Inicio',
          tabBarLabel: 'Inicio',
        }}
      />
      <Tab.Screen
        name="Patients"
        component={PatientStackNavigator}
        options={{
          title: 'Pacientes',
          tabBarLabel: 'Pacientes',
        }}
      />
      <Tab.Screen
        name="Appointments"
        component={AppointmentStackNavigator}
        options={{
          title: 'Citas',
          tabBarLabel: 'Citas',
        }}
      />
      <Tab.Screen
        name="Notes"
        component={NoteStackNavigator}
        options={{
          title: 'Notas',
          tabBarLabel: 'Notas',
        }}
      />
      <Tab.Screen
        name="Vitals"
        component={VitalStackNavigator}
        options={{
          title: 'Signos',
          tabBarLabel: 'Signos',
        }}
      />
      <Tab.Screen
        name="Photos"
        component={PhotoStackNavigator}
        options={{
          title: 'Fotos',
          tabBarLabel: 'Fotos',
        }}
      />
      <Tab.Screen
        name="Settings"
        component={ProfileScreen}
        options={{
          title: 'Configuración',
          tabBarLabel: 'Config',
          headerShown: true,
          headerStyle: {
            backgroundColor: theme.colors.surface,
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.border,
          },
          headerTintColor: theme.colors.text,
          headerTitleStyle: {
            ...theme.typography.h4,
          },
        }}
      />
    </Tab.Navigator>
  );
}
