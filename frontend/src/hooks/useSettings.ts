import { useCallback } from 'react';
import { useSettings } from '../contexts/SettingsContext';

export interface UseSettingsReturn {
  // Settings values
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
  isLoading: boolean;
  
  // Actions
  setBackendUrl: (url: string) => Promise<void>;
  setMatchThreshold: (threshold: number) => Promise<void>;
  setTheme: (theme: 'light' | 'dark' | 'system') => Promise<void>;
  setEnablePushNotifications: (enabled: boolean) => Promise<void>;
  setAutoSync: (enabled: boolean) => Promise<void>;
  setDefaultLocation: (location: { lat?: number; lng?: number; name?: string } | null) => Promise<void>;
  resetSettings: () => Promise<void>;
}

/**
 * Hook for managing application settings
 * Provides convenient accessors and type-safe updaters
 */
export const useSettingsHook = (): UseSettingsReturn => {
  const { settings, updateSetting, resetSettings, isLoading } = useSettings();

  const setBackendUrl = useCallback(
    (url: string) => updateSetting('backendUrl', url),
    [updateSetting]
  );

  const setMatchThreshold = useCallback(
    (threshold: number) => updateSetting('matchThreshold', Math.max(0.5, Math.min(1.0, threshold))),
    [updateSetting]
  );

  const setTheme = useCallback(
    (theme: 'light' | 'dark' | 'system') => updateSetting('theme', theme),
    [updateSetting]
  );

  const setEnablePushNotifications = useCallback(
    (enabled: boolean) => updateSetting('enablePushNotifications', enabled),
    [updateSetting]
  );

  const setAutoSync = useCallback(
    (enabled: boolean) => updateSetting('autoSync', enabled),
    [updateSetting]
  );

  const setDefaultLocation = useCallback(
    (location: { lat?: number; lng?: number; name?: string } | null) => 
      updateSetting('defaultLocation', location),
    [updateSetting]
  );

  return {
    backendUrl: settings.backendUrl,
    matchThreshold: settings.matchThreshold,
    theme: settings.theme,
    enablePushNotifications: settings.enablePushNotifications,
    autoSync: settings.autoSync,
    defaultLocation: settings.defaultLocation,
    isLoading,
    setBackendUrl,
    setMatchThreshold,
    setTheme,
    setEnablePushNotifications,
    setAutoSync,
    setDefaultLocation,
    resetSettings,
  };
};

// Keep backwards compatibility
export function useAppSettings(): UseSettingsReturn {
  return useSettingsHook();
}
