import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Surface, Divider, Chip } from 'react-native-paper';
import { Text } from '../../components/atoms/Text';
import { OfflineBanner } from '../../components/molecules/OfflineBanner';
import { ScanSettings } from './components/ScanSettings';
import { AboutSection } from './components/AboutSection';
import { useSettingsStore } from '../../stores/settings';
import { useTheme } from '../../theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { spacing } from '../../theme/spacing';

interface ServerStatus {
  connected: boolean;
  latency?: number;
  status?: string;
  timestamp?: string;
  services?: {
    database?: string;
    storage?: string;
    embedding_model?: string;
  };
  error?: string;
}

export const SettingsScreen: React.FC = () => {
  const theme = useTheme();
  const { matchThreshold, setMatchThreshold, apiUrl } = useSettingsStore();
  const [showSaved, setShowSaved] = useState(false);
  const [serverStatus, setServerStatus] = useState<ServerStatus>({ connected: false });
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);

  // Auto-save with feedback
  const handleThresholdChange = (value: number) => {
    setMatchThreshold(value);
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2000);
  };

  // Check server status
  useEffect(() => {
    const checkServerStatus = async () => {
      setIsCheckingStatus(true);
      const startTime = Date.now();
      try {
        // Use health endpoint for status check (remove /api from URL)
        const baseUrl = apiUrl.replace(/\/$/, '').replace(/\/api$/, '');
        const response = await fetch(`${baseUrl}/health`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        
        if (response.ok) {
          const data = await response.json();
          setServerStatus({
            connected: true,
            latency: Date.now() - startTime,
            status: data.status,
            timestamp: data.timestamp,
            services: data.services,
          });
        } else {
          setServerStatus({
            connected: false,
            error: 'Server-Fehler',
          });
        }
      } catch (error) {
        setServerStatus({
          connected: false,
          error: 'Keine Verbindung',
        });
      } finally {
        setIsCheckingStatus(false);
      }
    };

    checkServerStatus();
    // Check status every 30 seconds when screen is open
    const interval = setInterval(checkServerStatus, 30000);
    return () => clearInterval(interval);
  }, [apiUrl]);

  const getServiceIcon = (status?: string) => {
    if (status === 'connected' || status === 'loaded') return 'check-circle';
    if (status === 'error') return 'close-circle';
    return 'help-circle';
  };

  const getServiceColor = (status?: string) => {
    if (status === 'connected' || status === 'loaded') return theme.colors.success;
    if (status === 'error') return theme.colors.error;
    return theme.colors.onSurfaceVariant;
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <OfflineBanner />
      
      <ScrollView contentContainerStyle={styles.content}>
        <Text variant="h1" style={styles.title}>
          Einstellungen
        </Text>

        {/* Server Status - MD3 Surface mit Chip */}
        <Surface style={[styles.surface, { elevation: 1 }]}>
          <View style={styles.statusHeader}>
            <View style={styles.statusRow}>
              <MaterialCommunityIcons
                name={serverStatus.connected ? 'check-circle' : 'alert-circle'}
                size={24}
                color={serverStatus.connected ? theme.colors.success : theme.colors.error}
              />
              <Text variant="bodyLarge" style={styles.statusTitle}>
                {serverStatus.connected ? 'Server verbunden' : 'Server nicht erreichbar'}
              </Text>
            </View>
            
            <Chip 
              style={{ 
                backgroundColor: serverStatus.connected ? theme.colors.successContainer : theme.colors.errorContainer 
              }}
              textStyle={{ 
                color: serverStatus.connected ? theme.colors.onSuccessContainer : theme.colors.onErrorContainer 
              }}
              icon={serverStatus.connected ? 'check' : 'alert'}
            >
              {serverStatus.connected ? 'Online' : 'Offline'}
            </Chip>
          </View>
          
          {serverStatus.latency && (
            <Text variant="caption" style={{ color: theme.colors.onSurfaceVariant, marginTop: 8 }}>
              Latenz: {serverStatus.latency}ms
            </Text>
          )}
          
          {!serverStatus.connected && serverStatus.error && (
            <Text variant="caption" style={{ color: theme.colors.error, marginTop: 8 }}>
              {serverStatus.error}
            </Text>
          )}
        </Surface>

        <Divider style={styles.divider} />

        <ScanSettings
          matchThreshold={matchThreshold}
          onThresholdChange={handleThresholdChange}
        />
        
        <Divider style={styles.divider} />
        
        <AboutSection />
        
      </ScrollView>
      
      {showSaved && (
        <View style={[styles.savedBanner, { backgroundColor: theme.colors.success as string }]}>
          <Text variant="caption" style={{ color: theme.colors.onPrimary, textAlign: 'center' }}>
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
  },
  content: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  title: {
    marginBottom: spacing.md,
  },
  surface: {
    marginBottom: spacing.md,
    padding: spacing.md,
    borderRadius: 12,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusTitle: {
    marginLeft: spacing.sm,
    fontWeight: '600',
  },
  divider: {
    marginVertical: spacing.md,
  },
  savedBanner: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    padding: 12,
    borderRadius: 8,
    elevation: 4,
  },
});

export default SettingsScreen;
