import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { useCameraPermissions } from 'expo-camera';
import { CameraView } from '../components/Camera/CameraView';
import { PermissionScreen } from '../components/Camera/PermissionScreen';
import { CameraPreview } from '../components/Camera/CameraPreview';

type ScreenState = 'camera' | 'preview' | 'result';

interface CameraScreenProps {
  onScanComplete?: (photoUri: string) => void;
}

export const CameraScreen: React.FC<CameraScreenProps> = ({ onScanComplete }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedPhotoUri, setCapturedPhotoUri] = useState<string | null>(null);
  const [screenState, setScreenState] = useState<ScreenState>('camera');

  const requestCameraPermission = useCallback(async () => {
    try {
      console.log('🔄 Requesting camera permission...');
      const result = await requestPermission();
      console.log('✅ Permission request result:', result);
    } catch (error) {
      console.error('❌ Error requesting camera permission:', error);
    }
  }, [requestPermission]);

  const handleCapture = useCallback((uri: string) => {
    setCapturedPhotoUri(uri);
    setScreenState('preview');
  }, []);

  const handleRetake = useCallback(() => {
    setCapturedPhotoUri(null);
    setScreenState('camera');
  }, []);

  const handleUsePhoto = useCallback(() => {
    if (capturedPhotoUri) {
      setScreenState('result');
      onScanComplete?.(capturedPhotoUri);
    }
  }, [capturedPhotoUri, onScanComplete]);

  const handleClose = useCallback(() => {
    setCapturedPhotoUri(null);
    setScreenState('camera');
  }, []);

  // Show loading indicator if permission state is not yet loaded
  if (!permission) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  // Show permission screen if permission not granted
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#F2F2F7" />
        <PermissionScreen
          permission={permission}
          onRequestPermission={requestCameraPermission}
        />
      </View>
    );
  }

  // Show preview if photo was captured
  if (screenState === 'preview' && capturedPhotoUri) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#F2F2F7" />
        <CameraPreview
          photoUri={capturedPhotoUri}
          onRetake={handleRetake}
          onUsePhoto={handleUsePhoto}
        />
      </View>
    );
  }

  // Show camera view
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="black" />
      <CameraView onCapture={handleCapture} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
  },
});

export default CameraScreen;
