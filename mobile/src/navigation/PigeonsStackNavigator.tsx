import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from 'react-native-paper';
import { PigeonListScreen } from '../screens/pigeons/PigeonListScreen';
import { PigeonDetailScreen } from '../screens/pigeons/PigeonDetailScreen';
import { PigeonEditScreen } from '../screens/pigeons/PigeonEditScreen';
import { NewPigeonScreen } from '../screens/pigeons/NewPigeonScreen';
import type { PigeonsStackParamList } from './types';

const Stack = createNativeStackNavigator<PigeonsStackParamList>();

export const PigeonsStackNavigator: React.FC = () => {
  const theme = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleStyle: {
          fontSize: 20,
          fontWeight: '600',
          color: theme.colors.onSurface,
        },
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        contentStyle: {
          backgroundColor: theme.colors.background,
        },
        headerTintColor: theme.colors.primary,
      }}
    >
      <Stack.Screen name="PigeonList" component={PigeonListScreen} options={{ title: 'Tauben' }} />
      <Stack.Screen name="PigeonDetail" component={PigeonDetailScreen} options={{ title: 'Details' }} />
      <Stack.Screen name="PigeonEdit" component={PigeonEditScreen} options={{ title: 'Bearbeiten' }} />
      <Stack.Screen name="NewPigeon" component={NewPigeonScreen} options={{ title: 'Neue Taube' }} />
    </Stack.Navigator>
  );
};
