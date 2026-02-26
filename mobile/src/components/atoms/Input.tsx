import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Text } from './Text';
import { Icon } from './Icon';
import { useTheme } from '../../theme';

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  leftIcon?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
  disabled?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
}

export const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  secureTextEntry,
  keyboardType = 'default',
  autoCapitalize = 'none',
  leftIcon,
  rightIcon,
  onRightIconPress,
  disabled,
  multiline,
  numberOfLines,
}) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      {label && (
        <Text variant="caption" style={{ marginBottom: 4, color: theme.colors.onSurfaceVariant }}>
          {label}
        </Text>
      )}
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
          <Icon name={leftIcon as any} size={20} color={theme.colors.onSurfaceVariant} style={styles.leftIcon} />
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
          style={[
            styles.input,
            { color: theme.colors.onSurface },
            multiline && { minHeight: 80, textAlignVertical: 'top' },
          ]}
        />
        
        {rightIcon && (
          <Icon
            name={rightIcon as any}
            size={20}
            color={theme.colors.onSurfaceVariant}
            onPress={onRightIconPress}
            style={styles.rightIcon}
          />
        )}
      </View>
      
      {error && (
        <Text variant="caption" style={{ marginTop: 4, color: theme.colors.error }}>
          {error}
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
    paddingVertical: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
});
