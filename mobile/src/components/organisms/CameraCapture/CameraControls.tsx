import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../../theme';

interface CameraControlsProps {
  flashMode: 'off' | 'on' | 'auto';
  onToggleFlash: () => void;
  onToggleCamera: () => void;
  onCapture: () => void;
  isCapturing: boolean;
}

export const CameraControls: React.FC<CameraControlsProps> = ({
  flashMode,
  onToggleFlash,
  onToggleCamera,
  onCapture,
  isCapturing,
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
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  button: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.3)',
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
