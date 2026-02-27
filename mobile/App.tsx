import React, { useEffect, useState } from 'react';
import { useColorScheme, StatusBar, View, StyleSheet, Image, Dimensions } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider } from 'react-native-paper';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './src/services/queryClient';
import { paperLightTheme, paperDarkTheme } from './src/theme/paperTheme';
import { migrateStorageData } from './src/stores';
import { RootNavigator } from './src/navigation';
import { Text } from './src/components/atoms/Text';

const SPLASH_DURATION = 4000; // 4 Sekunden

export default function App() {
  const [isSplashScreenVisible, setIsSplashScreenVisible] = useState(true);
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? paperDarkTheme : paperLightTheme;

  useEffect(() => {
    migrateStorageData();
    
    const timer = setTimeout(() => {
      setIsSplashScreenVisible(false);
    }, SPLASH_DURATION);

    return () => clearTimeout(timer);
  }, []);

  if (isSplashScreenVisible) {
    return (
      <View style={styles.splashContainer}>
        <Image 
          source={require('./assets/splash-icon.png')} 
          style={styles.splashImage}
          resizeMode="contain"
        />
        <Text variant="h1" style={styles.splashText}>Tauben Scanner</Text>
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
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashImage: {
    width: Dimensions.get('window').width * 0.7,
    height: Dimensions.get('window').width * 0.7,
  },
  splashText: {
    marginTop: 24,
    color: '#000000',
    fontWeight: 'bold',
  },
});