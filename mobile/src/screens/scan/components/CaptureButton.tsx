import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { useTheme } from '../../../theme';

interface CaptureButtonProps {
  onPress: () => void;
  disabled?: boolean;
}

export const CaptureButton: React.FC<CaptureButtonProps> = ({ onPress, disabled }) => {
  const theme = useTheme();
  return (
    <TouchableOpacity 
      onPress={onPress} 
      disabled={disabled}
      style={styles.container}
      activeOpacity={0.7}
    >
      <View style={[styles.outerCircle, { borderColor: theme.colors.onSurface }]}＞
        <View style={[styles.innerCircle, { backgroundColor: theme.colors.onSurface }]} />
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
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  innerCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
});
