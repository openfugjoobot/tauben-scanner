/**
 * Settings Store - API-URL, Benutzereinstellungen
 * T3: State Management
<<<<<<< HEAD
 * T9: Settings Screen
=======
>>>>>>> main
 */

import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';
<<<<<<< HEAD
import {SettingsState, ThemeMode, Language} from '../types/store';
=======
import {SettingsState} from '../types/store';
>>>>>>> main
import {mmkvStorage, StorageKeys} from './storage';

// Default-Werte
const DEFAULT_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const DEFAULT_MATCH_THRESHOLD = 75;
const DEFAULT_CACHE_DURATION = 60;

<<<<<<< HEAD
// App Version
const APP_VERSION = '1.0.0';

=======
>>>>>>> main
export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      // Initial State
      apiUrl: DEFAULT_API_URL,
      apiKey: null,
      userName: '',
      userEmail: '',
      notificationsEnabled: true,
      autoSync: true,
      matchThreshold: DEFAULT_MATCH_THRESHOLD,
      savePhotos: true,
      compressPhotos: true,
<<<<<<< HEAD
      theme: 'system' as ThemeMode,
      language: 'de' as Language,
      offlineMode: false,
=======
>>>>>>> main
      debugMode: false,
      cacheDuration: DEFAULT_CACHE_DURATION,
      
      // Actions
      setApiUrl: (apiUrl) => {
        set({apiUrl});
        // API-URL auch in localStorage für Legacy-Support
        try {
          localStorage.setItem('apiUrl', apiUrl);
        } catch {
          // ignore
        }
      },
      
      setApiKey: (apiKey) => set({apiKey}),
      
      setUserName: (userName) => set({userName}),
      
      setUserEmail: (userEmail) => set({userEmail}),
      
      toggleNotifications: () => {
        const current = get().notificationsEnabled;
        set({notificationsEnabled: !current});
      },
      
      toggleAutoSync: () => {
        const current = get().autoSync;
        set({autoSync: !current});
      },
      
      setMatchThreshold: (matchThreshold) => {
        // Wert zwischen 0 und 100 begrenzen
        const clamped = Math.max(0, Math.min(100, matchThreshold));
        set({matchThreshold: clamped});
      },
      
      toggleSavePhotos: () => {
        const current = get().savePhotos;
        set({savePhotos: !current});
      },
      
      toggleCompressPhotos: () => {
        const current = get().compressPhotos;
        set({compressPhotos: !current});
      },
      
<<<<<<< HEAD
      setTheme: (theme) => {
        set({theme});
        // Trigger theme change event
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('theme-change', {detail: theme}));
        }
      },
      
      setLanguage: (language) => {
        set({language});
        // Trigger language change event
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('language-change', {detail: language}));
        }
      },
      
      toggleOfflineMode: () => {
        const current = get().offlineMode;
        const newValue = !current;
        set({offlineMode: newValue});
      },
      
      setOfflineMode: (offlineMode) => {
        set({offlineMode});
      },
      
=======
>>>>>>> main
      toggleDebugMode: () => {
        const current = get().debugMode;
        const newValue = !current;
        set({debugMode: newValue});
        
        // Debug-Info in Console
        if (newValue) {
          console.log('[Debug Mode] Aktiviert');
        }
      },
      
      setCacheDuration: (cacheDuration) => {
        // Mindestens 5 Minuten, maximal 7 Tage (10080 Minuten)
        const clamped = Math.max(5, Math.min(10080, cacheDuration));
        set({cacheDuration: clamped});
      },
      
<<<<<<< HEAD
      testApiConnection: async () => {
        const {apiUrl} = get();
        try {
          const response = await fetch(`${apiUrl}/health`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          
          if (response.ok) {
            return {success: true, message: 'Verbindung erfolgreich'};
          } else {
            return {success: false, message: `Fehler: ${response.status} ${response.statusText}`};
          }
        } catch (error) {
          return {success: false, message: `Verbindungsfehler: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`};
        }
      },
      
=======
>>>>>>> main
      resetSettings: () => {
        set({
          apiUrl: DEFAULT_API_URL,
          apiKey: null,
          userName: '',
          userEmail: '',
          notificationsEnabled: true,
          autoSync: true,
          matchThreshold: DEFAULT_MATCH_THRESHOLD,
          savePhotos: true,
          compressPhotos: true,
<<<<<<< HEAD
          theme: 'system',
          language: 'de',
          offlineMode: false,
=======
>>>>>>> main
          debugMode: false,
          cacheDuration: DEFAULT_CACHE_DURATION,
        });
        
        // Auch localStorage aktualisieren
        try {
          localStorage.setItem('apiUrl', DEFAULT_API_URL);
        } catch {
          // ignore
        }
      },
    }),
    {
      name: StorageKeys.SETTINGS_STATE,
      storage: createJSONStorage(() => mmkvStorage),
      partialize: (state) => ({
        apiUrl: state.apiUrl,
        apiKey: state.apiKey,
        userName: state.userName,
        userEmail: state.userEmail,
        notificationsEnabled: state.notificationsEnabled,
        autoSync: state.autoSync,
        matchThreshold: state.matchThreshold,
        savePhotos: state.savePhotos,
        compressPhotos: state.compressPhotos,
<<<<<<< HEAD
        theme: state.theme,
        language: state.language,
        offlineMode: state.offlineMode,
=======
>>>>>>> main
        debugMode: state.debugMode,
        cacheDuration: state.cacheDuration,
      }),
      onRehydrateStorage: () => (state) => {
        console.log('SettingsStore rehydrated, API URL:', state?.apiUrl);
        
        // Sync mit localStorage für Legacy-Support
        if (state?.apiUrl) {
          try {
            localStorage.setItem('apiUrl', state.apiUrl);
          } catch {
            // ignore
          }
        }
      },
    }
  )
);

// Custom Hook für einfachen Zugriff
export const useSettings = () => {
  const store = useSettingsStore();
  return {
    // State
    apiUrl: store.apiUrl,
    apiKey: store.apiKey,
    userName: store.userName,
    userEmail: store.userEmail,
    notificationsEnabled: store.notificationsEnabled,
    autoSync: store.autoSync,
    matchThreshold: store.matchThreshold,
    savePhotos: store.savePhotos,
    compressPhotos: store.compressPhotos,
<<<<<<< HEAD
    theme: store.theme,
    language: store.language,
    offlineMode: store.offlineMode,
    debugMode: store.debugMode,
    cacheDuration: store.cacheDuration,
    appVersion: APP_VERSION,
    // Computed
    isConfigured: !!store.apiUrl,
    isDarkMode: store.theme === 'dark' || (store.theme === 'system' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches),
=======
    debugMode: store.debugMode,
    cacheDuration: store.cacheDuration,
    // Computed
    isConfigured: !!store.apiUrl,
>>>>>>> main
    // Actions
    setApiUrl: store.setApiUrl,
    setApiKey: store.setApiKey,
    setUserName: store.setUserName,
    setUserEmail: store.setUserEmail,
    toggleNotifications: store.toggleNotifications,
    toggleAutoSync: store.toggleAutoSync,
    setMatchThreshold: store.setMatchThreshold,
    toggleSavePhotos: store.toggleSavePhotos,
    toggleCompressPhotos: store.toggleCompressPhotos,
<<<<<<< HEAD
    setTheme: store.setTheme,
    setLanguage: store.setLanguage,
    toggleOfflineMode: store.toggleOfflineMode,
    setOfflineMode: store.setOfflineMode,
    toggleDebugMode: store.toggleDebugMode,
    setCacheDuration: store.setCacheDuration,
    testApiConnection: store.testApiConnection,
=======
    toggleDebugMode: store.toggleDebugMode,
    setCacheDuration: store.setCacheDuration,
>>>>>>> main
    resetSettings: store.resetSettings,
  };
};

// Selector Hooks für Performance
export const useApiUrl = () => useSettingsStore((state) => state.apiUrl);
export const useApiKey = () => useSettingsStore((state) => state.apiKey);
export const useMatchThreshold = () => useSettingsStore((state) => state.matchThreshold);
export const useDebugMode = () => useSettingsStore((state) => state.debugMode);
export const useCacheDuration = () => useSettingsStore((state) => state.cacheDuration);
<<<<<<< HEAD
export const useTheme = () => useSettingsStore((state) => state.theme);
export const useLanguage = () => useSettingsStore((state) => state.language);
export const useOfflineMode = () => useSettingsStore((state) => state.offlineMode);

// Export app version
export {APP_VERSION};
=======
>>>>>>> main
