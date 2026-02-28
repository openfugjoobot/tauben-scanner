import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ScanScreen } from '../screens/scan/ScanScreen';
import { ResultsScreen } from '../screens/scan/ResultsScreen';
import { NewPigeonScreen } from '../screens/scan/NewPigeonScreen';
import type { ScanStackParamList } from './types';

const Stack = createNativeStackNavigator<ScanStackParamList>();

export const ScanStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleStyle: {
          fontSize: 20,
          fontWeight: '600',
        },
      }}
    >
      <Stack.Screen name="Scan" component={ScanScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Results" component={ResultsScreen} options={{ title: 'Ergebnis' }} />
      <Stack.Screen name="NewPigeon" component={NewPigeonScreen} options={{ title: 'Neue Taube' }} />
    </Stack.Navigator>
  );
};
