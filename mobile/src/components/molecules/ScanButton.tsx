import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { Icon } from '../atoms/Icon';
import { useTheme } from '../../theme';
import { spacing } from '../../theme/spacing';

interface ScanButtonProps {
  onPress: () => void;
  disabled?: boolean;
}

export const ScanButton: React.FC<ScanButtonProps> = ({
  onPress,
  disabled = false,
}) => {
  const theme = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        {
          backgroundColor: disabled ? theme.colors.surfaceDisabled : theme.colors.primary,
          shadowColor: theme.colors.primary,
        },
      ]}
      activeOpacity={0.8}
    >
      <Icon name="camera" size={32} color="#fff" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
