import React, { useEffect, useState } from 'react';
import { useColorScheme, StatusBar, View, StyleSheet, Image, Dimensions } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider } from 'react-native-paper';
import { QueryClientProvider } from '@tanstack/react-query';
import NetInfo from '@react-native-community/netinfo';
import { queryClient } from './src/services/queryClient';
import { paperLightTheme, paperDarkTheme } from './src/theme/paperTheme';
import { migrateStorageData, useAppStore } from './src/stores';
import { RootNavigator } from './src/navigation';
import { Text } from './src/components/atoms/Text';
import { usePermissions } from './src/hooks/usePermissions';

const SPLASH_DURATION = 2000; // 2 Sekunden

export default function App() {
  const [isSplashScreenVisible, setIsSplashScreenVisible] = useState(true);
  const permissions = usePermissions();
  const { setOnlineStatus } = useAppStore();
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? paperDarkTheme : paperLightTheme;

  useEffect(() => {
    // Daten migrieren
    migrateStorageData();
    
    // Berechtigungen sicher anfragen
    if (permissions && typeof permissions.requestPermissions === 'function') {
      permissions.requestPermissions().catch(err => {
        console.warn('Permission request failed early:', err);
      });
    }
    
    // Netzwerk-Status überwachen
    const unsubscribeNetInfo = NetInfo.addEventListener(state => {
      setOnlineStatus(state.isConnected ?? false);
    });
    
    const timer = setTimeout(() => {
      setIsSplashScreenVisible(false);
    }, SPLASH_DURATION);

    return () => {
      clearTimeout(timer);
      unsubscribeNetInfo();
    };
  }, []);

  if (isSplashScreenVisible) {
    return (
      <View style={styles.splashContainer}>
        <Image 
          source={require('./assets/splash-icon.png')} 
          style={styles.splashImage}
          resizeMode="contain"
        />
        <Text variant="h3" style={styles.splashText}>Tauben Scanner</Text>
      </View>
    );
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

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashImage: {
    width: Dimensions.get('window').width * 0.6,
    height: Dimensions.get('window').width * 0.6,
  },
  splashText: {
    marginTop: 20,
    color: '#333333',
    fontWeight: '600',
  },
});