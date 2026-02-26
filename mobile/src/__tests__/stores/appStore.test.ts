/**
 * @jest-environment node
 */
import { useAppStore } from '../../stores/app';

// Mock MMKV storage
jest.mock('../../stores/storage', () => ({
  StorageKeys: {
    APP_STATE: 'app-state',
  },
  createMmkvStorage: () => ({
    getItem: jest.fn(() => null),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  }),
}));

describe('AppStore', () => {
  beforeEach(() => {
    useAppStore.setState({
      theme: 'system',
      isSystemDark: false,
      onboardingCompleted: false,
      onboardingStep: 0,
      appVersion: '1.0.0',
      lastSync: null,
      isOnline: true,
      language: 'de',
      lastRoute: null,
    });
  });

  describe('Initial State', () => {
    it('should have correct default values', () => {
      const state = useAppStore.getState();
      
      expect(state.theme).toBe('system');
      expect(state.isSystemDark).toBe(false);
      expect(state.onboardingCompleted).toBe(false);
      expect(state.onboardingStep).toBe(0);
      expect(state.appVersion).toBe('1.0.0');
      expect(state.lastSync).toBeNull();
      expect(state.isOnline).toBe(true);
      expect(state.language).toBe('de');
      expect(state.lastRoute).toBeNull();
    });
  });

  describe('Theme Management', () => {
    it('should set theme', () => {
      useAppStore.getState().setTheme('dark');
      expect(useAppStore.getState().theme).toBe('dark');

      useAppStore.getState().setTheme('light');
      expect(useAppStore.getState().theme).toBe('light');

      useAppStore.getState().setTheme('system');
      expect(useAppStore.getState().theme).toBe('system');
    });

    it('should set system dark mode', () => {
      useAppStore.getState().setSystemDark(true);
      expect(useAppStore.getState().isSystemDark).toBe(true);
    });
  });

  describe('Onboarding', () => {
    it('should complete onboarding', () => {
      useAppStore.getState().completeOnboarding();
      
      const state = useAppStore.getState();
      expect(state.onboardingCompleted).toBe(true);
      expect(state.onboardingStep).toBe(3);
    });

    it('should set onboarding step', () => {
      useAppStore.getState().setOnboardingStep(1);
      expect(useAppStore.getState().onboardingStep).toBe(1);

      useAppStore.getState().setOnboardingStep(2);
      expect(useAppStore.getState().onboardingStep).toBe(2);
    });

    it('should reset onboarding', () => {
      useAppStore.getState().completeOnboarding();
      useAppStore.getState().resetOnboarding();
      
      const state = useAppStore.getState();
      expect(state.onboardingCompleted).toBe(false);
      expect(state.onboardingStep).toBe(0);
    });
  });

  describe('Status Management', () => {
    it('should set online status', () => {
      useAppStore.getState().setOnlineStatus(false);
      expect(useAppStore.getState().isOnline).toBe(false);

      useAppStore.getState().setOnlineStatus(true);
      expect(useAppStore.getState().isOnline).toBe(true);
    });

    it('should update last sync timestamp', () => {
      const before = Date.now();
      useAppStore.getState().updateLastSync();
      const after = Date.now();
      
      const lastSync = useAppStore.getState().lastSync;
      expect(lastSync).toBeGreaterThanOrEqual(before);
      expect(lastSync).toBeLessThanOrEqual(after);
    });

    it('should set app version', () => {
      useAppStore.getState().setAppVersion('2.0.0');
      expect(useAppStore.getState().appVersion).toBe('2.0.0');
    });
  });

  describe('Localization', () => {
    it('should set language', () => {
      useAppStore.getState().setLanguage('en');
      expect(useAppStore.getState().language).toBe('en');

      useAppStore.getState().setLanguage('de');
      expect(useAppStore.getState().language).toBe('de');
    });
  });

  describe('Navigation', () => {
    it('should set last route', () => {
      useAppStore.getState().setLastRoute('/pigeons/1');
      expect(useAppStore.getState().lastRoute).toBe('/pigeons/1');
    });
  });

  describe('Selectors (getState)', () => {
    it('should get theme', () => {
      useAppStore.getState().setTheme('dark');
      expect(useAppStore.getState().theme).toBe('dark');
    });

    it('should get language', () => {
      useAppStore.getState().setLanguage('en');
      expect(useAppStore.getState().language).toBe('en');
    });

    it('should get online status', () => {
      useAppStore.getState().setOnlineStatus(false);
      expect(useAppStore.getState().isOnline).toBe(false);
    });
  });
});