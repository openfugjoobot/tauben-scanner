import React from 'react';
import { TouchableOpacity, ActivityIndicator, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Text } from '../../../components/atoms/Text';
import { Icon } from '../../../components/atoms/Icon';
import { useTheme } from '../../../theme';

export interface SaveButtonProps {
  isValid: boolean;
  isSubmitting: boolean;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

export const SaveButton: React.FC<SaveButtonProps> = ({
  isValid,
  isSubmitting,
  onPress,
  style,
}) => {
  const theme = useTheme();

  const backgroundColor = isValid ? theme.colors.primary : theme.colors.surfaceDisabled;
  const textColor = isValid ? theme.colors.onPrimary : theme.colors.onSurfaceDisabled;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!isValid || isSubmitting}
      style={[
        styles.button,
        {
          backgroundColor,
        },
        style,
      ]}
    >
      {isSubmitting ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <>
          <Icon name="content-save" size={20} color={textColor} style={styles.icon} />
          <Text variant="button" style={{ color: textColor }}>
            Speichern
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  icon: {
    marginRight: 8,
  },
});
