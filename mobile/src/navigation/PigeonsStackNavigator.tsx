import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PigeonListScreen } from '../screens/pigeons/PigeonListScreen';
import { PigeonDetailScreen } from '../screens/pigeons/PigeonDetailScreen';
import { PigeonEditScreen } from '../screens/pigeons/PigeonEditScreen';
import type { PigeonsStackParamList } from './types';

const Stack = createNativeStackNavigator<PigeonsStackParamList>();

export const PigeonsStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="PigeonList" component={PigeonListScreen} options={{ title: 'Meine Tauben' }} />
      <Stack.Screen name="PigeonDetail" component={PigeonDetailScreen} options={{ title: 'Details' }} />
      <Stack.Screen name="PigeonEdit" component={PigeonEditScreen} options={{ title: 'Bearbeiten' }} />
    </Stack.Navigator>
  );
};
