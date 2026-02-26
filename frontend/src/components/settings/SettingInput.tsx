/**
 * SettingInput Component
 * Text Input mit Validierung für Einstellungen
 * T9: Settings Screen
 */

import React, {useState, useCallback, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';

export interface SettingInputValidation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => boolean | string;
}

export interface SettingInputProps {
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  title: string;
  description?: string;
  value: string;
  onValueChange: (value: string, isValid: boolean) => void;
  onSubmit?: (value: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: TextInputProps['keyboardType'];
  autoCapitalize?: TextInputProps['autoCapitalize'];
  autoCorrect?: boolean;
  disabled?: boolean;
  validation?: SettingInputValidation;
  maxLength?: number;
  style?: ViewStyle;
  titleStyle?: TextStyle;
  descriptionStyle?: TextStyle;
  inputStyle?: TextStyle;
  errorStyle?: TextStyle;
  testID?: string;
  
  // Validation messages
  errorMessages?: {
    required?: string;
    minLength?: string;
    maxLength?: string;
    pattern?: string;
    custom?: string;
  };
  
  // Action button
  actionButton?: {
    icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
    onPress: () => void;
    loading?: boolean;
  };
  
  // Show validation status
  showValidationStatus?: boolean;
}

export const SettingInput: React.FC<SettingInputProps> = ({
  icon,
  title,
  description,
  value,
  onValueChange,
  onSubmit,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  autoCorrect = false,
  disabled = false,
  validation,
  maxLength,
  style,
  titleStyle,
  descriptionStyle,
  inputStyle,
  errorStyle,
  testID,
  errorMessages = {},
  actionButton,
  showValidationStatus = true,
}) => {
  const [localValue, setLocalValue] = useState(value);
  const [error, setError] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [isSecure, setIsSecure] = useState(secureTextEntry);
  const inputRef = useRef<TextInput>(null);

  const defaultMessages = {
    required: 'Dieses Feld ist erforderlich',
    minLength: `Mindestens ${validation?.minLength} Zeichen erforderlich`,
    maxLength: `Maximal ${validation?.maxLength} Zeichen erlaubt`,
    pattern: 'Ungültiges Format',
    custom: 'Ungültige Eingabe',
    ...errorMessages,
  };

  // Sync with external value
  useEffect(() => {
    if (value !== localValue && !isFocused) {
      setLocalValue(value);
      validateValue(value);
    }
  }, [value, isFocused]);

  const validateValue = useCallback(
    (text: string): boolean => {
      if (!validation) {
        setError(null);
        return true;
      }

      // Required check
      if (validation.required && (!text || text.trim().length === 0)) {
        setError(defaultMessages.required);
        return false;
      }

      // Min length check
      if (validation.minLength && text.length < validation.minLength) {
        setError(defaultMessages.minLength);
        return false;
      }

      // Max length check
      if (validation.maxLength && text.length > validation.maxLength) {
        setError(defaultMessages.maxLength);
        return false;
      }

      // Pattern check
      if (validation.pattern && !validation.pattern.test(text)) {
        setError(defaultMessages.pattern);
        return false;
      }

      // Custom validation
      if (validation.custom) {
        const result = validation.custom(text);
        if (result !== true) {
          setError(typeof result === 'string' ? result : defaultMessages.custom);
          return false;
        }
      }

      setError(null);
      return true;
    },
    [validation, defaultMessages]
  );

  const handleChangeText = useCallback(
    (text: string) => {
      setLocalValue(text);
      const isValid = validateValue(text);
      onValueChange(text, isValid);
    },
    [onValueChange, validateValue]
  );

  const handleSubmit = useCallback(() => {
    Keyboard.dismiss();
    const isValid = validateValue(localValue);
    if (isValid && onSubmit) {
      onSubmit(localValue);
    }
  }, [localValue, onSubmit, validateValue]);

  const getValidationIcon = (): React.ComponentProps<typeof MaterialCommunityIcons>['name'] | null => {
    if (!showValidationStatus || !localValue || error) return null;
    return 'check-circle';
  };

  const validationIcon = getValidationIcon();

  return (
    <View style={[styles.container, disabled && styles.disabled, style]} testID={testID}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons name={icon} size={24} color="#4A90D9" />
        </View>

        <View style={styles.headerContent}>
          <Text style={[styles.title, titleStyle]}>{title}</Text>
          {description && (
            <Text style={[styles.description, descriptionStyle]}>{description}</Text>
          )}
        </View>
      </View>

      <View style={styles.inputContainer}>
        <View
          style={[
            styles.inputWrapper,
            isFocused && styles.inputWrapperFocused,
            error && styles.inputWrapperError,
            disabled && styles.inputWrapperDisabled,
          ]}
        >
          <TextInput
            ref={inputRef}
            style={[styles.input, inputStyle]}
            value={localValue}
            onChangeText={handleChangeText}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              setIsFocused(false);
              handleSubmit();
            }}
            onSubmitEditing={handleSubmit}
            placeholder={placeholder}
            placeholderTextColor="#95A5A6"
            secureTextEntry={isSecure}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            autoCorrect={autoCorrect}
            editable={!disabled}
            maxLength={maxLength}
            accessibilityLabel={title}
            accessibilityHint={description}
          />

          {secureTextEntry && (
            <TouchableOpacity
              onPress={() => setIsSecure(!isSecure)}
              style={styles.secureToggle}
              accessibilityLabel={isSecure ? 'Passwort anzeigen' : 'Passwort verbergen'}
            >
              <MaterialCommunityIcons
                name={isSecure ? 'eye-off' : 'eye'}
                size={20}
                color="#7F8C8D"
              />
            </TouchableOpacity>
          )}

          {validationIcon && (
            <MaterialCommunityIcons
              name={validationIcon}
              size={20}
              color="#27AE60"
              style={styles.validationIcon}
            />
          )}
        </View>

        {actionButton && (
          <TouchableOpacity
            style={[
              styles.actionButton,
              actionButton.loading && styles.actionButtonLoading,
            ]}
            onPress={actionButton.onPress}
            disabled={actionButton.loading || disabled}
            accessibilityLabel="Aktion ausführen"
          >
            <MaterialCommunityIcons
              name={actionButton.icon}
              size={20}
              color={actionButton.loading ? '#BDC3C7' : 'white'}
            />
          </TouchableOpacity>
        )}
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <MaterialCommunityIcons name="alert-circle" size={14} color="#E74C3C" />
          <Text style={[styles.errorText, errorStyle]}>{error}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 16,
  },
  disabled: {
    opacity: 0.5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
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
  headerContent: {
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 52, // Account for icon width + margin
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ECF0F1',
    paddingHorizontal: 12,
    minHeight: 44,
  },
  inputWrapperFocused: {
    borderColor: '#4A90D9',
    backgroundColor: '#EBF4FD',
  },
  inputWrapperError: {
    borderColor: '#E74C3C',
    backgroundColor: '#FDEBEB',
  },
  inputWrapperDisabled: {
    backgroundColor: '#ECF0F1',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#2C3E50',
    paddingVertical: 10,
  },
  secureToggle: {
    padding: 8,
    marginLeft: 4,
  },
  validationIcon: {
    marginLeft: 4,
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#4A90D9',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  actionButtonLoading: {
    backgroundColor: '#BDC3C7',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginLeft: 52,
  },
  errorText: {
    fontSize: 12,
    color: '#E74C3C',
    marginLeft: 6,
  },
});

export default SettingInput;
