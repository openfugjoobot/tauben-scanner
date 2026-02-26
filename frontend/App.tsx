/**
 * Tauben Scanner - React Native App
 * Haupt App Komponente mit Navigation
 * T6: Home Screen
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { QueryProvider } from './src/components/providers/QueryProvider';
import { StoreProvider } from './src/components/providers/StoreProvider';
import { TabNavigator } from './src/navigation';

export default function App() {
  return (
    <QueryProvider>
      <StoreProvider>
        <SafeAreaProvider>
          <NavigationContainer>
            <StatusBar style="auto" />
            <TabNavigator />
          </NavigationContainer>
        </SafeAreaProvider>
      </StoreProvider>
    </QueryProvider>
  );
}
