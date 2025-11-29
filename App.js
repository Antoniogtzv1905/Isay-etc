import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { AuthProvider } from './src/contexts/AuthContext';
import useAuth from './src/hooks/useAuth';
import useTheme from './src/hooks/useTheme';
import AuthNavigator from './src/navigation/AuthNavigator';
import MainNavigator from './src/navigation/MainNavigator';

function Root() {
  const { token, loading } = useAuth();
  const { theme } = useTheme();

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={{ color: theme.colors.text }}>Cargando...</Text>
      </View>
    );
  }
  return token ? <MainNavigator /> : <AuthNavigator />;
}

export default function App() {
  return (
    <PaperProvider>
      <ThemeProvider>
        <AuthProvider>
          <NavigationContainer>
            <Root />
            <StatusBar style="auto" />
          </NavigationContainer>
        </AuthProvider>
      </ThemeProvider>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
});
