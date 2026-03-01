import React from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { useTheme } from "react-native-paper";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useOnboardingCompleted } from '../stores/app';
import { OnboardingScreen } from '../screens/onboarding';
import { TabNavigator } from './TabNavigator';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  const theme = useTheme();
  const onboardingCompleted = useOnboardingCompleted();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: theme.colors.background,
        },
      }}>
        {!onboardingCompleted && (
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        )}
        <Stack.Screen name="MainTabs" component={TabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
