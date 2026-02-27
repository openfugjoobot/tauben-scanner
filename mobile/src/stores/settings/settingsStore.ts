import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { StorageKeys, createMmkvStorage } from '../storage';
import type { SettingsState, SettingsActions } from './settingsStore.types';

// Production API URL
const PRODUCTION_API_URL = 'https://tauben-scanner.fugjoo.duckdns.org/api';

const DEFAULTS = {
  apiUrl: (process.env.EXPO_PUBLIC_API_URL || PRODUCTION_API_URL).replace(/\/$/, ''),
  matchThreshold: 75,
  language: 'de' as const,
};

export const useSettingsStore = create<SettingsState & SettingsActions>()(
  persist(
    (set, get) => ({
      // State
      apiUrl: DEFAULTS.apiUrl,
      apiKey: null,
      userName: '',
      notificationsEnabled: true,
      autoSync: true,
      matchThreshold: DEFAULTS.matchThreshold,
      savePhotos: true,
      debugMode: false,
      language: DEFAULTS.language,

      // Actions
      setApiUrl: (apiUrl) => set({ apiUrl }),
      setApiKey: (apiKey) => set({ apiKey }),
      setMatchThreshold: (threshold) => {
        const clamped = Math.max(0, Math.min(100, threshold));
        set({ matchThreshold: clamped });
      },
      toggleNotifications: () => set({ notificationsEnabled: !get().notificationsEnabled }),
      toggleAutoSync: () => set({ autoSync: !get().autoSync }),
      toggleSavePhotos: () => set({ savePhotos: !get().savePhotos }),
      toggleDebugMode: () => set({ debugMode: !get().debugMode }),
      setLanguage: (language) => set({ language }),
      resetSettings: () => set({
        apiUrl: DEFAULTS.apiUrl,
        apiKey: null,
        userName: '',
        notificationsEnabled: true,
        autoSync: true,
        matchThreshold: DEFAULTS.matchThreshold,
        savePhotos: true,
        debugMode: false,
        language: DEFAULTS.language,
      }),
    }),
    {
      name: StorageKeys.SETTINGS_STATE,
      storage: createJSONStorage(() => createMmkvStorage()),
    }
  )
);

// Selector hooks
export const useApiUrl = () => useSettingsStore((state) => state.apiUrl);
export const useApiKey = () => useSettingsStore((state) => state.apiKey);
export const useMatchThreshold = () => useSettingsStore((state) => state.matchThreshold);
export const useDebugMode = () => useSettingsStore((state) => state.debugMode);
export const useLanguage = () => useSettingsStore((state) => state.language);
