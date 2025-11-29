import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useTheme } from '../hooks/useTheme';
import VitalListScreen from '../screens/vitals/VitalListScreen';
import VitalFormScreen from '../screens/vitals/VitalFormScreen';

const Stack = createStackNavigator();

export default function VitalStackNavigator() {
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
        name="VitalList"
        component={VitalListScreen}
        options={{ title: 'Signos Vitales' }}
      />
      <Stack.Screen
        name="VitalForm"
        component={VitalFormScreen}
        options={{ title: 'Signos Vitales' }}
      />
    </Stack.Navigator>
  );
}
