import React, { useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Platform, Linking } from 'react-native';
import { CameraView } from 'expo-camera';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from '../../atoms/Text';
import { Button } from '../../atoms/Button';
import { useCameraCapture } from './useCameraCapture';
import { CameraControls } from './CameraControls';
import { PhotoPreview } from './PhotoPreview';
import { useTheme } from '../../../theme';

interface CameraCaptureProps {
  onPhotoCaptured: (photo: { uri: string; base64: string }) => void;
  onCancel?: () => void;
  skipPreview?: boolean;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({
  onPhotoCaptured,
  onCancel,
  skipPreview = false,
}) => {
  const theme = useTheme();
  const [state, actions, cameraRef, cameraError, clearError] = useCameraCapture();

  // Auto-confirm if skipPreview is true
  React.useEffect(() => {
    if (skipPreview && state.capturedPhoto) {
      onPhotoCaptured(state.capturedPhoto);
      actions.retakePhoto();
    }
  }, [skipPreview, state.capturedPhoto, onPhotoCaptured, actions]);

  // Show preview if photo captured (and not skipping)
  if (!skipPreview && state.capturedPhoto) {
    return (
      <PhotoPreview
        photo={state.capturedPhoto}
        onRetake={actions.retakePhoto}
        onConfirm={() => onPhotoCaptured(state.capturedPhoto!)}
      />
    );
  }

  // Permission handling
  if (!state.permission) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  // Permission denied - Show open settings button
  if (!state.permission.granted) {
    const canOpenSettings = state.permission.canAskAgain === false;
    
    return (
      <View style={styles.centered}>
        <MaterialCommunityIcons 
          name="camera-off" 
          size={64} 
          color={theme.colors.error || '#FF6B6B'} 
          style={styles.permissionIcon}
        />
        <Text variant="h3" center>Kamera-Berechtigung benötigt</Text>
        <Text variant="body" center style={styles.permissionText}>
          Die App benötigt Zugriff auf die Kamera, um Tauben zu scannen.
        </Text>
        <Button variant="primary" onPress={state.requestPermission}>
          Berechtigung erteilen
        </Button>
        {canOpenSettings && (
          <Button 
            variant="secondary" 
            onPress={() => Linking.openSettings()}
            style={{ marginTop: 8 }}
          >
            Einstellungen öffnen
          </Button>
        )}
        {onCancel && (
          <Button variant="ghost" onPress={onCancel} style={{ marginTop: 8 }}>
            Abbrechen
          </Button>
        )}
      </View>
    );
  }

  // Error state - Show retry button
  if (cameraError) {
    return (
      <View style={styles.centered}>
        <MaterialCommunityIcons 
          name="alert-circle" 
          size={64} 
          color={theme.colors.error || '#FF6B6B'} 
          style={styles.errorIcon}
        />
        <Text variant="h3" center style={styles.errorTitle}>
          Kamerafehler
        </Text>
        <Text variant="body" center style={styles.errorText}>
          {cameraError}
        </Text>
        <Button variant="primary" onPress={clearError}>
          Erneut versuchen
        </Button>
        {onCancel && (
          <Button variant="ghost" onPress={onCancel} style={{ marginTop: 8 }}>
            Abbrechen
          </Button>
        )}
      </View>
    );
  }

  // Camera view
  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={state.cameraType}
        flash={state.flashMode}
        zoom={state.zoom}
        enableTorch={state.flashMode === 'on'}
      />
      
      {/* Controls overlay with proper pointer events handling for Android */}
      <View 
        style={styles.controlsOverlay}
        pointerEvents="box-none"
      >
        <CameraControls
          flashMode={state.flashMode}
          onToggleFlash={actions.toggleFlash}
          onToggleCamera={actions.toggleCameraType}
          onCapture={actions.takePhoto}
          isCapturing={state.isCapturing}
          zoom={state.zoom}
          onZoomChange={actions.setZoom}
          cameraType={state.cameraType}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    // Establish positioning context for absolute children
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
  controlsOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    // zIndex and elevation for Android
    zIndex: 1,
    elevation: Platform.OS === 'android' ? 1 : 0,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: '#000',
  },
  permissionIcon: {
    marginBottom: 16,
  },
  permissionText: {
    marginVertical: 16,
    textAlign: 'center',
    color: '#fff',
  },
  errorIcon: {
    marginBottom: 16,
  },
  errorTitle: {
    color: '#fff',
    marginBottom: 8,
  },
  errorText: {
    marginVertical: 16,
    textAlign: 'center',
    color: '#fff',
  },
});
