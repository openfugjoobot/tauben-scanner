import { useState, useCallback, useRef } from 'react';
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

export const useCameraCapture = (): [CameraCaptureState, CameraCaptureActions, React.RefObject<CameraView>] => {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  
  const [cameraType, setCameraType] = useState<CameraType>('back');
  const [flashMode, setFlashMode] = useState<'off' | 'on' | 'auto'>('off');
  const [zoom, setZoom] = useState(0);
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<{ uri: string; base64: string } | null>(null);

  const toggleCameraType = useCallback(() => {
    setCameraType((prev) => (prev === 'back' ? 'front' : 'back'));
    setZoom(0); // Reset zoom on camera flip
  }, []);

  const toggleFlash = useCallback(() => {
    setFlashMode((prev) => {
      if (prev === 'off') return 'on';
      if (prev === 'on') return 'auto';
      return 'off';
    });
  }, []);

  const takePhoto = useCallback(async () => {
    if (!cameraRef.current || !permission?.granted) return;

    setIsCapturing(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: true,
        exif: false,
      });

      if (photo) {
        // Compress image
        const manipulated = await ImageManipulator.manipulateAsync(
          photo.uri,
          [{ resize: { width: 1024 } }],
          { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG, base64: true }
        );

        setCapturedPhoto({
          uri: manipulated.uri,
          base64: manipulated.base64 || '',
        });
      }
    } catch (error) {
    console.error('Fehler beim Aufnehmen des Fotos:', error);
      Alert.alert(
        'Fehler',
        'Das Foto konnte nicht aufgenommen werden. Bitte überprüfen Sie die Berechtigungen und versuchen Sie es erneut.',
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

  return [state, actions, cameraRef];
};
