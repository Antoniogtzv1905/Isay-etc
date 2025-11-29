import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useTheme } from '../hooks/useTheme';
import NoteListScreen from '../screens/notes/NoteListScreen';
import NoteFormScreen from '../screens/notes/NoteFormScreen';

const Stack = createStackNavigator();

export default function NoteStackNavigator() {
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
        name="NoteList"
        component={NoteListScreen}
        options={{ title: 'Notas' }}
      />
      <Stack.Screen
        name="NoteForm"
        component={NoteFormScreen}
        options={{ title: 'Nota' }}
      />
    </Stack.Navigator>
  );
}
