/**
 * @jest-environment node
 */
import { useScanStore } from '../../stores/scans';
import type { ScanResult, LocationData } from '../../stores/scans/scanStore.types';

// Mock MMKV storage
jest.mock('../../stores/storage', () => ({
  StorageKeys: {
    SCAN_STATE: 'scan-state',
  },
  createMmkvStorage: () => ({
    getItem: jest.fn(() => null),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  }),
}));

describe('ScanStore', () => {
  beforeEach(() => {
    useScanStore.setState({
      status: 'idle',
      capturedPhoto: null,
      capturedPhotoBase64: null,
      capturedAt: null,
      location: null,
      result: null,
      error: null,
      scanHistory: [],
    });
  });

  describe('Initial State', () => {
    it('should have correct initial values', () => {
      const state = useScanStore.getState();
      
      expect(state.status).toBe('idle');
      expect(state.capturedPhoto).toBeNull();
      expect(state.capturedPhotoBase64).toBeNull();
      expect(state.capturedAt).toBeNull();
      expect(state.location).toBeNull();
      expect(state.result).toBeNull();
      expect(state.error).toBeNull();
      expect(state.scanHistory).toEqual([]);
    });
  });

  describe('Status Management', () => {
    it('should set status', () => {
      useScanStore.getState().setStatus('capturing');
      expect(useScanStore.getState().status).toBe('capturing');

      useScanStore.getState().setStatus('processing');
      expect(useScanStore.getState().status).toBe('processing');

      useScanStore.getState().setStatus('completed');
      expect(useScanStore.getState().status).toBe('completed');
    });
  });

  describe('Photo Capture', () => {
    it('should capture photo with base64', () => {
      const photoUri = 'file://photo.jpg';
      const base64 = 'base64data';
      
      useScanStore.getState().capturePhoto(photoUri, base64);
      
      const state = useScanStore.getState();
      expect(state.capturedPhoto).toBe(photoUri);
      expect(state.capturedPhotoBase64).toBe(base64);
      expect(state.capturedAt).toBeGreaterThan(0);
      expect(state.status).toBe('capturing');
      expect(state.error).toBeNull();
    });
  });

  describe('Location', () => {
    it('should set location', () => {
      const location: LocationData = {
        latitude: 52.52,
        longitude: 13.405,
        accuracy: 10,
        timestamp: Date.now(),
      };
      
      useScanStore.getState().setLocation(location);
      
      expect(useScanStore.getState().location).toEqual(location);
    });
  });

  describe('Results', () => {
    it('should set result', () => {
      const result: ScanResult = {
        id: '1',
        pigeonId: 'pigeon-1',
        confidence: 0.95,
        timestamp: Date.now(),
        isNewPigeon: false,
      };
      
      useScanStore.getState().setResult(result);
      
      const state = useScanStore.getState();
      expect(state.result).toEqual(result);
      expect(state.status).toBe('completed');
      expect(state.error).toBeNull();
    });
  });

  describe('Error Handling', () => {
    it('should set error', () => {
      useScanStore.getState().setError('Something went wrong');
      
      const state = useScanStore.getState();
      expect(state.error).toBe('Something went wrong');
      expect(state.status).toBe('error');
    });
  });

  describe('Clear Current Scan', () => {
    it('should clear current scan data', () => {
      const location: LocationData = {
        latitude: 1,
        longitude: 2,
        accuracy: 5,
        timestamp: Date.now(),
      };
      
      // Set some data first
      useScanStore.setState({
        capturedPhoto: 'file://photo.jpg',
        capturedPhotoBase64: 'base64',
        capturedAt: Date.now(),
        location: location,
        result: { id: '1', pigeonId: 'p1', confidence: 0.9, timestamp: Date.now(), isNewPigeon: false },
        error: 'some error',
        status: 'completed',
      });

      useScanStore.getState().clearCurrentScan();

      const state = useScanStore.getState();
      expect(state.capturedPhoto).toBeNull();
      expect(state.capturedPhotoBase64).toBeNull();
      expect(state.capturedAt).toBeNull();
      expect(state.location).toBeNull();
      expect(state.result).toBeNull();
      expect(state.error).toBeNull();
      expect(state.status).toBe('idle');
    });
  });

  describe('Scan History', () => {
    it('should save scan to history', () => {
      const scan: ScanResult = {
        id: '1',
        timestamp: Date.now(),
        pigeonId: 'p1',
        confidence: 0.95,
        isNewPigeon: false,
      };
      
      useScanStore.getState().saveScan(scan);
      
      const history = useScanStore.getState().scanHistory;
      expect(history).toHaveLength(1);
      expect(history[0]).toEqual(scan);
    });

    it('should prepend new scans to history', () => {
      const scan1: ScanResult = { id: '1', timestamp: 1000, pigeonId: 'p1', confidence: 0.8, isNewPigeon: false };
      const scan2: ScanResult = { id: '2', timestamp: 2000, pigeonId: 'p2', confidence: 0.9, isNewPigeon: false };
      
      useScanStore.getState().saveScan(scan1);
      useScanStore.getState().saveScan(scan2);
      
      const history = useScanStore.getState().scanHistory;
      expect(history[0].id).toBe('2');
      expect(history[1].id).toBe('1');
    });

    it('should limit history to 100 items', () => {
      for (let i = 0; i < 150; i++) {
        useScanStore.getState().saveScan({
          id: `scan-${i}`,
          timestamp: Date.now() + i,
          pigeonId: `pigeon-${i}`,
          confidence: 0.9,
          isNewPigeon: false,
        });
      }
      
      const history = useScanStore.getState().scanHistory;
      expect(history).toHaveLength(100);
      // Should keep most recent
      expect(history[0].id).toBe('scan-149');
    });

    it('should delete scan from history', () => {
      const scan1: ScanResult = { id: '1', timestamp: 1000, pigeonId: 'p1', confidence: 0.8, isNewPigeon: false };
      const scan2: ScanResult = { id: '2', timestamp: 2000, pigeonId: 'p2', confidence: 0.9, isNewPigeon: false };
      
      useScanStore.getState().saveScan(scan1);
      useScanStore.getState().saveScan(scan2);
      useScanStore.getState().deleteScan('1');
      
      const history = useScanStore.getState().scanHistory;
      expect(history).toHaveLength(1);
      expect(history[0].id).toBe('2');
    });

    it('should clear all history', () => {
      useScanStore.getState().saveScan({ id: '1', timestamp: Date.now(), pigeonId: 'p1', confidence: 0.8, isNewPigeon: false });
      useScanStore.getState().saveScan({ id: '2', timestamp: Date.now(), pigeonId: 'p2', confidence: 0.9, isNewPigeon: false });
      
      useScanStore.getState().clearHistory();
      
      expect(useScanStore.getState().scanHistory).toEqual([]);
    });
  });

  describe('Selectors (getState)', () => {
    it('should get scan status', () => {
      useScanStore.getState().setStatus('processing');
      expect(useScanStore.getState().status).toBe('processing');
    });

    it('should get error', () => {
      useScanStore.getState().setError('Test error');
      expect(useScanStore.getState().error).toBe('Test error');
    });

    it('should get scan history', () => {
      useScanStore.getState().saveScan({ id: '1', timestamp: Date.now(), pigeonId: 'p1', confidence: 0.8, isNewPigeon: false });
      expect(useScanStore.getState().scanHistory).toHaveLength(1);
    });
  });
});