import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';

interface CaptureButtonProps {
  onPress: () => void;
  disabled?: boolean;
}

export const CaptureButton: React.FC<CaptureButtonProps> = ({ onPress, disabled }) => {
  return (
    <TouchableOpacity 
      onPress={onPress} 
      disabled={disabled}
      style={styles.container}
      activeOpacity={0.7}
    >
      <View style={styles.outerCircle}>
        <View style={styles.innerCircle} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  innerCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'white',
  },
});
