import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Platform, Linking, TouchableOpacity, GestureResponderEvent, PanResponder } from 'react-native';
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

  // Pinch-to-Zoom State
  const [initialPinch, setInitialPinch] = useState<{ distance: number; zoom: number } | null>(null);

  // Handlers für Pinch-Zoom
  const handlePanResponderGrant = useCallback(() => {
    setInitialPinch(null);
  }, []);

  const handlePanResponderMove = useCallback((evt: GestureResponderEvent) => {
    const touches = evt.nativeEvent.touches;
    
    if (touches.length === 2) {
      const dx = touches[0].pageX - touches[1].pageX;
      const dy = touches[0].pageY - touches[1].pageY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (!initialPinch) {
        setInitialPinch({ distance, zoom: state.zoom });
      } else {
        const scale = distance / initialPinch.distance;
        // Sensitivität: 0.5x Scale = 0.25x Zoom-Änderung
        const zoomDelta = (scale - 1) * 0.5;
        const newZoom = Math.max(0, Math.min(1, initialPinch.zoom + zoomDelta));
        actions.setZoom(newZoom);
      }
    }
  }, [initialPinch, state.zoom, actions]);

  const handlePanResponderRelease = useCallback(() => {
    setInitialPinch(null);
  }, []);

  const panResponder = React.useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: (_evt, gestureState) => {
      // Nur bei Pinch (2 Finger) oder großen Bewegungen
      return gestureState.numberActiveTouches === 2 || Math.abs(gestureState.dx) > 5;
    },
    onPanResponderGrant: handlePanResponderGrant,
    onPanResponderMove: handlePanResponderMove,
    onPanResponderRelease: handlePanResponderRelease,
    onPanResponderTerminate: handlePanResponderRelease,
  }), [handlePanResponderGrant, handlePanResponderMove, handlePanResponderRelease]);

  // Auto-confirm if skipPreview is true
  useEffect(() => {
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
        onCancel={onCancel}
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
      {/* Close Button - MD3 Icon Button oben rechts */}
      {onCancel && (
        <TouchableOpacity
          style={[styles.closeButton, { backgroundColor: theme.colors.surface + 'CC' }]}
          onPress={onCancel}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <MaterialCommunityIcons
            name="close"
            size={24}
            color={theme.colors.onSurface}
          />
        </TouchableOpacity>
      )}

      {/* Camera mit Pan-Handler für Pinch */}
      <View style={styles.cameraContainer} {...panResponder.panHandlers}>
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing={state.cameraType}
          flash="off"
          zoom={state.zoom}
          enableTorch={false}
        />
      </View>
      
      {/* Controls overlay */}
      <View style={styles.controlsOverlay} pointerEvents="box-none">
        <CameraControls
          flashMode={state.flashMode}
          onToggleFlash={actions.toggleFlash}
          onToggleCamera={actions.toggleCameraType}
          onCapture={actions.takePhoto}
          isCapturing={state.isCapturing}
          zoom={state.zoom}
          onZoomChange={(zoom) => actions.setZoom(Array.isArray(zoom) ? zoom[0] : zoom)}
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
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    elevation: 5,
    // MD3: Surface color with 80% opacity
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    ...StyleSheet.absoluteFillObject,
  },
  controlsOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
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
