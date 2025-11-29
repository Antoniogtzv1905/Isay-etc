import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useTheme } from '../hooks/useTheme';
import PhotoListScreen from '../screens/photos/PhotoListScreen';

const Stack = createStackNavigator();

export default function PhotoStackNavigator() {
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
        name="PhotoList"
        component={PhotoListScreen}
        options={{
          title: 'Galería de Fotos',
        }}
      />
    </Stack.Navigator>
  );
}
