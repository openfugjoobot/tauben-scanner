import { MMKV } from 'react-native-mmkv';

// MMKV Storage Keys
export const StorageKeys = {
  AUTH_STATE: 'auth-state',
  SCAN_STATE: 'scan-state',
  SETTINGS_STATE: 'settings-state',
  APP_STATE: 'app-state',
  OFFLINE_CACHE: 'offline-cache',
} as const;

// Create MMKV instance
export const mmkvStorage = new MMKV({
  id: 'tauben-scanner-storage',
  encryptionKey: process.env.EXPO_PUBLIC_STORAGE_KEY,
});

// Zustand storage adapter
export const createMmkvStorage = () => ({
  getItem: (name: string): string | null => mmkvStorage.getString(name) ?? null,
  setItem: (name: string, value: string): void => mmkvStorage.set(name, value),
  removeItem: (name: string): void => mmkvStorage.delete(name),
});

// Storage utilities
export const clearAllStorage = (): void => mmkvStorage.clearAll();

export const getStorageInfo = (): { keys: string[] } => ({
  keys: mmkvStorage.getAllKeys(),
});

export const initializeStorage = (): void => {
  // Storage initialized silently in production
};

/**
 * Migration utility for future storage schema changes
 */
export const migrateStorageData = (): void => {
  // Placeholder for future migrations
  initializeStorage();
};
