import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Slider } from '@miblanchard/react-native-slider';
import { useTheme } from '../../../theme';

interface CameraControlsProps {
  flashMode: 'off' | 'on' | 'auto';
  onToggleFlash: () => void;
  onToggleCamera: () => void;
  onCapture: () => void;
  isCapturing: boolean;
  zoom: number;
  onZoomChange: (zoom: number) => void;
}

export const CameraControls: React.FC<CameraControlsProps> = ({
  flashMode,
  onToggleFlash,
  onToggleCamera,
  onCapture,
  isCapturing,
  zoom,
  onZoomChange,
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

  return (
    <View style={styles.container}>
      <View style={styles.zoomContainer}>
        <MaterialCommunityIcons name="magnify-minus" size={20} color="white" />
        <View style={styles.sliderWrapper}>
          <Slider
            value={zoom}
            onValueChange={(value) => onZoomChange(Array.isArray(value) ? value[0] : value)}
            minimumValue={0}
            maximumValue={0.1} // Expo Zoom scales approx 0 to 1, but 0.1 is already significant on mobile
            step={0.001}
            thumbTintColor="white"
            minimumTrackTintColor="white"
            maximumTrackTintColor="rgba(255,255,255,0.3)"
          />
        </View>
        <MaterialCommunityIcons name="magnify-plus" size={20} color="white" />
      </View>

      <View style={styles.buttonsRow}>
        <TouchableOpacity
          style={styles.button}
          onPress={onToggleFlash}
          disabled={isCapturing}
        >
          <MaterialCommunityIcons name={getFlashIcon()} size={28} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.captureButton, isCapturing && styles.disabledButton]}
          onPress={onCapture}
          disabled={isCapturing}
        >
          <View style={styles.captureInner} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={onToggleCamera}
          disabled={isCapturing}
        >
          <MaterialCommunityIcons name="camera-flip" size={28} color="white" />
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
    pointerEvents: 'box-none',
  },
  zoomContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  sliderWrapper: {
    flex: 1,
    marginHorizontal: 10,
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    pointerEvents: 'box-none',
  },
  button: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
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
