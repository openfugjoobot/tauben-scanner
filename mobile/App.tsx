import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, useColorScheme, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider, Text } from 'react-native-paper';
import { QueryClientProvider } from '@tanstack/react-query';
import NetInfo from '@react-native-community/netinfo';
import { queryClient } from './src/services/queryClient';
import { paperLightTheme, paperDarkTheme } from './src/theme/paperTheme';
import { migrateStorageData, useAppStore } from './src/stores';
import { RootNavigator } from './src/navigation';

// Loading Screen während Initialisierung
const LoadingScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' }}>
    <ActivityIndicator size="large" color="#4CAF50" />
    <Text style={{ marginTop: 16, color: '#666' }}>Tauben Scanner wird gestartet...</Text>
  </View>
);

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const { setOnlineStatus } = useAppStore();
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? paperDarkTheme : paperLightTheme;

  useEffect(() => {
    let isMounted = true;
    
    const init = async () => {
      try {
        console.log('App init start...');
        
        // Daten migrieren
        await migrateStorageData();
        console.log('Migration done');
        
        // Netzwerk-Status überwachen
        const unsubscribeNetInfo = NetInfo.addEventListener((state) => {
          setOnlineStatus(state.isConnected ?? false);
        });
        console.log('NetInfo listener added');
        
        // Kurze Verzögerung für bessere UX
        await new Promise(resolve => setTimeout(resolve, 300));
        
        if (isMounted) {
          setIsReady(true);
          console.log('App ready!');
        }
        
        return unsubscribeNetInfo;
      } catch (error) {
        console.error('App init error:', error);
        // Trotzdem ready setzen - App sollte funktionieren
        if (isMounted) {
          setIsReady(true);
        }
      }
    };
    
    init();
    
    return () => {
      isMounted = false;
    };
  }, [setOnlineStatus]);

  // Zeige Loading Screen während Initialisierung
  if (!isReady) {
    return <LoadingScreen />;
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
