import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import PatientListScreen from '../screens/patients/PatientListScreen';
import PatientFormScreen from '../screens/patients/PatientFormScreen';

const Stack = createStackNavigator();

export default function PatientStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="PatientList">
      <Stack.Screen
        name="PatientList"
        component={PatientListScreen}
        options={{ title: 'Pacientes' }}
      />
      <Stack.Screen
        name="PatientForm"
        component={PatientFormScreen}
        options={{ title: 'Formulario Paciente' }}
      />
    </Stack.Navigator>
  );
}
