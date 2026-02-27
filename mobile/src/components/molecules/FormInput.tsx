import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Text } from '../atoms/Text';
import { Icon, IconName } from '../atoms/Icon';
import { useTheme } from '../../theme';
import { spacing } from '../../theme/spacing';

interface FormInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  helper?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  leftIcon?: IconName;
  rightIcon?: IconName;
  onRightIconPress?: () => void;
  disabled?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  maxLength?: number;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  helper,
  secureTextEntry,
  keyboardType = 'default',
  autoCapitalize = 'none',
  leftIcon,
  rightIcon,
  onRightIconPress,
  disabled,
  multiline,
  numberOfLines,
  maxLength,
}) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Text variant="caption" style={{ marginBottom: 4, color: theme.colors.onSurfaceVariant }}>
        {label}
      </Text>
      
      <View
        style={[
          styles.inputContainer,
          {
            borderColor: error ? theme.colors.error : theme.colors.outline,
            backgroundColor: disabled ? theme.colors.surfaceDisabled : theme.colors.surface,
          },
        ]}
      >
        {leftIcon && (
          <Icon name={leftIcon} size={20} color={theme.colors.onSurfaceVariant} style={styles.leftIcon} />
        )}
        
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.onSurfaceDisabled}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          editable={!disabled}
          multiline={multiline}
          numberOfLines={numberOfLines}
          maxLength={maxLength}
          style={[
            styles.input,
            { color: theme.colors.onSurface },
            multiline && { minHeight: 80, textAlignVertical: 'top' },
          ]}
        />
        
        {rightIcon && (
          <Icon
            name={rightIcon}
            size={20}
            color={theme.colors.onSurfaceVariant}
            onPress={onRightIconPress}
            style={styles.rightIcon}
          />
        )}
      </View>
      
      {(error || helper) && (
        <Text
          variant="caption"
          style={{
            marginTop: 4,
            color: error ? theme.colors.error : theme.colors.onSurfaceVariant,
          }}
        >
          {error || helper}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    minHeight: 48,
  },
  leftIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    padding: 0,
  },
  rightIcon: {
    marginLeft: 8,
  },
});
