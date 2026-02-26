/**
 * TypeScript Interfaces für alle Store-States
 * T3: State Management
 */

// ==========================================
// App Store Types
// ==========================================
export interface AppState {
  // Theme
  theme: 'light' | 'dark' | 'system';
  isDarkMode: boolean;
  
  // Online Status
  isOnline: boolean;
  lastOnlineCheck: number | null;
  
  // App Settings
  language: string;
  onboardingCompleted: boolean;
  appVersion: string;
  
  // Actions
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  toggleTheme: () => void;
  setOnlineStatus: (isOnline: boolean) => void;
  setLanguage: (language: string) => void;
  completeOnboarding: () => void;
}

// ==========================================
// Scan Store Types
// ==========================================
export type ScanStatus = 'idle' | 'capturing' | 'uploading' | 'processing' | 'completed' | 'error';

export interface ScanResult {
  id: string;
  pigeonId: string | null;
  confidence: number;
  matchedPhotoUrl?: string;
  timestamp: number;
}

export interface ScanState {
  // Current Scan
  status: ScanStatus;
  capturedPhoto: string | null; // base64 or URI
  location: {
    latitude: number;
    longitude: number;
    accuracy: number;
    timestamp: number;
  } | null;
  
  // Results
  result: ScanResult | null;
  error: string | null;
  
  // History
  scanHistory: ScanResult[];
  
  // Actions
  setStatus: (status: ScanStatus) => void;
  setCapturedPhoto: (photo: string | null) => void;
  setLocation: (location: ScanState['location']) => void;
  setResult: (result: ScanResult | null) => void;
  setError: (error: string | null) => void;
  addToHistory: (result: ScanResult) => void;
  clearHistory: () => void;
  resetScan: () => void;
}

// ==========================================
// Settings Store Types
// ==========================================
<<<<<<< HEAD
export type ThemeMode = 'light' | 'dark' | 'system';
export type Language = 'de' | 'en';

=======
>>>>>>> main
export interface SettingsState {
  // API Settings
  apiUrl: string;
  apiKey: string | null;
  
  // User Settings
  userName: string;
  userEmail: string;
  notificationsEnabled: boolean;
  autoSync: boolean;
  
  // Scan Settings
  matchThreshold: number; // 0-100
  savePhotos: boolean;
  compressPhotos: boolean;
  
<<<<<<< HEAD
  // Theme & Language
  theme: ThemeMode;
  language: Language;
  
  // Connectivity
  offlineMode: boolean;
  
=======
>>>>>>> main
  // Advanced
  debugMode: boolean;
  cacheDuration: number; // in minutes
  
  // Actions
  setApiUrl: (url: string) => void;
  setApiKey: (key: string | null) => void;
  setUserName: (name: string) => void;
  setUserEmail: (email: string) => void;
  toggleNotifications: () => void;
  toggleAutoSync: () => void;
  setMatchThreshold: (threshold: number) => void;
  toggleSavePhotos: () => void;
  toggleCompressPhotos: () => void;
  toggleDebugMode: () => void;
  setCacheDuration: (minutes: number) => void;
<<<<<<< HEAD
  setTheme: (theme: ThemeMode) => void;
  setLanguage: (language: Language) => void;
  toggleOfflineMode: () => void;
  setOfflineMode: (value: boolean) => void;
  testApiConnection: () => Promise<{success: boolean; message: string}>;
=======
>>>>>>> main
  resetSettings: () => void;
}

// ==========================================
// API Response Types (für React Query)
// ==========================================
export interface Pigeon {
  id: string;
  name: string;
  ringNumber: string | null;
  color: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Sighting {
  id: string;
  pigeonId: string;
  location: {
    latitude: number;
    longitude: number;
  };
  photoUrl: string | null;
  notes: string | null;
  spottedAt: string;
  createdAt: string;
}

export interface MatchResponse {
  success: boolean;
  pigeon: Pigeon | null;
  confidence: number;
  message: string;
}

// ==========================================
// Query Keys für React Query
// ==========================================
export const queryKeys = {
  pigeons: ['pigeons'] as const,
  pigeon: (id: string) => ['pigeons', id] as const,
  sightings: ['sightings'] as const,
  sightingsByPigeon: (pigeonId: string) => ['sightings', 'pigeon', pigeonId] as const,
  match: (imageHash: string) => ['match', imageHash] as const,
  settings: ['settings'] as const,
};
