export interface SettingsState {
  apiUrl: string;
  apiKey: string | null;
  userName: string;
  notificationsEnabled: boolean;
  autoSync: boolean;
  matchThreshold: number;
  savePhotos: boolean;
  debugMode: boolean;
  language: 'de' | 'en';
}

export interface SettingsActions {
  setApiUrl: (url: string) => void;
  setApiKey: (key: string | null) => void;
  setMatchThreshold: (threshold: number) => void;
  toggleNotifications: () => void;
  toggleAutoSync: () => void;
  toggleSavePhotos: () => void;
  toggleDebugMode: () => void;
  setLanguage: (lang: 'de' | 'en') => void;
  resetSettings: () => void;
}
