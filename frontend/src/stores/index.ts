/**
 * Stores Barrel Export
 * T3: State Management
 */

// Storage
export {mmkvStorage, StorageKeys, clearAllStorage, getStorageInfo} from './storage';

// Stores
export {useAppStore, useApp, useTheme, useIsDarkMode, useIsOnline, useLanguage} from './appStore';
export {
  useScanStore, 
  useScan, 
  useScanStatus, 
  useCapturedPhoto, 
  useScanLocation, 
  useScanResult, 
  useScanError, 
  useScanHistory,
  createScanResult,
} from './scanStore';
export {
  useSettingsStore,
  useSettings,
  useApiUrl,
  useApiKey,
  useMatchThreshold,
  useDebugMode,
  useCacheDuration,
} from './settingsStore';

// Re-export Types
export type {AppState, ScanState, SettingsState, ScanResult, ScanStatus} from '../types/store';
