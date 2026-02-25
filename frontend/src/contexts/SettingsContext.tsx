import React, { createContext, useContext, useCallback, useEffect, useState } from 'react';
import { Preferences } from '@capacitor/preferences';

export interface Settings {
  backendUrl: string;
  matchThreshold: number;
  theme: 'light' | 'dark' | 'system';
  enablePushNotifications: boolean;
  autoSync: boolean;
  defaultLocation: {
    lat?: number;
    lng?: number;
    name?: string;
  } | null;
}

const DEFAULT_SETTINGS: Settings = {
  backendUrl: 'https://api.tauben-scanner.example.com',
  matchThreshold: 0.80,
  theme: 'system',
  enablePushNotifications: false,
  autoSync: true,
  defaultLocation: null,
};

const SETTINGS_KEY = 'app_settings';

interface SettingsContextType {
  settings: Settings;
  updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => Promise<void>;
  updateSettings: (newSettings: Partial<Settings>) => Promise<void>;
  resetSettings: () => Promise<void>;
  isLoading: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  // Load settings from storage on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const { value } = await Preferences.get({ key: SETTINGS_KEY });
        if (value) {
          const parsed = JSON.parse(value);
          setSettings({ ...DEFAULT_SETTINGS, ...parsed });
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadSettings();
  }, []);

  // Save settings to storage whenever they change
  const saveSettings = useCallback(async (newSettings: Settings) => {
    try {
      await Preferences.set({ key: SETTINGS_KEY, value: JSON.stringify(newSettings) });
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  }, []);

  const updateSetting = useCallback(async <K extends keyof Settings>(key: K, value: Settings[K]) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    await saveSettings(newSettings);
  }, [settings, saveSettings]);

  const updateSettings = useCallback(async (newSettings: Partial<Settings>) => {
    const merged = { ...settings, ...newSettings };
    setSettings(merged);
    await saveSettings(merged);
  }, [settings, saveSettings]);

  const resetSettings = useCallback(async () => {
    setSettings(DEFAULT_SETTINGS);
    await saveSettings(DEFAULT_SETTINGS);
  }, []);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSetting,
        updateSettings,
        resetSettings,
        isLoading,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export { DEFAULT_SETTINGS };
