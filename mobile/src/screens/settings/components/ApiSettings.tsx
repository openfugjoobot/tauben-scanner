import React from 'react';
import { View, StyleSheet } from 'react-native';
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

const FIXED_API_URL = 'https://tauben-scanner.fugjoo.duckdns.org/api';

export const ApiSettings: React.FC<ApiSettingsProps> = () => {
  return (
    <SettingsSection title="Server-Verbindung">
      <SettingsItem label="Server">
        <View style={styles.urlContainer}>
          <Text variant="bodyMedium" style={styles.urlText}>
            {FIXED_API_URL}
          </Text>
          <Text variant="caption" style={styles.hint}>
            Standardmäßig mit dem zentralen Server verbunden
          </Text>
        </View>
      </SettingsItem>
    </SettingsSection>
  );
};

const styles = StyleSheet.create({
  urlContainer: {
    paddingVertical: 12,
  },
  urlText: {
    color: '#333',
    fontWeight: '500',
  },
  hint: {
    marginTop: 4,
    color: '#666',
  },
});
