import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ScanScreen } from '../screens/scan/ScanScreen';
import { PreviewScreen } from '../screens/scan/PreviewScreen';
import { ResultsScreen } from '../screens/scan/ResultsScreen';
import { NewPigeonScreen } from '../screens/scan/NewPigeonScreen';
import type { ScanStackParamList } from './types';

const Stack = createNativeStackNavigator<ScanStackParamList>();

export const ScanStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Scan" component={ScanScreen} />
      <Stack.Screen name="Preview" component={PreviewScreen} />
      <Stack.Screen name="Results" component={ResultsScreen} />
      <Stack.Screen name="NewPigeon" component={NewPigeonScreen} />
    </Stack.Navigator>
  );
};
