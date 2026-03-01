import { useState, useCallback, useRef, useEffect } from 'react';
import { Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';
import type { CameraType } from 'expo-camera';

export interface CameraCaptureState {
  permission: ReturnType<typeof useCameraPermissions>[0];
  requestPermission: ReturnType<typeof useCameraPermissions>[1];
  cameraType: CameraType;
  flashMode: 'off' | 'on' | 'auto';
  zoom: number;
  isCapturing: boolean;
  capturedPhoto: { uri: string; base64: string } | null;
}

export interface CameraCaptureActions {
  toggleCameraType: () => void;
  toggleFlash: () => void;
  setZoom: (zoom: number) => void;
  takePhoto: () => Promise<void>;
  retakePhoto: () => void;
  confirmPhoto: () => { uri: string; base64: string } | null;
}

export const useCameraCapture = (): [
  CameraCaptureState,
  CameraCaptureActions,
  React.RefObject<CameraView>,
  string | null,  // cameraError
  () => void     // clearError
] => {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  
  const [cameraType, setCameraType] = useState<CameraType>('back');
  const [flashMode, setFlashMode] = useState<'off' | 'on' | 'auto'>('off');
  const [zoom, setZoomState] = useState(0);
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<{ uri: string; base64: string } | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  
  // Ref for debouncing zoom changes (300ms)
  const zoomTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pendingZoomRef = useRef<number>(0);

  // Debounced zoom setter with 300ms delay
  const setZoom = useCallback((value: number | number[]) => {
    // Handle slider returning array [value]
    const normalizedValue = Array.isArray(value) ? value[0] : value;
    
    // Clamp zoom between 0.1x (0) and 2.0x (1)
    // Expo Camera zoom: 0 = minimum zoom, 1 = maximum zoom
    const clampedValue = Math.max(0, Math.min(1, normalizedValue));
    
    // Clear existing timeout
    if (zoomTimeoutRef.current) {
      clearTimeout(zoomTimeoutRef.current);
    }
    
    // Store pending value for immediate UI feedback
    pendingZoomRef.current = clampedValue;
    
    // Debounce the actual state update
    zoomTimeoutRef.current = setTimeout(() => {
      setZoomState(pendingZoomRef.current);
    }, 300); // 300ms debounce
  }, []);

  // Cleanup zoom timeout on unmount
  useEffect(() => {
    return () => {
      if (zoomTimeoutRef.current) {
        clearTimeout(zoomTimeoutRef.current);
      }
    };
  }, []);

  const clearError = useCallback(() => {
    setCameraError(null);
  }, []);

  const toggleCameraType = useCallback(() => {
    setCameraType((prev) => {
      const newType = prev === 'back' ? 'front' : 'back';
      return newType;
    });
    // Reset zoom when switching cameras (front/back have different zoom ranges)
    setZoomState(0);
    pendingZoomRef.current = 0;
    if (zoomTimeoutRef.current) {
      clearTimeout(zoomTimeoutRef.current);
    }
  }, []);

  const toggleFlash = useCallback(() => {
    setFlashMode((prev) => {
      if (prev === 'off') return 'on';
      if (prev === 'on') return 'auto';
      return 'off';
    });
  }, []);

  const takePhoto = useCallback(async () => {
    if (!cameraRef.current || !permission?.granted) {
      setCameraError('Kamera nicht bereit oder keine Berechtigung');
      return;
    }

    setIsCapturing(true);
    setCameraError(null);
    
    try {
      // Verify camera type is set correctly before capture
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: true,
        exif: true, // Enable EXIF to verify camera type
      });

      if (!photo) {
        throw new Error('Kamera hat kein Foto zurückgegeben');
      }

      // Verify camera type from EXIF data if available
      if (photo.exif) {
        const lensFacing = photo.exif.LensFacing;
        const actualType = lensFacing === 'FRONT' ? 'front' : 'back';
        if (actualType !== cameraType) {
          console.warn(`[Camera] Kamera-Typ stimmt nicht überein: erwartet ${cameraType}, erhalten ${actualType}`);
        }
      }

      // Compress image
      const manipulated = await ImageManipulator.manipulateAsync(
        photo.uri,
        [{ resize: { width: 1024 } }],
        { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG, base64: true }
      );

      if (!manipulated.base64) {
        throw new Error('Bild konnte nicht verarbeitet werden');
      }

      setCapturedPhoto({
        uri: manipulated.uri,
        base64: manipulated.base64,
      });
    } catch (error) {
      console.error('[Camera] Fehler beim Aufnehmen des Fotos:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unbekannter Kamerafehler';
      setCameraError(`Fehler aufgetreten: ${errorMessage}`);
      
      // Also show native alert for critical errors
      Alert.alert(
        'Kamerafehler',
        'Das Foto konnte nicht aufgenommen werden. Bitte prüfen Sie die Berechtigungen und versuchen Sie es erneut.',
        [
          { text: 'Abbrechen', style: 'cancel' },
          { text: 'Erneut versuchen', onPress: () => takePhoto() }
        ]
      );
    } finally {
      setIsCapturing(false);
    }
  }, [permission, cameraType]);

  const retakePhoto = useCallback(() => {
    setCapturedPhoto(null);
    setCameraError(null);
  }, []);

  const confirmPhoto = useCallback(() => {
    return capturedPhoto;
  }, [capturedPhoto]);

  const state: CameraCaptureState = {
    permission,
    requestPermission,
    cameraType,
    flashMode,
    zoom,
    isCapturing,
    capturedPhoto,
  };

  const actions: CameraCaptureActions = {
    toggleCameraType,
    toggleFlash,
    setZoom,
    takePhoto,
    retakePhoto,
    confirmPhoto,
  };

  return [state, actions, cameraRef, cameraError, clearError];
};
