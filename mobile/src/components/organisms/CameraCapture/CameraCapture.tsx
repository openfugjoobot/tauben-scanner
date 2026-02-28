import React, { useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { CameraView } from 'expo-camera';
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
  const [state, actions, cameraRef] = useCameraCapture();

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

  if (!state.permission.granted) {
    return (
      <View style={styles.centered}>
        <Text variant="h3" center>Kamera-Berechtigung benötigt</Text>
        <Text variant="body" center style={styles.permissionText}>
          Die App benötigt Zugriff auf die Kamera, um Tauben zu scannen.
        </Text>
        <Button variant="primary" onPress={state.requestPermission}>
          Berechtigung erteilen
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
      
      <View style={styles.controlsOverlay}>
        <CameraControls
          flashMode={state.flashMode}
          onToggleFlash={actions.toggleFlash}
          onToggleCamera={actions.toggleCameraType}
          onCapture={actions.takePhoto}
          isCapturing={state.isCapturing}
          zoom={state.zoom}
          onZoomChange={actions.setZoom}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  controlsOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    pointerEvents: 'auto',
    zIndex: 999,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  permissionText: {
    marginVertical: 16,
    textAlign: 'center',
  },
});
