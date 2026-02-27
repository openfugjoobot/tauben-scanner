import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Text } from '../../components/atoms/Text';
import { Card } from '../../components/atoms/Card';
import { OfflineBanner } from '../../components/molecules/OfflineBanner';
import { ScanSettings } from './components/ScanSettings';
import { AboutSection } from './components/AboutSection';
import { useSettingsStore } from '../../stores/settings';
import { useTheme } from '../../theme';

export const SettingsScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const { matchThreshold, setMatchThreshold } = useSettingsStore();
  const [showSaved, setShowSaved] = useState(false);

  const handleThresholdChange = (value: number) => {
    setMatchThreshold(value);
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2000);
  };

  return (
    <View style={styles.container}>
      <OfflineBanner />
      
      <ScrollView contentContainerStyle={styles.content}>
        <Text variant="h1" style={styles.title}>
          Einstellungen
        </Text>

        {/* Server Info */}
        <Card style={styles.card}>
          <Text variant="h3" style={styles.sectionTitle}>
            Server
          </Text>
          <Text variant="bodyMedium" style={styles.url}>
            https://tauben-scanner.fugjoo.duckdns.org
          </Text>
          <Text variant="caption" style={styles.hint}>
            Automatisch verbunden
          </Text>
        </Card>

        <ScanSettings
          matchThreshold={matchThreshold}
          onThresholdChange={handleThresholdChange}
        />
        
        <AboutSection />
        
      </ScrollView>
      
      {showSaved && (
        <View style={[styles.savedBanner, { backgroundColor: theme.colors.success as string }]}>
          <Text variant="caption" style={{ color: '#fff', textAlign: 'center' }}>
            Gespeichert!
          </Text>
        </View>
      )}
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
  card: {
    marginBottom: 16,
    padding: 16,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  url: {
    color: '#333',
    fontWeight: '500',
    marginBottom: 4,
  },
  hint: {
    color: '#666',
  },
  savedBanner: {
    position: 'absolute',
    bottom: 80,
    left: 16,
    right: 16,
    padding: 12,
    borderRadius: 8,
  },
});
