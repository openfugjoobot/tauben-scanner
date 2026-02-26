/**
 * Scan Stack Navigator
<<<<<<< HEAD
 * - ScanScreen → PreviewScreen → ResultsScreen
=======
 * T7: Scan Flow - Camera → Preview → Results → Detail
 * - ScanScreen → PreviewScreen → ResultsScreen → PigeonDetailScreen
>>>>>>> main
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
<<<<<<< HEAD
import { ScanScreen, PreviewScreen, ResultsScreen } from '../screens';
=======
import { ScanScreen, PreviewScreen, ResultsScreen, PigeonDetailScreen } from '../screens';
>>>>>>> main
import type { ScanStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<ScanStackParamList>();

export const ScanStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="ScanScreen"
        component={ScanScreen}
        options={{
          title: 'Scannen',
        }}
      />
      <Stack.Screen
        name="PreviewScreen"
        component={PreviewScreen}
        options={{
          title: 'Vorschau',
        }}
      />
      <Stack.Screen
        name="ResultsScreen"
        component={ResultsScreen}
        options={{
          title: 'Ergebnis',
        }}
      />
<<<<<<< HEAD
=======
      <Stack.Screen
        name="PigeonDetailScreen"
        component={PigeonDetailScreen}
        options={{
          title: 'Taube',
        }}
      />
>>>>>>> main
    </Stack.Navigator>
  );
};
