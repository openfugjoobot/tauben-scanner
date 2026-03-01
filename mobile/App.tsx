import React, { useEffect, useState, useCallback } from 'react';
import { View, ActivityIndicator, useColorScheme, StatusBar, Alert, Linking } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider, Text } from 'react-native-paper';
import { QueryClientProvider } from '@tanstack/react-query';
import NetInfo from '@react-native-community/netinfo';
import { useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { queryClient } from './src/services/queryClient';
import { paperLightTheme, paperDarkTheme } from './src/theme/paperTheme';
import { migrateStorageData, useAppStore } from './src/stores';
import { RootNavigator } from './src/navigation';

// Loading Screen während Initialisierung
const LoadingScreen = ({ theme }: { theme: typeof paperLightTheme }) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
    <ActivityIndicator size="large" color={theme.colors.success} />
    <Text style={{ marginTop: 16, color: theme.colors.onSurfaceVariant }}>Tauben Scanner wird gestartet...</Text>
  </View>
);

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const { setOnlineStatus } = useAppStore();
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? paperDarkTheme : paperLightTheme;
  
  // Camera permission hook
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();

  // Berechtigungen anfragen (einmalig beim Start)
  const requestAllPermissions = useCallback(async () => {
    try {
      console.log('Requesting permissions...');
      
      // Camera
      if (!cameraPermission?.granted) {
        await requestCameraPermission();
      }
      
      // Location
      const { status: locStatus } = await Location.requestForegroundPermissionsAsync();
      console.log('Location permission:', locStatus);
      
      // Media Library
      const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      console.log('Media permission:', mediaStatus);
      
    } catch (error) {
      console.error('Permission error:', error);
      Alert.alert(
        'Berechtigungen',
        'Einige Berechtigungen wurden nicht erteilt. Du kannst diese später in den Einstellungen aktivieren.',
        [
          { text: 'OK' },
          { text: 'Einstellungen', onPress: () => Linking.openSettings() }
        ]
      );
    }
  }, [cameraPermission, requestCameraPermission]);

  useEffect(() => {
    let isMounted = true;
    
    const init = async () => {
      try {
        console.log('App init start...');
        
        // Berechtigungen anfragen (nicht blockierend)
        requestAllPermissions();
        
        // Daten migrieren
        await migrateStorageData();
        console.log('Migration done');
        
        // Netzwerk-Status überwachen
        const unsubscribeNetInfo = NetInfo.addEventListener((state) => {
          setOnlineStatus(state.isConnected ?? false);
        });
        console.log('NetInfo listener added');
        
        // Kurze Verzögerung für bessere UX
        await new Promise(resolve => setTimeout(resolve, 500));
        
        if (isMounted) {
          setIsReady(true);
          console.log('App ready!');
        }
        
        return unsubscribeNetInfo;
      } catch (error) {
        console.error('App init error:', error);
        if (isMounted) {
          setIsReady(true);
        }
      }
    };
    
    init();
    
    return () => {
      isMounted = false;
    };
  }, [requestAllPermissions, setOnlineStatus]);

  if (!isReady) {
    return <LoadingScreen theme={theme} />;
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
