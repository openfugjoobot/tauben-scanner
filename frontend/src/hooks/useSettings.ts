import { useState, useCallback } from 'react';

interface Settings {
  apiUrl: string;
  apiKey: string;
  notificationsEnabled: boolean;
  autoSync: boolean;
  matchThreshold: number;
}

const defaultSettings: Settings = {
  apiUrl: 'http://localhost:3000',
  apiKey: '',
  notificationsEnabled: true,
  autoSync: true,
  matchThreshold: 70,
};

export const useSettingsHook = () => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  const updateSetting = useCallback(<K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  },
  []);

  const resetSettings = useCallback(() => {
    setSettings(defaultSettings);
  }, []);

  return {
    settings,
    updateSetting,
    resetSettings,
  };
};

export const useAppSettings = useSettingsHook;
