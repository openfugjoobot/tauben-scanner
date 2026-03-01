import React from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Slider } from '@miblanchard/react-native-slider';
import type { CameraType } from 'expo-camera';
import { Text } from '../../atoms/Text';
import { useTheme } from '../../../theme';

interface CameraControlsProps {
  flashMode: 'off' | 'on' | 'auto';
  onToggleFlash: () => void;
  onToggleCamera: () => void;
  onCapture: () => void;
  isCapturing: boolean;
  zoom: number;
  onZoomChange: (zoom: number | number[]) => void;
  cameraType?: CameraType;
}

export const CameraControls: React.FC<CameraControlsProps> = ({
  flashMode,
  onToggleFlash,
  onToggleCamera,
  onCapture,
  isCapturing,
  zoom,
  onZoomChange,
  cameraType = 'back',
}) => {
  const theme = useTheme();

  const getFlashIcon = () => {
    switch (flashMode) {
      case 'on':
        return 'flash';
      case 'auto':
        return 'flash-auto';
      default:
        return 'flash-off';
    }
  };

  // Calculate zoom display value (0.1x to 2.0x)
  const zoomDisplayValue = Math.round((0.1 + zoom * 1.9) * 10) / 10;
  const zoomPercent = Math.round(zoom * 100);

  return (
    <View style={styles.container} pointerEvents="auto">
      {/* Camera Type Indicator - nur Info, kein Button mehr hier */}
      <View style={styles.cameraTypeContainer} pointerEvents="none">
        <View style={styles.cameraTypeBadge}>
          <MaterialCommunityIcons
            name={cameraType === 'back' ? 'camera-rear' : 'camera-front'}
            size={14}
            color="white"
          />
          <Text style={styles.cameraTypeText}>
            {cameraType === 'back' ? 'Rückseite' : 'Front'}
          </Text>
        </View>
      </View>

      {/* Zoom Slider with Indicator */}
      <View style={styles.zoomContainer} pointerEvents="auto">
        <View style={styles.zoomLabelContainer}>
          <Text style={styles.zoomLabel}>{zoomDisplayValue.toFixed(1)}x</Text>
          <Text style={styles.zoomPercentLabel}>({zoomPercent}%)</Text>
        </View>
        <View style={styles.sliderRow}>
          <MaterialCommunityIcons name="magnify-minus" size={20} color="white" />
          <View style={styles.sliderWrapper}>
            <Slider
              value={zoom}
              onValueChange={onZoomChange}
              minimumValue={0}
              maximumValue={1}
              step={0.01}
              thumbTintColor="white"
              minimumTrackTintColor="white"
              maximumTrackTintColor="rgba(255,255,255,0.3)"
            />
          </View>
          <MaterialCommunityIcons name="magnify-plus" size={20} color="white" />
        </View>
      </View>

      {/* Main Controls Row - Flash, Capture, Camera Flip */}
      <View style={styles.buttonsRow} pointerEvents="auto">
        {/* Flash Toggle */}
        <TouchableOpacity
          style={[styles.button, styles.flashButton]}
          onPress={onToggleFlash}
          disabled={isCapturing}
        >
          <MaterialCommunityIcons name={getFlashIcon()} size={28} color="white" />
        </TouchableOpacity>

        {/* Capture Button */}
        <TouchableOpacity
          style={[
            styles.captureButton, 
            isCapturing && styles.disabledButton,
            Platform.OS === 'android' && { elevation: 5 }
          ]}
          onPress={onCapture}
          disabled={isCapturing}
          activeOpacity={0.7}
        >
          <View style={styles.captureInner} />
        </TouchableOpacity>

        {/* Camera Flip - NUR NOCH HIER */}
        <TouchableOpacity
          style={[styles.button, styles.flipButton]}
          onPress={onToggleCamera}
          disabled={isCapturing}
        >
          <MaterialCommunityIcons 
            name="camera-flip" 
            size={28} 
            color="white" 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 40,
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
    elevation: Platform.OS === 'android' ? 2 : 0,
  },
  cameraTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  cameraTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  cameraTypeText: {
    color: 'white',
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '500',
  },
  zoomContainer: {
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    elevation: Platform.OS === 'android' ? 2 : 0,
  },
  zoomLabelContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  zoomLabel: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  zoomPercentLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    marginLeft: 4,
  },
  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  sliderWrapper: {
    flex: 1,
    marginHorizontal: 10,
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  button: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: Platform.OS === 'android' ? 3 : 0,
    zIndex: 2,
  },
  flashButton: {
    elevation: Platform.OS === 'android' ? 3 : 0,
  },
  flipButton: {
    elevation: Platform.OS === 'android' ? 3 : 0,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 5,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    elevation: Platform.OS === 'android' ? 5 : 0,
    zIndex: 3,
  },
  captureInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
  },
  disabledButton: {
    opacity: 0.5,
  },
});
