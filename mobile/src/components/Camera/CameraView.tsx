import React, { useCallback, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Text,
  Dimensions,
} from 'react-native';
import {
  CameraView as ExpoCameraView,
  CameraType,
  FlashMode,
} from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import {
  CaptureOptimizations,
  getOptimalCameraSettings,
  logPerformance,
} from '../../utils/performance';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface CameraViewProps {
  onCapture: (photoUri: string) => void;
}

export const CameraView: React.FC<CameraViewProps> = ({ onCapture }) => {
  const cameraRef = useRef<ExpoCameraView>(null);
  const [facing, setFacing] = useState<CameraType>('back');
  const [flash, setFlash] = useState<FlashMode>('off');
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureTime, setCaptureTime] = useState<number | null>(null);

  const optimalSettings = getOptimalCameraSettings();

  const toggleFacing = useCallback(() => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  }, []);

  const toggleFlash = useCallback(() => {
    setFlash((current) => {
      switch (current) {
        case 'off':
          return 'on';
        case 'on':
          return 'auto';
        case 'auto':
        default:
          return 'off';
      }
    });
  }, []);

  const getFlashIcon = useCallback((): React.ComponentProps<typeof Ionicons>['name'] => {
    switch (flash) {
      case 'on':
        return 'flash' as const;
      case 'auto':
        return 'flash-outline' as const;
      case 'off':
      default:
        return 'flash-off' as const;
    }
  }, [flash]);

  const takePicture = useCallback(async () => {
    if (!cameraRef.current || isCapturing) return;

    setIsCapturing(true);
    const startTime = performance.now();

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: optimalSettings.quality,
        base64: false,
        skipProcessing: CaptureOptimizations.skipProcessing,
        exif: true,
      });
      
      const duration = performance.now() - startTime;
      
      logPerformance('Photo Capture', duration);
      setCaptureTime(duration);

      // Check if target is met
      if (duration > CaptureOptimizations.maxCaptureTime) {
        console.warn(`⚠️ Capture time exceeded target: ${duration.toFixed(2)}ms (target: ${CaptureOptimizations.maxCaptureTime}ms)`);
      }

      if (photo?.uri) {
        onCapture(photo.uri);
      }
    } catch (error) {
      console.error('❌ Error taking picture:', error);
    } finally {
      setIsCapturing(false);
    }
  }, [isCapturing, onCapture, optimalSettings.quality]);

  return (
    <View style={styles.container}>
      <ExpoCameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
        flash={flash}
        mode="picture"
        zoom={0}
      >
        {/* Top Controls */}
        <View style={styles.topControls}>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={toggleFlash}
            activeOpacity={0.7}
            accessibilityLabel="Blitz umschalten"
            accessibilityHint="Wechselt zwischen Blitz Ein, Aus und Auto"
          >
            <Ionicons name={getFlashIcon()} size={28} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.controlButton}
            onPress={toggleFacing}
            activeOpacity={0.7}
            testID="camera-switch-button"
            accessibilityLabel="Kamera umschalten"
            accessibilityHint="Wechselt zwischen Front- und Rückkamera"
          >
            <Ionicons name="camera-reverse" size={28} color="white" />
          </TouchableOpacity>
        </View>

        {/* Performance Indicator */}
        {captureTime !== null && (
          <View style={styles.performanceBadge}>
            <Text style={styles.performanceText}>
              {captureTime < 200 ? '✅' : '⚠️'} {captureTime.toFixed(0)}ms
            </Text>
          </View>
        )}

        {/* Bottom Controls */}
        <View style={styles.bottomControls}>
          <View style={styles.captureContainer}>
            <TouchableOpacity
              style={styles.captureButton}
              onPress={takePicture}
              disabled={isCapturing}
              activeOpacity={0.8}
              testID="capture-button"
              accessibilityLabel="Foto aufnehmen"
              accessibilityHint="Nimmt ein Foto mit der aktuellen Kamera auf"
            >
              <View style={styles.captureButtonOuter}>
                <View style={[
                  styles.captureButtonInner,
                  isCapturing && styles.captureButtonInnerActive,
                ]} />
              </View>
            </TouchableOpacity>
          </View>

          {isCapturing && (
            <View style={styles.capturingOverlay}>
              <ActivityIndicator size="large" color="white" />
              <Text style={styles.capturingText}>Wird aufgenommen...</Text>
            </View>
          )}
        </View>
      </ExpoCameraView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  performanceBadge: {
    position: 'absolute',
    top: 120,
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  performanceText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  bottomControls: {
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  captureContainer: {
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonOuter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'white',
  },
  captureButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'white',
  },
  captureButtonInnerActive: {
    transform: [{ scale: 0.8 }],
  },
  capturingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  capturingText: {
    color: 'white',
    marginTop: 12,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CameraView;
