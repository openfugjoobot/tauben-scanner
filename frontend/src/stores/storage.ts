/**
 * Storage Konfiguration für Zustand Persistenz
 * T3: State Management
 *
 * Für React Native: AsyncStorage
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage Interface für Zustand persist
interface Storage {
  getItem: (name: string) => string | null | Promise<string | null>;
  setItem: (name: string, value: string) => void | Promise<void>;
  removeItem: (name: string) => void | Promise<void>;
}

// AsyncStorage für React Native
const createAsyncStorage = (): Storage => ({
  getItem: async (name: string): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(name);
    } catch {
      return null;
    }
  },
  setItem: async (name: string, value: string): Promise<void> => {
    try {
      await AsyncStorage.setItem(name, value);
    } catch {
      // ignore
    }
  },
  removeItem: async (name: string): Promise<void> => {
    try {
      await AsyncStorage.removeItem(name);
    } catch {
      // ignore
    }
  },
});

// Exportiere die Storage-Instanz
export const mmkvStorage: Storage = createAsyncStorage();

// Spezifische Storage-Keys
export const StorageKeys = {
  APP_STATE: 'app-store',
  SCAN_STATE: 'scan-store',
  SETTINGS_STATE: 'settings-store',
} as const;

// Storage-Utility-Objekt mit zusätzlichen Methoden
class StorageWrapper {
  async getSize(): Promise<number> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      return keys.length;
    } catch {
      return 0;
    }
  }

  async getAllKeys(): Promise<string[]> {
    try {
      return await AsyncStorage.getAllKeys();
    } catch {
      return [];
    }
  }

  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch {
      // ignore
    }
  }
}

export const storage = new StorageWrapper();

// Debug-Funktion für Development
export const clearAllStorage = async (): Promise<void> => {
  if (__DEV__) {
    await AsyncStorage.clear();
  }
};

// Storage-Info für Debugging
export const getStorageInfo = async () => {
  return {
    size: await storage.getSize(),
    keys: await storage.getAllKeys(),
  };
};
