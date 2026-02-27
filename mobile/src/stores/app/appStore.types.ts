export type AppTheme = 'light' | 'dark' | 'system';
export type AppLanguage = 'de' | 'en' | 'it';

export interface AppState {
  // Theme
  theme: AppTheme;
  isSystemDark: boolean;
  
  // Onboarding
  onboardingCompleted: boolean;
  onboardingStep: number;
  
  // App status
  appVersion: string;
  lastSync: number | null;
  isOnline: boolean;
  
  // Localization
  language: AppLanguage;
  
  // Navigation
  lastRoute: string | null;
}

export interface AppActions {
  // Theme
  setTheme: (theme: AppTheme) => void;
  setSystemDark: (isDark: boolean) => void;
  
  // Onboarding
  completeOnboarding: () => void;
  setOnboardingStep: (step: number) => void;
  resetOnboarding: () => void;
  
  // Status
  setOnlineStatus: (isOnline: boolean) => void;
  updateLastSync: () => void;
  setAppVersion: (version: string) => void;
  
  // Localization
  setLanguage: (language: AppLanguage) => void;
  
  // Navigation
  setLastRoute: (route: string | null) => void;
}
