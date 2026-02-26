/**
 * SettingToggle Component
 * Switch Component für Einstellungen
 * T9: Settings Screen
 */

import React, {useState, useCallback, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  SwitchProps,
  ViewStyle,
  TextStyle,
} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';

export interface SettingToggleProps {
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  title: string;
  description?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  trackColor?: {
    false?: string;
    true?: string;
  };
  thumbColor?: {
    false?: string;
    true?: string;
  };
  style?: ViewStyle;
  titleStyle?: TextStyle;
  descriptionStyle?: TextStyle;
  testID?: string;
  
  // Optional: Async validation
  validate?: (value: boolean) => Promise<boolean> | boolean;
  onValidationFailed?: () => void;
}

export const SettingToggle: React.FC<SettingToggleProps> = ({
  icon,
  title,
  description,
  value,
  onValueChange,
  disabled = false,
  trackColor = {},
  thumbColor = {},
  style,
  titleStyle,
  descriptionStyle,
  testID,
  validate,
  onValidationFailed,
}) => {
  const [isEnabled, setIsEnabled] = useState(value);
  const [isProcessing, setIsProcessing] = useState(false);

  // Sync with external value
  useEffect(() => {
    setIsEnabled(value);
  }, [value]);

  const handleToggle = useCallback(
    async (newValue: boolean) => {
      if (disabled || isProcessing) return;

      setIsProcessing(true);

      try {
        // Optional validation
        if (validate) {
          const isValid = await validate(newValue);
          if (!isValid) {
            setIsProcessing(false);
            onValidationFailed?.();
            return;
          }
        }

        setIsEnabled(newValue);
        onValueChange(newValue);
      } catch (error) {
        console.error('Toggle error:', error);
        // Revert on error
        setIsEnabled(value);
      } finally {
        setIsProcessing(false);
      }
    },
    [disabled, isProcessing, onValueChange, validate, onValidationFailed, value]
  );

  const trackColors: SwitchProps['trackColor'] = {
    false: trackColor.false || '#ECF0F1',
    true: trackColor.true || '#4A90D9',
    ...trackColor,
  };

  const thumbColors = {
    false: thumbColor.false || '#95A5A6',
    true: thumbColor.true || 'white',
    ...thumbColor,
  };

  return (
    <View style={[styles.container, disabled && styles.disabled, style]} testID={testID}>
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons name={icon} size={24} color="#4A90D9" />
      </View>

      <View style={styles.content}>
        <Text style={[styles.title, titleStyle]}>{title}</Text>
        {description && (
          <Text style={[styles.description, descriptionStyle]}>{description}</Text>
        )}
      </View>

      <Switch
        value={isEnabled}
        onValueChange={handleToggle}
        disabled={disabled || isProcessing}
        trackColor={trackColors}
        thumbColor={isEnabled ? thumbColors.true : thumbColors.false}
        ios_backgroundColor="#ECF0F1"
        accessibilityRole="switch"
        accessibilityLabel={title}
        accessibilityState={{checked: isEnabled, disabled: disabled || isProcessing}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
  },
  disabled: {
    opacity: 0.5,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#EBF4FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    color: '#2C3E50',
    fontWeight: '500',
  },
  description: {
    fontSize: 12,
    color: '#7F8C8D',
    marginTop: 2,
  },
});

export default SettingToggle;
