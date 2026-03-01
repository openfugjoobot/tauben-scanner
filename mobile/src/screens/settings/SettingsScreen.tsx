import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text } from '../../components/atoms/Text';
import { Card } from '../../components/atoms/Card';
import { OfflineBanner } from '../../components/molecules/OfflineBanner';
import { ScanSettings } from './components/ScanSettings';
import { AboutSection } from './components/AboutSection';
import { useSettingsStore } from '../../stores/settings';
import { useTheme } from '../../theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

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

        {/* Server Status Card - Kompakt */}
        <Card style={styles.card}>
          <View style={styles.statusRow}>
            <MaterialCommunityIcons
              name={serverStatus.connected ? 'check-circle' : 'alert-circle'}
              size={20}
              color={serverStatus.connected ? theme.colors.success : theme.colors.error}
            />
            <Text variant="body" style={styles.statusTitle}>
              {serverStatus.connected ? 'Server verbunden' : 'Server nicht erreichbar'}
            </Text>
            
            {serverStatus.latency && (
              <Text variant="caption" style={[styles.latency, { color: theme.colors.onSurfaceVariant }]}>
                {serverStatus.latency}ms
              </Text>
            )}
          </View>
          
          {serverStatus.connected && serverStatus.services && (
            <View style={[styles.servicesRow, { borderTopColor: theme.colors.outline }]}>
              <View style={styles.serviceItem}>
                <MaterialCommunityIcons
                  name={getServiceIcon(serverStatus.services.database)}
                  size={14}
                  color={getServiceColor(serverStatus.services.database)}
                />
                <Text variant="caption" style={[styles.serviceText, { color: theme.colors.onSurfaceVariant }]}>DB</Text>
              </View>
              
              <View style={styles.serviceItem}>
                <MaterialCommunityIcons
                  name={getServiceIcon(serverStatus.services.storage)}
                  size={14}
                  color={getServiceColor(serverStatus.services.storage)}
                />
                <Text variant="caption" style={[styles.serviceText, { color: theme.colors.onSurfaceVariant }]}>Storage</Text>
              </View>
              
              <View style={styles.serviceItem}>
                <MaterialCommunityIcons
                  name={getServiceIcon(serverStatus.services.embedding_model)}
                  size={14}
                  color={getServiceColor(serverStatus.services.embedding_model)}
                />
                <Text variant="caption" style={[styles.serviceText, { color: theme.colors.onSurfaceVariant }]}>KI</Text>
              </View>
            </View>
          )}
          
          {!serverStatus.connected && serverStatus.error && (
            <Text variant="caption" style={{ color: theme.colors.error, marginTop: 4 }}>
              {serverStatus.error}
            </Text>
          )}
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
    padding: 12,
  },
  // Kompakter Status-Block
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusTitle: {
    marginLeft: 8,
    fontWeight: '600',
    flex: 1,
  },
  latency: {
    
    marginLeft: 8,
  },
  servicesRow: {
    flexDirection: 'row',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    
    gap: 16,
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  serviceText: {
    
    fontSize: 12,
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
