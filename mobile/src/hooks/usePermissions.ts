import { useEffect, useState, useCallback } from 'react';
import { Platform, Alert, Linking } from 'react-native';
import { useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';

export const usePermissions = () => {
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();

  // Nur Berechtigungs-STATUS prüfen (ohne Anfrage!)
  const checkPermissions = useCallback(async () => {
    try {
      setIsChecking(true);
      
      // Camera: Status prüfen (nicht anfragen!)
      const cameraGranted = cameraPermission?.granted ?? false;
      
      // Location: GET (nicht request!)
      const { status: locationStatus } = await Location.getForegroundPermissionsAsync();
      const locationGranted = locationStatus === 'granted';

      // Media Library: GET (nicht request!)
      const { status: mediaStatus } = await ImagePicker.getMediaLibraryPermissionsAsync();
      const mediaGranted = mediaStatus === 'granted';

      const allGranted = cameraGranted && locationGranted && mediaGranted;
      setPermissionsGranted(allGranted);
      setIsChecking(false);
      
      return allGranted;
    } catch (error) {
      console.error('Permission check error:', error);
      setIsChecking(false);
      return false;
    }
  }, [cameraPermission?.granted]);

  // Initial check
  useEffect(() => {
    checkPermissions();
  }, [checkPermissions]);

  // Berechtigungen ANFRAGEN (nur wenn User explizit zustimmt)
  const requestPermissions = useCallback(async () => {
    try {
      setIsChecking(true);
      
      // Request camera via expo-camera hook
      await requestCameraPermission();
      
      // Request location
      await Location.requestForegroundPermissionsAsync();

      // Request media library
      await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      // Re-check status
      const allGranted = await checkPermissions();
      return allGranted;
    } catch (error) {
      console.error('Permission request error:', error);
      setIsChecking(false);
      return false;
    }
  }, [requestCameraPermission, checkPermissions]);

  // Zeigt Einstellungen-Alert nur wenn Berechtigungen fehlen UND User will scan
  const showSettingsAlert = useCallback(() => {
    Alert.alert(
      'Berechtigungen erforderlich',
      'Tauben Scanner benötigt Kamera-, Standort- und Fotoberechtigungen.\n\nBitte aktiviere diese in den Einstellungen.',
      [
        { text: 'Abbrechen', style: 'cancel' },
        { 
          text: 'Einstellungen öffnen', 
          onPress: () => Linking.openSettings() 
        },
      ]
    );
  }, []);

  return { 
    permissionsGranted, 
    isChecking,
    requestPermissions,
    showSettingsAlert,
    checkPermissions
  };
};
