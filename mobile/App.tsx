import React, { useEffect, useState, useCallback } from 'react';
import { useColorScheme, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider } from 'react-native-paper';
import { QueryClientProvider } from '@tanstack/react-query';
import NetInfo from '@react-native-community/netinfo';
import { queryClient } from './src/services/queryClient';
import { paperLightTheme, paperDarkTheme } from './src/theme/paperTheme';
import { migrateStorageData, useAppStore } from './src/stores';
import { RootNavigator } from './src/navigation';
import { usePermissions } from './src/hooks/usePermissions';

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const permissions = usePermissions();
  const { setOnlineStatus } = useAppStore();
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? paperDarkTheme : paperLightTheme;

  const initializeApp = useCallback(async () => {
    try {
      // Daten migrieren
      await migrateStorageData();
      
      // Berechtigungen sicher anfragen
      if (permissions && typeof permissions.requestPermissions === 'function') {
        await permissions.requestPermissions().catch(err => {
          console.warn('Permission request failed early:', err);
        });
      }
      
      // Netzwerk-Status überwachen
      const unsubscribeNetInfo = NetInfo.addEventListener((state: { isConnected: boolean | null }) => {
        setOnlineStatus(state.isConnected ?? false);
      });
      
      return () => {
        unsubscribeNetInfo();
      };
    } catch (error) {
      console.error('App initialization error:', error);
    }
  }, [permissions, setOnlineStatus]);

  useEffect(() => {
    initializeApp().then(cleanup => {
      setIsReady(true);
      return cleanup;
    });
  }, [initializeApp]);

  if (!isReady) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <PaperProvider theme={theme}>
          <StatusBar
            barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
            backgroundColor={theme.colors.background}
          />
          <RootNavigator />
        </PaperProvider>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
