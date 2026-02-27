import React from 'react';
import { TextInput, StyleSheet, View } from 'react-native';
import { SettingsSection } from './SettingsSection';
import { SettingsItem } from './SettingsItem';
import { Text } from '../../../components/atoms/Text';

interface ApiSettingsProps {
  apiUrl: string;
  apiKey: string;
  errors: Partial<Record<'apiUrl' | 'apiKey', string>>;
  onApiUrlChange: (value: string) => void;
  onApiKeyChange: (value: string) => void;
}

export const ApiSettings: React.FC<ApiSettingsProps> = ({
  apiUrl,
  apiKey,
  errors,
  onApiUrlChange,
  onApiKeyChange,
}) => {
  return (
    <SettingsSection title="API Einstellungen">
      <SettingsItem label="Server URL" error={errors.apiUrl}>
        <TextInput
          style={styles.input}
          value={apiUrl}
          onChangeText={onApiUrlChange}
          placeholder="https://your-api.com"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
        />
      </SettingsItem>
      
      <SettingsItem label="API Schlüssel" error={errors.apiKey}>
        <TextInput
          style={styles.input}
          value={apiKey}
          onChangeText={onApiKeyChange}
          placeholder="Ihren API-Key eingeben"
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry
        />
      </SettingsItem>
    </SettingsSection>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f9f9f9',
    marginTop: 8,
    color: '#333',
  },
});
