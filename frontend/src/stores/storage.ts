/**
 * Storage Konfiguration für Zustand Persistenz
 * T3: State Management
 * 
 * Für React Native: MMKV Storage
 * Für Web: localStorage Fallback
 */

// Storage Interface für Zustand persist
interface Storage {
  getItem: (name: string) => string | null | Promise<string | null>;
  setItem: (name: string, value: string) => void | Promise<void>;
  removeItem: (name: string) => void | Promise<void>;
}

// MMKV-ähnliche Storage für Web
const createWebStorage = (): Storage => ({
  getItem: (name: string): string | null => {
    try {
      return localStorage.getItem(name);
    } catch {
      return null;
    }
  },
  setItem: (name: string, value: string): void => {
    try {
      localStorage.setItem(name, value);
    } catch {
      // ignore
    }
  },
  removeItem: (name: string): void => {
    try {
      localStorage.removeItem(name);
    } catch {
      // ignore
    }
  },
});

// Lazy-loaded MMKV für React Native
let mmkvInstance: Storage | null = null;

const getMMKVStorage = (): Storage => {
  if (mmkvInstance) return mmkvInstance;
  
  try {
    // @ts-ignore - MMKV ist nur in React Native verfügbar
    const {MMKV} = require('react-native-mmkv');
    const mmkv = new MMKV({
      id: 'tauben-scanner-storage',
      encryptionKey: 'tauben-scanner-secure-key',
    });
    
    mmkvInstance = {
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
    
    return mmkvInstance;
  } catch {
    // Fallback zu localStorage wenn MMKV nicht verfügbar
    return createWebStorage();
  }
};

// Storage-Instanz (wahlweise MMKV oder localStorage)
const getStorage = (): Storage => {
  try {
    // Prüfe ob wir in React Native sind
    if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
      return getMMKVStorage();
    }
  } catch {
    // ignore
  }
  return createWebStorage();
};

// Exportiere die Storage-Instanz
export const mmkvStorage: Storage = getStorage();

// Spezifische Storage-Keys
export const StorageKeys = {
  APP_STATE: 'app-store',
  SCAN_STATE: 'scan-store',
  SETTINGS_STATE: 'settings-store',
} as const;

// Storage-Utility-Objekt mit zusätzlichen Methoden
class StorageWrapper {
  getSize(): number {
    try {
      return localStorage.length;
    } catch {
      return 0;
    }
  }

  getAllKeys(): string[] {
    try {
      const keys: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) keys.push(key);
      }
      return keys;
    } catch {
      return [];
    }
  }

  clearAll(): void {
    try {
      localStorage.clear();
    } catch {
      // ignore
    }
  }
}

export const storage = new StorageWrapper();

// Debug-Funktion für Development
export const clearAllStorage = (): void => {
  const isDev = (__DEV__ === true) || process?.env?.NODE_ENV === 'development' || import.meta?.env?.DEV;
  if (isDev) {
    try {
      localStorage.clear();
      console.log('All storage cleared');
    } catch {
      // ignore
    }
  }
};

// Storage-Info für Debugging
export const getStorageInfo = () => {
  return {
    size: storage.getSize(),
    keys: storage.getAllKeys(),
  };
};
