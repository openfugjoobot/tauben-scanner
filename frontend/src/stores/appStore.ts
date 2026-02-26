/**
 * App Store - Theme, Online-Status, App-Einstellungen
 * T3: State Management
 */

import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';
import {AppState} from '../types/store';
import {mmkvStorage, StorageKeys} from './storage';

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial State
      theme: 'system',
      isDarkMode: false,
      isOnline: true,
      lastOnlineCheck: null,
      language: 'de',
      onboardingCompleted: false,
      appVersion: '1.0.0',
      
      // Actions
      setTheme: (theme) => {
        const isDarkMode = 
          theme === 'dark' || 
          (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
        
        set({theme, isDarkMode});
        
        // DOM-Klasse aktualisieren für CSS
        document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
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
        document.documentElement.setAttribute('lang', language);
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
          const isDarkMode = 
            state.theme === 'dark' || 
            (state.theme === 'system' && 
              window.matchMedia('(prefers-color-scheme: dark)').matches);
          
          document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
          document.documentElement.setAttribute('lang', state.language);
        }
        console.log('AppStore rehydrated');
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
