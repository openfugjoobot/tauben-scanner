<<<<<<< HEAD
/**
 * Settings Screen
 * Configuration UI mit Settings Store Integration
 * T9: Settings Screen
 */

import React, { useState, useCallback, useMemo } from 'react';
=======
import React, { useState } from 'react';
>>>>>>> main
import {
  View,
  Text,
  StyleSheet,
<<<<<<< HEAD
  ScrollView,
  TouchableOpacity,
  Alert,
  useColorScheme,
  Modal,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SettingItem, SettingToggle, SettingInput } from '../../components/settings';
import { useSettings, APP_VERSION } from '../../stores/settingsStore';
import type { ThemeMode, Language } from '../../types/store';

// Theme Options
const THEME_OPTIONS: { value: ThemeMode; label: string; icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'] }[] = [
  { value: 'light', label: 'Hell', icon: 'weather-sunny' },
  { value: 'dark', label: 'Dunkel', icon: 'weather-night' },
  { value: 'system', label: 'System', icon: 'theme-light-dark' },
];

// Language Options
const LANGUAGE_OPTIONS: { value: Language; label: string; flag: string }[] = [
  { value: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { value: 'en', label: 'English', flag: '🇬🇧' },
];

// URL Validation Pattern
const URL_PATTERN = /^https?:\/\/.+/;

export const SettingsScreen: React.FC = () => {
  const settings = useSettings();
  const systemColorScheme = useColorScheme();
  
  // Local state for modals
  const [themeModalVisible, setThemeModalVisible] = useState(false);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  
  // API Test state
  const [isTestingApi, setIsTestingApi] = useState(false);
  const [apiTestResult, setApiTestResult] = useState<{ success: boolean; message: string } | null>(null);
  
  // URL validation state
  const [urlError, setUrlError] = useState<string | null>(null);
  
  // Determine effective theme
  const effectiveTheme = useMemo(() => {
    if (settings.theme === 'system') {
      return systemColorScheme === 'dark' ? 'dark' : 'light';
    }
    return settings.theme;
  }, [settings.theme, systemColorScheme]);
  
  const isDarkMode = effectiveTheme === 'dark';
  
  // Get current theme label
  const currentThemeLabel = useMemo(() => {
    return THEME_OPTIONS.find(t => t.value === settings.theme)?.label || 'System';
  }, [settings.theme]);
  
  // Get current language label
  const currentLanguageLabel = useMemo(() => {
    return LANGUAGE_OPTIONS.find(l => l.value === settings.language)?.label || 'Deutsch';
  }, [settings.language]);

  // Handlers
  const handleClearCache = useCallback(() => {
    Alert.alert(
      'Cache leeren',
      'Möchten Sie wirklich den Cache leeren? Diese Aktion kann nicht rückgängig gemacht werden.',
      [
        { text: 'Abbrechen', style: 'cancel' },
        {
          text: 'Leeren',
          style: 'destructive',
          onPress: () => {
            console.log('Cache wird geleert...');
            // Cache-Logik hier implementieren
          },
        },
      ]
    );
  }, []);

  const handleExportData = useCallback(() => {
    console.log('Daten werden exportiert...');
    Alert.alert(
      'Daten exportieren',
      'Der Export-Funktionalität wird implementiert.',
      [{ text: 'OK' }]
    );
  }, []);

  const handleOpenPrivacy = useCallback(() => {
    console.log('Öffne Datenschutz...');
  }, []);

  const handleOpenTerms = useCallback(() => {
    console.log('Öffne AGB...');
  }, []);

  const handleContactSupport = useCallback(() => {
    console.log('Kontaktiere Support...');
  }, []);

  // Theme selection
  const handleThemeSelect = useCallback((theme: ThemeMode) => {
    settings.setTheme(theme);
    setThemeModalVisible(false);
  }, [settings]);

  // Language selection
  const handleLanguageSelect = useCallback((language: Language) => {
    settings.setLanguage(language);
    setLanguageModalVisible(false);
  }, [settings]);

  // API URL change
  const handleApiUrlChange = useCallback((value: string, isValid: boolean) => {
    if (isValid) {
      settings.setApiUrl(value);
      setUrlError(null);
    } else {
      setUrlError('Bitte geben Sie eine gültige URL ein');
    }
  }, [settings]);

  // API Test
  const handleApiTest = useCallback(async () => {
    setIsTestingApi(true);
    setApiTestResult(null);
    
    try {
      const result = await settings.testApiConnection();
      setApiTestResult(result);
      
      if (result.success) {
        Alert.alert('Erfolg', result.message);
      } else {
        Alert.alert('Fehler', result.message);
      }
    } catch (error) {
      setApiTestResult({
        success: false,
        message: 'Ein unerwarteter Fehler ist aufgetreten',
      });
    } finally {
      setIsTestingApi(false);
    }
  }, [settings]);

  const handleResetSettings = useCallback(() => {
    Alert.alert(
      'Einstellungen zurücksetzen',
      'Möchten Sie wirklich alle Einstellungen auf die Standardwerte zurücksetzen?',
      [
        { text: 'Abbrechen', style: 'cancel' },
        {
          text: 'Zurücksetzen',
          style: 'destructive',
          onPress: () => {
            settings.resetSettings();
          },
        },
      ]
    );
  }, [settings]);

  // Dynamic styles based on theme
  const dynamicStyles = useMemo(() => ({
    container: {
      backgroundColor: isDarkMode ? '#1A1A2E' : '#F5F7FA',
    },
    card: {
      backgroundColor: isDarkMode ? '#16213E' : 'white',
    },
    title: {
      color: isDarkMode ? '#E94560' : '#2C3E50',
    },
    subtitle: {
      color: isDarkMode ? '#7F8C8D' : '#7F8C8D',
    },
    sectionTitle: {
      color: isDarkMode ? '#E94560' : '#7F8C8D',
    },
    text: {
      color: isDarkMode ? '#FFFFFF' : '#2C3E50',
    },
    description: {
      color: isDarkMode ? '#A0A0A0' : '#7F8C8D',
    },
  }), [isDarkMode]);

  return (
    <ScrollView style={[styles.container, dynamicStyles.container]}>
      {/* Header */}
      <View style={styles.header}>
        <MaterialCommunityIcons name="cog" size={48} color="#4A90D9" />
        <Text style={[styles.title, dynamicStyles.title]}>Einstellungen</Text>
        <Text style={[styles.subtitle, dynamicStyles.subtitle]}>
          Verwalte deine Präferenzen
        </Text>
      </View>

      {/* Server Settings */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>
          Server
        </Text>
        <View style={[styles.card, dynamicStyles.card]}>
          <SettingInput
            icon="web"
            title="API-URL"
            description="Die URL des Tauben Scanner Servers"
            value={settings.apiUrl}
            onValueChange={handleApiUrlChange}
            onSubmit={handleApiTest}
            placeholder="https://api.example.com/api"
            keyboardType="url"
            validation={{
              required: true,
              pattern: URL_PATTERN,
              custom: (value) => {
                try {
                  new URL(value);
                  return true;
                } catch {
                  return 'Ungültige URL';
                }
              },
            }}
            errorMessages={{
              required: 'API-URL ist erforderlich',
              pattern: 'URL muss mit http:// oder https:// beginnen',
              custom: 'Bitte geben Sie eine gültige URL ein',
            }}
            actionButton={{
              icon: isTestingApi ? 'loading' : 'connection',
              onPress: handleApiTest,
              loading: isTestingApi,
            }}
            testID="api-url-input"
          />
          
          {apiTestResult && (
            <View style={[
              styles.apiTestResult,
              { backgroundColor: apiTestResult.success ? '#D4EDDA' : '#F8D7DA' }
            ]}>
              <MaterialCommunityIcons
                name={apiTestResult.success ? 'check-circle' : 'alert-circle'}
                size={20}
                color={apiTestResult.success ? '#155724' : '#721C24'}
              />
              <Text style={[
                styles.apiTestText,
                { color: apiTestResult.success ? '#155724' : '#721C24' }
              ]}>
                {apiTestResult.message}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Appearance Settings */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>
          Erscheinungsbild
        </Text>
        <View style={[styles.card, dynamicStyles.card]}>
          <SettingItem
            icon="theme-light-dark"
            title="Theme"
            description={currentThemeLabel}
            onPress={() => setThemeModalVisible(true)}
            showArrow
          />
          <View style={styles.divider} />
          <SettingItem
            icon="translate"
            title="Sprache"
            description={currentLanguageLabel}
            onPress={() => setLanguageModalVisible(true)}
            showArrow
          />
        </View>
      </View>

      {/* Connectivity Settings */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>
          Konnektivität
        </Text>
        <View style={[styles.card, dynamicStyles.card]}>
          <SettingToggle
            icon="wifi-off"
            title="Offline-Modus"
            description="Daten nur lokal verarbeiten"
            value={settings.offlineMode}
            onValueChange={settings.setOfflineMode}
            trackColor={{ true: '#E74C3C', false: '#ECF0F1' }}
            testID="offline-mode-toggle"
          />
          <View style={styles.divider} />
          <SettingToggle
            icon="bell-outline"
            title="Benachrichtigungen"
            description="Push-Benachrichtigungen erhalten"
            value={settings.notificationsEnabled}
            onValueChange={settings.toggleNotifications}
            testID="notifications-toggle"
          />
          <View style={styles.divider} />
          <SettingToggle
            icon="sync"
            title="Automatische Synchronisation"
            description="Daten automatisch mit Server synchronisieren"
            value={settings.autoSync}
            onValueChange={settings.toggleAutoSync}
            disabled={settings.offlineMode}
            testID="auto-sync-toggle"
          />
        </View>
      </View>

      {/* Scan Settings */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>
          Scan
        </Text>
        <View style={[styles.card, dynamicStyles.card]}>
          <SettingToggle
            icon="image"
            title="Fotos speichern"
            description="Aufgenommene Fotos lokal speichern"
            value={settings.savePhotos}
            onValueChange={settings.toggleSavePhotos}
          />
          <View style={styles.divider} />
          <SettingToggle
            icon="image-compress"
            title="Fotos komprimieren"
            description="Speicherplatz durch Komprimierung sparen"
            value={settings.compressPhotos}
            onValueChange={settings.toggleCompressPhotos}
            disabled={!settings.savePhotos}
          />
        </View>
      </View>

      {/* Advanced Settings */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>
          Erweitert
        </Text>
        <View style={[styles.card, dynamicStyles.card]}>
          <SettingToggle
            icon="bug-outline"
            title="Debug-Modus"
            description="Zusätzliche Debug-Informationen anzeigen"
            value={settings.debugMode}
            onValueChange={settings.toggleDebugMode}
            trackColor={{ true: '#F39C12', false: '#ECF0F1' }}
=======
  Switch,
  TouchableOpacity,
  ScrollView,
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

  const appVersion = '1.0.0';
  const backendUrl = 'https://api.tauben-scanner.de';

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
          <SettingItem
            icon="cloud-upload"
            title="Backend-URL"
            description={backendUrl}
            onPress={() => console.log('Backend-URL bearbeiten')}
            showArrow
>>>>>>> main
          />
        </View>
      </View>

      {/* Data Management */}
      <View style={styles.section}>
<<<<<<< HEAD
        <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>
          Datenverwaltung
        </Text>
        <View style={[styles.card, dynamicStyles.card]}>
          <TouchableOpacity style={styles.actionRow} onPress={handleClearCache}>
            <View style={[styles.actionIcon, { backgroundColor: '#FDEBEB' }]}>
              <MaterialCommunityIcons name="trash-can-outline" size={24} color="#E74C3C" />
            </View>
            <Text style={[styles.actionText, dynamicStyles.text]}>Cache leeren</Text>
=======
        <Text style={styles.sectionTitle}>Datenverwaltung</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.actionRow} onPress={handleClearCache}>
            <View style={styles.actionIcon}>
              <MaterialCommunityIcons name="trash-can-outline" size={24} color="#E74C3C" />
            </View>
            <Text style={styles.actionText}>Cache leeren</Text>
>>>>>>> main
            <MaterialCommunityIcons name="chevron-right" size={24} color="#BDC3C7" />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.actionRow} onPress={handleExportData}>
<<<<<<< HEAD
            <View style={[styles.actionIcon, { backgroundColor: '#E8F8F5' }]}>
              <MaterialCommunityIcons name="download" size={24} color="#27AE60" />
            </View>
            <Text style={[styles.actionText, dynamicStyles.text]}>Daten exportieren</Text>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#BDC3C7" />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.actionRow} onPress={handleResetSettings}>
            <View style={[styles.actionIcon, { backgroundColor: '#FDEBEB' }]}>
              <MaterialCommunityIcons name="restore" size={24} color="#E74C3C" />
            </View>
            <Text style={[styles.actionText, { color: '#E74C3C' }]}>
              Einstellungen zurücksetzen
            </Text>
=======
            <View style={styles.actionIcon}>
              <MaterialCommunityIcons name="download" size={24} color="#27AE60" />
            </View>
            <Text style={styles.actionText}>Daten exportieren</Text>
>>>>>>> main
            <MaterialCommunityIcons name="chevron-right" size={24} color="#BDC3C7" />
          </TouchableOpacity>
        </View>
      </View>

      {/* About */}
      <View style={styles.section}>
<<<<<<< HEAD
        <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>
          Über
        </Text>
        <View style={[styles.card, dynamicStyles.card]}>
=======
        <Text style={styles.sectionTitle}>Über</Text>
        <View style={styles.card}>
>>>>>>> main
          <TouchableOpacity style={styles.actionRow} onPress={handleOpenPrivacy}>
            <View style={styles.actionIcon}>
              <MaterialCommunityIcons name="shield-check" size={24} color="#7F8C8D" />
            </View>
<<<<<<< HEAD
            <Text style={[styles.actionText, dynamicStyles.text]}>Datenschutz</Text>
=======
            <Text style={styles.actionText}>Datenschutz</Text>
>>>>>>> main
            <MaterialCommunityIcons name="chevron-right" size={24} color="#BDC3C7" />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.actionRow} onPress={handleOpenTerms}>
            <View style={styles.actionIcon}>
              <MaterialCommunityIcons name="file-document" size={24} color="#7F8C8D" />
            </View>
<<<<<<< HEAD
            <Text style={[styles.actionText, dynamicStyles.text]}>Nutzungsbedingungen</Text>
=======
            <Text style={styles.actionText}>Nutzungsbedingungen</Text>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#BDC3C7" />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.actionRow} onPress={handleRateApp}>
            <View style={styles.actionIcon}>
              <MaterialCommunityIcons name="star" size={24} color="#F39C12" />
            </View>
            <Text style={styles.actionText}>App bewerten</Text>
>>>>>>> main
            <MaterialCommunityIcons name="chevron-right" size={24} color="#BDC3C7" />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.actionRow} onPress={handleContactSupport}>
            <View style={styles.actionIcon}>
              <MaterialCommunityIcons name="help-circle" size={24} color="#7F8C8D" />
            </View>
<<<<<<< HEAD
            <Text style={[styles.actionText, dynamicStyles.text]}>Support kontaktieren</Text>
=======
            <Text style={styles.actionText}>Support kontaktieren</Text>
>>>>>>> main
            <MaterialCommunityIcons name="chevron-right" size={24} color="#BDC3C7" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
<<<<<<< HEAD
        <Text style={styles.versionText}>
          Tauben Scanner v{APP_VERSION}
        </Text>
        <Text style={styles.copyrightText}>© 2025 OpenFugjooBot</Text>
        <Text style={[styles.buildInfo, dynamicStyles.description]}>
          Theme: {effectiveTheme} | Language: {settings.language}
        </Text>
      </View>

      {/* Theme Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={themeModalVisible}
        onRequestClose={() => setThemeModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, dynamicStyles.card]}>
            <Text style={[styles.modalTitle, dynamicStyles.title]}>Theme wählen</Text>
            {THEME_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.modalItem,
                  settings.theme === option.value && styles.modalItemSelected,
                ]}
                onPress={() => handleThemeSelect(option.value)}
              >
                <MaterialCommunityIcons
                  name={option.icon}
                  size={24}
                  color={settings.theme === option.value ? '#4A90D9' : '#7F8C8D'}
                />
                <Text style={[
                  styles.modalText,
                  dynamicStyles.text,
                  settings.theme === option.value && styles.modalTextSelected,
                ]}>
                  {option.label}
                </Text>
                {settings.theme === option.value && (
                  <MaterialCommunityIcons name="check" size={20} color="#4A90D9" />
                )}
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.modalClose}
              onPress={() => setThemeModalVisible(false)}
            >
              <Text style={styles.modalCloseText}>Abbrechen</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Language Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={languageModalVisible}
        onRequestClose={() => setLanguageModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, dynamicStyles.card]}>
            <Text style={[styles.modalTitle, dynamicStyles.title]}>Sprache wählen</Text>
            {LANGUAGE_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.modalItem,
                  settings.language === option.value && styles.modalItemSelected,
                ]}
                onPress={() => handleLanguageSelect(option.value)}
              >
                <Text style={styles.flagText}>{option.flag}</Text>
                <Text style={[
                  styles.modalText,
                  dynamicStyles.text,
                  settings.language === option.value && styles.modalTextSelected,
                ]}>
                  {option.label}
                </Text>
                {settings.language === option.value && (
                  <MaterialCommunityIcons name="check" size={20} color="#4A90D9" />
                )}
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.modalClose}
              onPress={() => setLanguageModalVisible(false)}
            >
              <Text style={styles.modalCloseText}>Abbrechen</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
=======
        <Text style={styles.versionText}>Tauben Scanner v{appVersion}</Text>
        <Text style={styles.copyrightText}>© 2025 OpenFugjooBot</Text>
      </View>
>>>>>>> main
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
<<<<<<< HEAD
=======
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
>>>>>>> main
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
<<<<<<< HEAD
    color: '#4A90D9',
=======
    color: '#95A5A6',
>>>>>>> main
    fontWeight: '600',
  },
  copyrightText: {
    fontSize: 12,
    color: '#BDC3C7',
    marginTop: 4,
  },
<<<<<<< HEAD
  buildInfo: {
    fontSize: 10,
    color: '#95A5A6',
    marginTop: 8,
  },
  apiTestResult: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 8,
  },
  apiTestText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 30,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    textAlign: 'center',
    paddingVertical: 20,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 16,
    borderRadius: 12,
  },
  modalItemSelected: {
    backgroundColor: '#EBF4FD',
  },
  modalText: {
    flex: 1,
    fontSize: 16,
    color: '#2C3E50',
    marginLeft: 12,
  },
  modalTextSelected: {
    color: '#4A90D9',
    fontWeight: '600',
  },
  flagText: {
    fontSize: 24,
  },
  modalClose: {
    marginTop: 8,
    padding: 16,
    alignItems: 'center',
  },
  modalCloseText: {
    fontSize: 16,
    color: '#E74C3C',
    fontWeight: '500',
  },
});

export default SettingsScreen;
=======
});
>>>>>>> main
