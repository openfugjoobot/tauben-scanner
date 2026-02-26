import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { CameraScreen } from './src/screens/CameraScreen';
import { useScanStore } from './src/stores/ScanStore';

export default function App() {
  const [showCamera, setShowCamera] = useState(false);
  const { scan, clearPhoto } = useScanStore();

  const handleStartScan = useCallback(() => {
    clearPhoto();
    setShowCamera(true);
  }, [clearPhoto]);

  const handleScanComplete = useCallback((photoUri: string) => {
    console.log('Scan complete:', photoUri);
    setShowCamera(false);
  }, []);

  const handleCloseCamera = useCallback(() => {
    setShowCamera(false);
  }, []);

  if (showCamera) {
    return (
      <View style={styles.container}>
        <CameraScreen onScanComplete={handleScanComplete} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <Ionicons name="scan-circle" size={80} color="#007AFF" />
        <Text style={styles.title}>Tauben Scanner</Text>
        <Text style={styles.subtitle}>
          Fotografiere eine Taube, um vermisste Tiere zu identifizieren
        </Text>
      </View>

      {scan.photoUri ? (
        <View style={styles.resultCard}>
          <View style={styles.resultIcon}>
            <Ionicons name="checkmark-circle" size={48} color="#34C759" />
          </View>
          <Text style={styles.resultTitle}>Scan abgeschlossen!</Text>
          <Text style={styles.resultText}>
            Das Foto wurde erfolgreich aufgenommen und zur Analyse vorbereitet.
          </Text>
          <TouchableOpacity
            style={styles.scanButton}
            onPress={handleStartScan}
            activeOpacity={0.8}
          >
            <Ionicons name="refresh" size={24} color="white" />
            <Text style={styles.scanButtonText}>Neuer Scan</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.card}>
          <View style={styles.features}>
            <View style={styles.feature}>
              <Ionicons name="camera" size={24} color="#007AFF" />
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>Schneller Scan</Text>
                <Text style={styles.featureDesc}>1920x1080 Auflösung, 60 FPS</Text>
              </View>
            </View>

            <View style={styles.feature}>
              <Ionicons name="flash" size={24} color="#007AFF" />
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>Blitz-Unterstützung</Text>
                <Text style={styles.featureDesc}>Auto, Ein, Aus Modi</Text>
              </View>
            </View>

            <View style={styles.feature}>
              <Ionicons name="sync" size={24} color="#007AFF" />
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>Front/Back Kamera</Text>
                <Text style={styles.featureDesc}>Wechsel einfach die Kamera</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={styles.scanButton}
            onPress={handleStartScan}
            activeOpacity={0.8}
          >
            <Ionicons name="camera" size={24} color="white" />
            <Text style={styles.scanButtonText}>Scan starten</Text>
          </TouchableOpacity>
        </View>
      )}

      <Text style={styles.version}>Version 1.0.0 - Expo Camera v15</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    alignItems: 'center',
    paddingTop: 80,
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1C1C1E',
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#636366',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 24,
  },
  card: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginTop: 40,
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  resultCard: {
    flex: 1,
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginTop: 40,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  resultIcon: {
    marginBottom: 16,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#34C759',
    marginBottom: 8,
  },
  resultText: {
    fontSize: 16,
    color: '#636366',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  features: {
    marginBottom: 24,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureText: {
    marginLeft: 16,
    flex: 1,
  },
  featureTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  featureDesc: {
    fontSize: 15,
    color: '#8E8E93',
    marginTop: 2,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  scanButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: 'white',
    marginLeft: 12,
  },
  version: {
    textAlign: 'center',
    color: '#8E8E93',
    fontSize: 13,
    marginTop: 24,
  },
});
