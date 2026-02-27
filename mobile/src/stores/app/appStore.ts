import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { StorageKeys, createMmkvStorage } from '../storage';
import type { AppState, AppActions, AppTheme, AppLanguage } from './appStore.types';

export * from './appStore.types';

const APP_VERSION = '1.0.0';

const INITIAL_STATE: Omit<AppState, keyof AppActions> = {
  theme: 'system',
  isSystemDark: false,
  onboardingCompleted: false,
  onboardingStep: 0,
  appVersion: APP_VERSION,
  lastSync: null,
  isOnline: true,
  language: 'de',
  lastRoute: null,
};

export const useAppStore = create<AppState & AppActions>()(
  persist(
    (set) => ({
      ...INITIAL_STATE,

      // Theme
      setTheme: (theme) => set({ theme }),
      setSystemDark: (isSystemDark) => set({ isSystemDark }),

      // Onboarding
      completeOnboarding: () => set({ 
        onboardingCompleted: true, 
        onboardingStep: 3 
      }),
      setOnboardingStep: (onboardingStep) => set({ onboardingStep }),
      resetOnboarding: () => set({ 
        onboardingCompleted: false, 
        onboardingStep: 0 
      }),

      // Status
      setOnlineStatus: (isOnline) => set({ isOnline }),
      updateLastSync: () => set({ lastSync: Date.now() }),
      setAppVersion: (appVersion) => set({ appVersion }),

      // Localization
      setLanguage: (language) => set({ language }),

      // Navigation
      setLastRoute: (lastRoute) => set({ lastRoute }),
    }),
    {
      name: StorageKeys.APP_STATE,
      storage: createJSONStorage(() => createMmkvStorage()),
      partialize: (state) => ({
        theme: state.theme,
        language: state.language,
        onboardingCompleted: state.onboardingCompleted,
        onboardingStep: state.onboardingStep,
        appVersion: state.appVersion,
        lastSync: state.lastSync,
        lastRoute: state.lastRoute,
        // Note: isSystemDark and isOnline are NOT persisted (runtime only)
      }),
    }
  )
);

// Computed theme based on system preference
export const useEffectiveTheme = () => {
  const { theme, isSystemDark } = useAppStore();
  if (theme === 'system') {
    return isSystemDark ? 'dark' : 'light';
  }
  return theme;
};

// Selectors
export const useTheme = () => useAppStore((s) => s.theme);
export const useLanguage = () => useAppStore((s) => s.language);
export const useOnboardingCompleted = () => useAppStore((s) => s.onboardingCompleted);
export const useOnboardingStep = () => useAppStore((s) => s.onboardingStep);
export const useIsOnline = () => useAppStore((s) => s.isOnline);
export const useAppVersion = () => useAppStore((s) => s.appVersion);
export const useLastSync = () => useAppStore((s) => s.lastSync);
