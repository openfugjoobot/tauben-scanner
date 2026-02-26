import React, { useEffect } from 'react';
import { useColorScheme, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider } from 'react-native-paper';
import { paperLightTheme, paperDarkTheme } from './src/theme/paperTheme';
import { migrateStorageData } from './src/stores';

export default function App() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? paperDarkTheme : paperLightTheme;

  useEffect(() => {
    migrateStorageData();
  }, []);

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <StatusBar
          barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
          backgroundColor={theme.colors.background}
        />
        {/* Navigation or main screen will go here */}
      </PaperProvider>
    </SafeAreaProvider>
  );
}
