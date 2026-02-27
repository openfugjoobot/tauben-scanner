/**
 * @jest-environment node
 */
import { useSettingsStore } from '../../stores/settings';

// Mock MMKV storage
jest.mock('../../stores/storage', () => ({
  StorageKeys: {
    SETTINGS_STATE: 'settings-state',
  },
  createMmkvStorage: () => ({
    getItem: jest.fn(() => null),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  }),
}));

describe('SettingsStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useSettingsStore.setState({
      apiUrl: 'http://localhost:3000/api',
      apiKey: null,
      userName: '',
      notificationsEnabled: true,
      autoSync: true,
      matchThreshold: 75,
      savePhotos: true,
      debugMode: false,
      language: 'de',
    });
  });

  describe('Initial State', () => {
    it('should have correct default values', () => {
      const state = useSettingsStore.getState();
      
      expect(state.apiUrl).toBe('http://localhost:3000/api');
      expect(state.apiKey).toBeNull();
      expect(state.userName).toBe('');
      expect(state.notificationsEnabled).toBe(true);
      expect(state.autoSync).toBe(true);
      expect(state.matchThreshold).toBe(75);
      expect(state.savePhotos).toBe(true);
      expect(state.debugMode).toBe(false);
      expect(state.language).toBe('de');
    });
  });

  describe('Actions', () => {
    it('should set API URL', () => {
      useSettingsStore.getState().setApiUrl('https://api.example.com');
      
      expect(useSettingsStore.getState().apiUrl).toBe('https://api.example.com');
    });

    it('should set API key', () => {
      useSettingsStore.getState().setApiKey('test-api-key');
      
      expect(useSettingsStore.getState().apiKey).toBe('test-api-key');
    });

    it('should set match threshold and clamp values', () => {
      // Normal value
      useSettingsStore.getState().setMatchThreshold(50);
      expect(useSettingsStore.getState().matchThreshold).toBe(50);

      // Below minimum
      useSettingsStore.getState().setMatchThreshold(-10);
      expect(useSettingsStore.getState().matchThreshold).toBe(0);

      // Above maximum
      useSettingsStore.getState().setMatchThreshold(150);
      expect(useSettingsStore.getState().matchThreshold).toBe(100);
    });

    it('should toggle notifications', () => {
      expect(useSettingsStore.getState().notificationsEnabled).toBe(true);
      
      useSettingsStore.getState().toggleNotifications();
      expect(useSettingsStore.getState().notificationsEnabled).toBe(false);
      
      useSettingsStore.getState().toggleNotifications();
      expect(useSettingsStore.getState().notificationsEnabled).toBe(true);
    });

    it('should toggle auto sync', () => {
      expect(useSettingsStore.getState().autoSync).toBe(true);
      
      useSettingsStore.getState().toggleAutoSync();
      expect(useSettingsStore.getState().autoSync).toBe(false);
    });

    it('should toggle save photos', () => {
      expect(useSettingsStore.getState().savePhotos).toBe(true);
      
      useSettingsStore.getState().toggleSavePhotos();
      expect(useSettingsStore.getState().savePhotos).toBe(false);
    });

    it('should toggle debug mode', () => {
      expect(useSettingsStore.getState().debugMode).toBe(false);
      
      useSettingsStore.getState().toggleDebugMode();
      expect(useSettingsStore.getState().debugMode).toBe(true);
    });

    it('should set language', () => {
      useSettingsStore.getState().setLanguage('en');
      
      expect(useSettingsStore.getState().language).toBe('en');
    });

    it('should reset settings to defaults', () => {
      // Modify all settings
      useSettingsStore.setState({
        apiUrl: 'https://modified.com',
        apiKey: 'key',
        userName: 'user',
        notificationsEnabled: false,
        autoSync: false,
        matchThreshold: 90,
        savePhotos: false,
        debugMode: true,
        language: 'en',
      });

      useSettingsStore.getState().resetSettings();

      const state = useSettingsStore.getState();
      expect(state.apiUrl).toBe('http://localhost:3000/api');
      expect(state.apiKey).toBeNull();
      expect(state.userName).toBe('');
      expect(state.notificationsEnabled).toBe(true);
      expect(state.autoSync).toBe(true);
      expect(state.matchThreshold).toBe(75);
      expect(state.savePhotos).toBe(true);
      expect(state.debugMode).toBe(false);
      expect(state.language).toBe('de');
    });
  });

  describe('Selectors (getState)', () => {
    it('should select API URL', () => {
      useSettingsStore.getState().setApiUrl('https://test.com');
      
      expect(useSettingsStore.getState().apiUrl).toBe('https://test.com');
    });

    it('should select match threshold', () => {
      useSettingsStore.getState().setMatchThreshold(80);
      
      expect(useSettingsStore.getState().matchThreshold).toBe(80);
    });
  });
});