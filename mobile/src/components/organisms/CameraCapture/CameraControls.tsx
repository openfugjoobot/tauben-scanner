import React from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Slider } from '@miblanchard/react-native-slider';
import type { CameraType } from 'expo-camera';
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
    <View style={styles.container} pointerEvents="auto">
      {/* Zoom Slider - ohne Anzeige */}
      <View style={styles.zoomContainer} pointerEvents="auto">
        <View style={styles.sliderRow}>
          <MaterialCommunityIcons name="magnify-minus" size={20} color="white" style={styles.icon} />
          <View style={styles.sliderWrapper}>
            <Slider
              value={zoom}
              onValueChange={onZoomChange}
              minimumValue={0}
              maximumValue={1}
              step={0.01}
              thumbTintColor={theme.colors.primary}
              minimumTrackTintColor={theme.colors.primary}
              maximumTrackTintColor="rgba(255,255,255,0.3)"
              trackStyle={styles.track}
              thumbStyle={styles.thumb}
            />
          </View>
          <MaterialCommunityIcons name="magnify-plus" size={20} color="white" style={styles.icon} />
        </View>
      </View>

      {/* Main Controls - Material Design 3 Stil */}
      <View style={styles.controlsContainer} pointerEvents="auto">
        {/* Flash Toggle - MD3 Icon Button */}
        <TouchableOpacity
          style={[
            styles.iconButton,
            { backgroundColor: theme.colors.surfaceVariant + '80' }
          ]}
          onPress={onToggleFlash}
          disabled={isCapturing}
        >
          <MaterialCommunityIcons 
            name={getFlashIcon()} 
            size={24} 
            color="white" 
          />
        </TouchableOpacity>

        {/* Capture Button - Simple Shutter Style */}
        <TouchableOpacity
          style={[
            styles.captureButton,
            { borderColor: 'white' },
            isCapturing && styles.disabledButton,
          ]}
          onPress={onCapture}
          disabled={isCapturing}
          activeOpacity={1}
        >
          <View 
            style={[
              styles.captureInner,
              { backgroundColor: isCapturing ? '#CCCCCC' : 'white' }
            ]} 
          />
        </TouchableOpacity>

        {/* Placeholder für Symmetrie */}
        <View style={styles.spacer} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 40,
    paddingHorizontal: 24,
    backgroundColor: 'transparent',
  },
  zoomContainer: {
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  icon: {
    opacity: 0.8,
  },
  sliderWrapper: {
    flex: 1,
    marginHorizontal: 16,
  },
  track: {
    height: 4,
    borderRadius: 2,
  },
  thumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    // Material 3 elevation
    elevation: Platform.OS === 'android' ? 2 : 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  captureButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: 'white',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  spacer: {
    width: 48,
    height: 48,
  },
  disabledButton: {
    opacity: 0.6,
  },
});