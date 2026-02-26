import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PermissionStatus } from 'expo-camera';

interface PermissionScreenProps {
  permission: PermissionStatus | null;
  onRequestPermission: () => Promise<void>;
}

export const PermissionScreen: React.FC<PermissionScreenProps> = ({
  permission,
  onRequestPermission,
}) => {
  const openSettings = useCallback(() => {
    Linking.openSettings();
  }, []);

  const isDenied = permission === 'denied';

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name="camera" size={64} color="#007AFF" />
      </View>

      <Text style={styles.title}>Kamera-Zugriff benötigt</Text>

      <Text style={styles.description}>
        Die Tauben Scanner App benötigt Zugriff auf die Kamera, um Fotos von
        Tauben aufzunehmen. Die Bilder werden verwendet, um vermisste Tauben
        zu identifizieren.
      </Text>

      {isDenied ? (
        <>
          <View style={styles.warningBox}>
            <Ionicons
              name="warning"
              size={24}
              color="#FF9500"
              style={styles.warningIcon}
            />
            <Text style={styles.warningText}>
              Der Kamera-Zugriff wurde in den Systemeinstellungen deaktiviert.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.settingsButton}
            onPress={openSettings}
            activeOpacity={0.8}
          >
            <Ionicons
              name="settings"
              size={24}
              color="white"
              style={styles.buttonIcon}
            />
            <Text style={styles.buttonText}>Einstellungen öffnen</Text>
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity
          style={styles.requestButton}
          onPress={onRequestPermission}
          activeOpacity={0.8}
        >
          <Ionicons
            name="camera"
            size={24}
            color="white"
            style={styles.buttonIcon}
          />
          <Text style={styles.buttonText}>Kamera-Zugriff erlauben</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.privacyNote}>
        <Ionicons name="shield-checkmark" size={14} color="#8E8E93" />
        {' '}Deine Fotos werden nur lokal verarbeitet und für die Suche
        verschlüsselt übertragen.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    backgroundColor: '#F2F2F7',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#636366',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    width: '100%',
  },
  warningIcon: {
    marginRight: 12,
  },
  warningText: {
    flex: 1,
    fontSize: 14,
    color: '#8B6914',
    lineHeight: 20,
  },
  requestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    width: '100%',
  },
  settingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#34C759',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    width: '100%',
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '600',
  },
  privacyNote: {
    marginTop: 24,
    fontSize: 13,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default PermissionScreen;
