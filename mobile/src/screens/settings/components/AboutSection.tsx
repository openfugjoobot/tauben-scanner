import React from 'react';
import { View, StyleSheet, Linking } from 'react-native';
import { SettingsSection } from './SettingsSection';
import { SettingsItem } from './SettingsItem';
import { Text } from '../../../components/atoms/Text';
import { useTheme } from "../../../theme";

export const AboutSection: React.FC = () => {
  const theme = useTheme();
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
      <View style={[styles.footerInfo, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.creditsText, { color: theme.colors.onSurfaceVariant }]}>
          Entwickelt für den Taubenschutz durch offene Technologie.
        </Text>
      </View>
    </SettingsSection>
  );
};

const styles = StyleSheet.create({
  footerInfo: {
    padding: 16,
  },
  creditsText: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
});
