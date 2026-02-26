import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type SettingItemProps = {
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  title: string;
  description?: string;
  value?: boolean;
  onToggle?: (value: boolean) => void;
  onPress?: () => void;
  showArrow?: boolean;
};

const SettingItem: React.FC<SettingItemProps> = ({
  icon,
  title,
  description,
  value,
  onToggle,
  onPress,
  showArrow = false,
}) => {
  const [isEnabled, setIsEnabled] = useState(value ?? false);

  const handleToggle = (newValue: boolean) => {
    setIsEnabled(newValue);
    onToggle?.(newValue);
  };

  return (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={onPress}
      disabled={!onPress && !onToggle}
    >
      <View style={styles.settingIcon}>
        <MaterialCommunityIcons name={icon} size={24} color="#4A90D9" />
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        {description && (
          <Text style={styles.settingDescription}>{description}</Text>
        )}
      </View>
      {onToggle ? (
        <Switch
          value={isEnabled}
          onValueChange={handleToggle}
          trackColor={{ false: '#ECF0F1', true: '#4A90D9' }}
          thumbColor={isEnabled ? 'white' : '#95A5A6'}
        />
      ) : showArrow ? (
        <MaterialCommunityIcons name="chevron-right" size={24} color="#BDC3C7" />
      ) : null}
    </TouchableOpacity>
  );
};

export const SettingsScreen: React.FC = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true);
  const [apiUrl, setApiUrl] = useState('https://api.tauben-scanner.de');
  const [testing, setTesting] = useState(false);

  const appVersion = '1.0.0';

  const testConnection = async () => {
    if (!apiUrl) {
      Alert.alert('Fehler', 'Bitte API URL eingeben');
      return;
    }
    
    setTesting(true);
    try {
      // Test with simple GET request
      const response = await fetch(`${apiUrl}/health`);
      if (response.ok) {
        Alert.alert('✅ Erfolg', 'Verbindung zum Backend erfolgreich!');
      } else {
        Alert.alert('⚠️ Warnung', `Backend antwortet mit Status ${response.status}`);
      }
    } catch (error) {
      Alert.alert('❌ Fehler', `Keine Verbindung möglich:\n${error instanceof Error ? error.message : 'Unbekannter Fehler'}`);
    } finally {
      setTesting(false);
    }
  };

  const handleClearCache = () => {
    // Cache leeren
    console.log('Cache wird geleert...');
  };

  const handleExportData = () => {
    // Daten exportieren
    console.log('Daten werden exportiert...');
  };

  const handleOpenPrivacy = () => {
    // Datenschutz-Seite öffnen
    console.log('Öffne Datenschutz...');
  };

  const handleOpenTerms = () => {
    // AGB-Seite öffnen
    console.log('Öffne AGB...');
  };

  const handleRateApp = () => {
    // App bewerten
    console.log('Öffne Bewertung...');
  };

  const handleContactSupport = () => {
    // Support kontaktieren
    console.log('Kontaktiere Support...');
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <MaterialCommunityIcons name="cog" size={48} color="#4A90D9" />
        <Text style={styles.title}>Einstellungen</Text>
        <Text style={styles.subtitle}>Verwalte deine Präferenzen</Text>
      </View>

      {/* App Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App-Einstellungen</Text>
        <View style={styles.card}>
          <SettingItem
            icon="bell-outline"
            title="Benachrichtigungen"
            description="Erhältlich über neue Sichtungen"
            value={notificationsEnabled}
            onToggle={setNotificationsEnabled}
          />
          <View style={styles.divider} />
          <SettingItem
            icon="theme-light-dark"
            title="Dunkler Modus"
            description="Dunkles Design aktivieren"
            value={darkModeEnabled}
            onToggle={setDarkModeEnabled}
          />
          <View style={styles.divider} />
          <SettingItem
            icon="map-marker-radius"
            title="Standortdienste"
            description="Automatische Ortung aktivieren"
            value={locationEnabled}
            onToggle={setLocationEnabled}
          />
        </View>
      </View>

      {/* Sync Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Synchronisation</Text>
        <View style={styles.card}>
          <SettingItem
            icon="sync"
            title="Automatische Synchronisation"
            description="Daten automatisch mit Server synchronisieren"
            value={autoSyncEnabled}
            onToggle={setAutoSyncEnabled}
          />
          <View style={styles.divider} />
          <View style={styles.urlInputContainer}>
            <View style={styles.urlInputHeader}>
              <View style={styles.settingIcon}>
                <MaterialCommunityIcons name="cloud-upload" size={24} color="#4A90D9" />
              </View>
              <Text style={styles.settingTitle}>Backend-URL</Text>
            </View>
            <TextInput
              style={styles.urlInput}
              value={apiUrl}
              onChangeText={setApiUrl}
              placeholder="http://localhost:3000/api"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity 
              style={[styles.testButton, testing && styles.disabled]} 
              onPress={testConnection}
              disabled={testing}
            >
              <Text style={styles.testButtonText}>
                {testing ? 'Teste...' : '🔗 Verbindung testen'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Data Management */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Datenverwaltung</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.actionRow} onPress={handleClearCache}>
            <View style={styles.actionIcon}>
              <MaterialCommunityIcons name="trash-can-outline" size={24} color="#E74C3C" />
            </View>
            <Text style={styles.actionText}>Cache leeren</Text>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#BDC3C7" />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.actionRow} onPress={handleExportData}>
            <View style={styles.actionIcon}>
              <MaterialCommunityIcons name="download" size={24} color="#27AE60" />
            </View>
            <Text style={styles.actionText}>Daten exportieren</Text>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#BDC3C7" />
          </TouchableOpacity>
        </View>
      </View>

      {/* About */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Über</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.actionRow} onPress={handleOpenPrivacy}>
            <View style={styles.actionIcon}>
              <MaterialCommunityIcons name="shield-check" size={24} color="#7F8C8D" />
            </View>
            <Text style={styles.actionText}>Datenschutz</Text>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#BDC3C7" />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.actionRow} onPress={handleOpenTerms}>
            <View style={styles.actionIcon}>
              <MaterialCommunityIcons name="file-document" size={24} color="#7F8C8D" />
            </View>
            <Text style={styles.actionText}>Nutzungsbedingungen</Text>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#BDC3C7" />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.actionRow} onPress={handleRateApp}>
            <View style={styles.actionIcon}>
              <MaterialCommunityIcons name="star" size={24} color="#F39C12" />
            </View>
            <Text style={styles.actionText}>App bewerten</Text>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#BDC3C7" />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.actionRow} onPress={handleContactSupport}>
            <View style={styles.actionIcon}>
              <MaterialCommunityIcons name="help-circle" size={24} color="#7F8C8D" />
            </View>
            <Text style={styles.actionText}>Support kontaktieren</Text>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#BDC3C7" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.versionText}>Tauben Scanner v{appVersion}</Text>
        <Text style={styles.copyrightText}>© 2025 OpenFugjooBot</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginTop: 12,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7F8C8D',
    marginHorizontal: 20,
    marginBottom: 12,
  },
  card: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#EBF4FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    color: '#2C3E50',
    fontWeight: '500',
  },
  settingDescription: {
    fontSize: 12,
    color: '#95A5A6',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#F5F7FA',
    marginLeft: 68,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F5F7FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  actionText: {
    flex: 1,
    fontSize: 16,
    color: '#2C3E50',
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  versionText: {
    fontSize: 14,
    color: '#95A5A6',
    fontWeight: '600',
  },
  copyrightText: {
    fontSize: 12,
    color: '#BDC3C7',
    marginTop: 4,
  },
  urlInputContainer: {
    padding: 16,
  },
  urlInputHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  urlInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    marginBottom: 12,
    marginLeft: 52,
  },
  testButton: {
    backgroundColor: '#4CAF50',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 52,
  },
  disabled: { 
    backgroundColor: '#ccc' 
  },
  testButtonText: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: '600' 
  },
});
