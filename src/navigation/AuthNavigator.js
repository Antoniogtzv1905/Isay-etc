import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/auth/Login';
import RegisterScreen from '../screens/auth/Register';

const Stack = createStackNavigator();

export default function AuthNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerTitle: 'Iniciar sesión' }} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{ headerTitle: 'Registro' }} />
    </Stack.Navigator>
  );
}
