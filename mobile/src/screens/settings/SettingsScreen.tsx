import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Text } from '../../components/atoms/Text';
import { Button } from '../../components/atoms/Button';
import { Card } from '../../components/atoms/Card';
import { OfflineBanner } from '../../components/molecules/OfflineBanner';
import { useSettingsForm } from './hooks/useSettingsForm';
import { ApiSettings } from './components/ApiSettings';
import { ScanSettings } from './components/ScanSettings';
import { AboutSection } from './components/AboutSection';
import { useTheme } from '../../theme';

export const SettingsScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const { formData, errors, isDirty, updateField, save, reset } = useSettingsForm();
  const [showSaved, setShowSaved] = useState(false);

  const handleSave = () => {
    if (save()) {
      setShowSaved(true);
      setTimeout(() => setShowSaved(false), 2000);
    }
  };

  const handleReset = () => {
    Alert.alert(
      'Einstellungen zurücksetzen?',
      'Alle Änderungen werden verworfen.',
      [
        { text: 'Abbrechen', style: 'cancel' },
        { text: 'Zurücksetzen', style: 'destructive', onPress: reset },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <OfflineBanner />
      
      <ScrollView contentContainerStyle={styles.content}>
        <Text variant="h1" style={styles.title}>
          Einstellungen
        </Text>
        
        <ApiSettings
          apiUrl={formData.apiUrl}
          apiKey={formData.apiKey}
          errors={errors}
          onApiUrlChange={(value) => updateField('apiUrl', value)}
          onApiKeyChange={(value) => updateField('apiKey', value)}
        />
        
        <ScanSettings
          matchThreshold={formData.matchThreshold}
          onThresholdChange={(value) => updateField('matchThreshold', value)}
        />
        
        <AboutSection />
        
      </ScrollView>
      
      <View style={styles.footer}>
        {isDirty && (
          <View style={styles.buttonRow}>
            <Button
              variant="ghost"
              onPress={handleReset}
              style={styles.footerButton}
            >
              Nochmals resetten
            </Button>
            
            <Button
              variant="primary"
              onPress={handleSave}
              style={styles.footerButton}
            >
              Speichern
            </Button>
          </View>
        )}
        
        {showSaved && (
          <View style={[styles.savedBanner, { backgroundColor: theme.colors.success }]}>
            <Text variant="caption" style={{ color: '#fff', textAlign: 'center' }}>
              Gespeichert!
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  title: {
    marginBottom: 16,
  },
  footer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  footerButton: {
    flex: 1,
  },
  savedBanner: {
    marginTop: 12,
    padding: 8,
    borderRadius: 8,
    justifyContent: 'center',
  },
});
