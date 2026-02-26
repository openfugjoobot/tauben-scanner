/**
 * Pigeons Stack Navigator
 * - PigeonListScreen → PigeonDetailScreen
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PigeonListScreen, PigeonDetailScreen } from '../screens';
import type { PigeonsStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<PigeonsStackParamList>();

export const PigeonsStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="PigeonListScreen"
        component={PigeonListScreen}
        options={{
          title: 'Meine Tauben',
        }}
      />
      <Stack.Screen
        name="PigeonDetailScreen"
        component={PigeonDetailScreen}
        options={{
          title: 'Taube Details',
        }}
      />
    </Stack.Navigator>
  );
};
