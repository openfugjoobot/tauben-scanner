/**
 * App Store - Theme, Online-Status, App-Einstellungen
 * T3: State Management
 */

import {Appearance} from 'react-native';
import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';
import {AppState} from '../types/store';
import {mmkvStorage, StorageKeys} from './storage';

// Hilfsfunktion für Dark Mode Erkennung
const getIsDarkMode = (theme: 'light' | 'dark' | 'system'): boolean => {
  if (theme === 'dark') return true;
  if (theme === 'light') return false;
  // System theme
  return Appearance.getColorScheme() === 'dark';
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial State
      theme: 'system',
      isDarkMode: getIsDarkMode('system'),
      isOnline: true,
      lastOnlineCheck: null,
      language: 'de',
      onboardingCompleted: false,
      appVersion: '1.0.0',

      // Actions
      setTheme: (theme) => {
        const isDarkMode = getIsDarkMode(theme);
        set({theme, isDarkMode});
      },

      toggleTheme: () => {
        const currentTheme = get().theme;
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        get().setTheme(newTheme);
      },

      setOnlineStatus: (isOnline) => {
        set({
          isOnline,
          lastOnlineCheck: Date.now(),
        });
      },

      setLanguage: (language) => {
        set({language});
      },

      completeOnboarding: () => {
        set({onboardingCompleted: true});
      },
    }),
    {
      name: StorageKeys.APP_STATE,
      storage: createJSONStorage(() => mmkvStorage),
      // Nur bestimmte Felder persistieren
      partialize: (state) => ({
        theme: state.theme,
        language: state.language,
        onboardingCompleted: state.onboardingCompleted,
        appVersion: state.appVersion,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Theme nach Rehydration anwenden
          const isDarkMode = getIsDarkMode(state.theme);
          // Update store with correct dark mode value
          useAppStore.setState({isDarkMode});
        }
      },
    }
  )
);

// Custom Hook für einfachen Zugriff
export const useApp = () => {
  const store = useAppStore();
  return {
    // State
    theme: store.theme,
    isDarkMode: store.isDarkMode,
    isOnline: store.isOnline,
    lastOnlineCheck: store.lastOnlineCheck,
    language: store.language,
    onboardingCompleted: store.onboardingCompleted,
    appVersion: store.appVersion,
    // Actions
    setTheme: store.setTheme,
    toggleTheme: store.toggleTheme,
    setOnlineStatus: store.setOnlineStatus,
    setLanguage: store.setLanguage,
    completeOnboarding: store.completeOnboarding,
  };
};

// Selector Hooks für Performance
export const useTheme = () => useAppStore((state) => state.theme);
export const useIsDarkMode = () => useAppStore((state) => state.isDarkMode);
export const useIsOnline = () => useAppStore((state) => state.isOnline);
export const useLanguage = () => useAppStore((state) => state.language);
