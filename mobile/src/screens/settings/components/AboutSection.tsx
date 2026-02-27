import React from 'react';
import { View, StyleSheet, Linking } from 'react-native';
import { SettingsSection } from './SettingsSection';
import { SettingsItem } from './SettingsItem';
import { Text } from '../../../components/atoms/Text';

export const AboutSection: React.FC = () => {
  const version = '1.0.0'; // Hardcoded for now
  
  const handleWebsitePress = () => {
    Linking.openURL('https://github.com/openfugjoobot/tauben-scanner');
  };

  return (
    <SettingsSection title="Über die App">
      <SettingsItem label="App Version" value={version} />
      <SettingsItem 
        label="Quellcode" 
        onPress={handleWebsitePress} 
        value="GitHub"
      />
      <View style={styles.footerInfo}>
        <Text style={styles.creditsText}>
          Entwickelt für den Taubenschutz durch offene Technologie.
        </Text>
      </View>
    </SettingsSection>
  );
};

const styles = StyleSheet.create({
  footerInfo: {
    padding: 16,
    backgroundColor: '#fff',
  },
  creditsText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    lineHeight: 18,
  },
});
