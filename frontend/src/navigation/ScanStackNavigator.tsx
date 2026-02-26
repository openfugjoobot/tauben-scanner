/**
 * Scan Stack Navigator
 * - ScanScreen → PreviewScreen → ResultsScreen
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ScanScreen, PreviewScreen, ResultsScreen } from '../screens';
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
    </Stack.Navigator>
  );
};
