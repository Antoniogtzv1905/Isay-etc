import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useTheme } from '../hooks/useTheme';
import AppointmentListScreen from '../screens/appointments/AppointmentListScreen';
import AppointmentFormScreen from '../screens/appointments/AppointmentFormScreen';

const Stack = createStackNavigator();

export default function AppointmentStackNavigator() {
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
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
    >
      <Stack.Screen
        name="AppointmentList"
        component={AppointmentListScreen}
        options={{ title: 'Citas' }}
      />
      <Stack.Screen
        name="AppointmentForm"
        component={AppointmentFormScreen}
        options={{ title: 'Cita' }}
      />
    </Stack.Navigator>
  );
}
