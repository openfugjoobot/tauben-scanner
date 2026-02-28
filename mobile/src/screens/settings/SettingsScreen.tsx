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
          error: 'Keine Verbindung zum Server',
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
    if (status === 'connected' || status === 'loaded') return '#4CAF50';
    if (status === 'error') return '#F44336';
    return '#9E9E9E';
  };

  return (
    <View style={styles.container}>
      <OfflineBanner />
      
      <ScrollView contentContainerStyle={styles.content}>
        <Text variant="h1" style={styles.title}>
          Einstellungen
        </Text>

        {/* Server Status Card */}
        <Card style={styles.card}>
          <View style={styles.serverHeader}>
            <MaterialCommunityIcons
              name={serverStatus.connected ? 'check-circle' : 'alert-circle'}
              size={24}
              color={serverStatus.connected ? theme.colors.success : theme.colors.error}
            />
            <Text variant="h3" style={styles.serverTitle}>
              {serverStatus.connected ? 'Server verbunden' : 'Server nicht erreichbar'}
            </Text>
          </View>
          
          {isCheckingStatus ? (
            <Text variant="caption" color={theme.colors.onSurfaceVariant}>
              Verbindung wird geprüft...
            </Text>
          ) : serverStatus.connected ? (
            <>
              <Text variant="body" style={styles.statusText}>
                <Text style={{ fontWeight: '600' }}>URL: </Text>
                {apiUrl}
              </Text>
              
              {serverStatus.latency && (
                <Text variant="caption" style={styles.statusDetail}>
                  ⏱️ Latenz: {serverStatus.latency}ms
                </Text>
              )}
              
              {serverStatus.status && (
                <Text variant="caption" style={styles.statusDetail}>
                  📊 Status: {serverStatus.status}
                </Text>
              )}

              {/* Services Status */}
              {serverStatus.services && (
                <View style={styles.servicesContainer}>
                  <Text variant="bodySmall" style={styles.servicesTitle}>
                    Services:
                  </Text>
                  
                  {serverStatus.services.database && (
                    <View style={styles.serviceRow}>
                      <MaterialCommunityIcons
                        name={getServiceIcon(serverStatus.services.database)}
                        size={16}
                        color={getServiceColor(serverStatus.services.database)}
                      />
                      <Text variant="caption" style={styles.serviceText}>
                        🗄️ Datenbank: {serverStatus.services.database}
                      </Text>
                    </View>
                  )}
                  
                  {serverStatus.services.storage && (
                    <View style={styles.serviceRow}>
                      <MaterialCommunityIcons
                        name={getServiceIcon(serverStatus.services.storage)}
                        size={16}
                        color={getServiceColor(serverStatus.services.storage)}
                      />
                      <Text variant="caption" style={styles.serviceText}>
                        💾 Storage: {serverStatus.services.storage}
                      </Text>
                    </View>
                  )}
                  
                  {serverStatus.services.embedding_model && (
                    <View style={styles.serviceRow}>
                      <MaterialCommunityIcons
                        name={getServiceIcon(serverStatus.services.embedding_model)}
                        size={16}
                        color={getServiceColor(serverStatus.services.embedding_model)}
                      />
                      <Text variant="caption" style={styles.serviceText}>
                        🧠 KI-Modell: {serverStatus.services.embedding_model}
                      </Text>
                    </View>
                  )}
                </View>
              )}
            </>
          ) : (
            <Text variant="caption" style={{ color: theme.colors.error }}>
              {serverStatus.error || 'Verbindungsfehler'}
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
  serverHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  serverTitle: {
    marginLeft: 8,
    fontWeight: '600',
  },
  statusText: {
    marginTop: 8,
    marginBottom: 4,
  },
  statusDetail: {
    marginTop: 2,
    color: '#666',
  },
  servicesContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  servicesTitle: {
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  serviceText: {
    marginLeft: 6,
    color: '#666',
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
