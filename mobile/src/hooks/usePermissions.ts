import { useEffect, useState } from 'react';
import { Platform, Alert, Linking } from 'react-native';
import * as Camera from 'expo-camera';
import * as Location from 'expo-location';

export const usePermissions = () => {
  const [permissionsGranted, setPermissionsGranted] = useState(false);

  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    try {
      // Camera permission
      const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
      
      // Location permission
      const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();

      if (cameraStatus !== 'granted' || locationStatus !== 'granted') {
        Alert.alert(
          'Berechtigungen erforderlich',
          'Tauben Scanner benötigt Kamera- und Standortberechtigungen, um ordnungsgemäß zu funktionieren.',
          [
            { text: 'Abbrechen', style: 'cancel' },
            { 
              text: 'Einstellungen öffnen', 
              onPress: () => Linking.openSettings() 
            },
          ]
        );
      } else {
        setPermissionsGranted(true);
      }
    } catch (error) {
      console.error('Permission error:', error);
    }
  };

  return { permissionsGranted, requestPermissions };
};
