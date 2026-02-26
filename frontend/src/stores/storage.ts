/**
 * Storage Konfiguration für Zustand Persistenz
 * T3: State Management
 *
 * Verwendet react-native-mmkv für bessere Performance
 */

import {MMKV} from 'react-native-mmkv';

const mmkv = new MMKV({
  id: 'tauben-scanner-storage',
  encryptionKey: 'tauben-scanner-secure-key',
});

// Storage Interface für Zustand persist
interface Storage {
  getItem: (name: string) => string | null | Promise<string | null>;
  setItem: (name: string, value: string) => void | Promise<void>;
  removeItem: (name: string) => void | Promise<void>;
}

// MMKV Storage für React Native
export const mmkvStorage: Storage = {
  getItem: (name: string): string | null => {
    try {
      return mmkv.getString(name) ?? null;
    } catch {
      return null;
    }
  },
  setItem: (name: string, value: string): void => {
    try {
      mmkv.set(name, value);
    } catch {
      // ignore
    }
  },
  removeItem: (name: string): void => {
    try {
      mmkv.delete(name);
    } catch {
      // ignore
    }
  },
};

// Spezifische Storage-Keys
export const StorageKeys = {
  APP_STATE: 'app-store',
  SCAN_STATE: 'scan-store',
  SETTINGS_STATE: 'settings-store',
} as const;

// Storage-Utility-Objekt mit zusätzlichen Methoden
export const storage = {
  getSize: (): number => {
    try {
      return mmkv.getAllKeys().length;
    } catch {
      return 0;
    }
  },

  getAllKeys: (): string[] => {
    try {
      return mmkv.getAllKeys();
    } catch {
      return [];
    }
  },

  clearAll: (): void => {
    try {
      mmkv.clearAll();
    } catch {
      // ignore
    }
  },
};

// Debug-Funktion für Development
export const clearAllStorage = (): void => {
  if (__DEV__) {
    mmkv.clearAll();
  }
};

// Storage-Info für Debugging
export const getStorageInfo = () => {
  return {
    size: storage.getSize(),
    keys: storage.getAllKeys(),
  };
};
