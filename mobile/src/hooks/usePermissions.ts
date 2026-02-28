import { useEffect, useState, useCallback } from 'react';
import { Platform, Alert, Linking } from 'react-native';
import { useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';

export const usePermissions = () => {
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();

  useEffect(() => {
    checkPermissions();
  }, [cameraPermission]);

  const checkPermissions = useCallback(async () => {
    try {
      // Camera permission - check if already granted
      const cameraGranted = cameraPermission?.granted ?? false;
      
      // Location permission
      const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();

      // Media Library permission (for uploading photos)
      const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!cameraGranted || locationStatus !== 'granted' || mediaStatus !== 'granted') {
        Alert.alert(
          'Berechtigungen erforderlich',
          'Tauben Scanner benötigt Kamera-, Standort- und Fotoberechtigungen, um ordnungsgemäß zu funktionieren.',
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
  }, [cameraPermission]);

  const requestPermissions = useCallback(async () => {
    try {
      // Request camera permission explicitly
      await requestCameraPermission();
      
      // Location permission
      await Location.requestForegroundPermissionsAsync();

      // Media Library permission
      await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      // Re-check permissions
      checkPermissions();
    } catch (error) {
      console.error('Permission error:', error);
    }
  }, [requestCameraPermission, checkPermissions]);

  return { permissionsGranted, requestPermissions };
};
