import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { StorageKeys, createMmkvStorage } from '../storage';
import type { ScanState, ScanActions, LocationData, ScanResult, ScanStatus } from './scanStore.types';

export * from './scanStore.types';

const INITIAL_STATE: ScanState = {
  status: 'idle',
  capturedPhoto: null,
  capturedPhotoBase64: null,
  capturedAt: null,
  location: null,
  result: null,
  error: null,
  scanHistory: [],
};

export const useScanStore = create<ScanState & ScanActions>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      setStatus: (status) => set({ status }),

      capturePhoto: (capturedPhoto, capturedPhotoBase64) => set({
        capturedPhoto,
        capturedPhotoBase64,
        capturedAt: Date.now(),
        status: 'capturing',
        error: null,
      }),

      setLocation: (location) => set({ location }),

      setResult: (result) => set({
        result,
        status: 'completed',
        error: null,
      }),

      setError: (error) => set({
        error,
        status: 'error',
      }),

      clearCurrentScan: () => set({
        capturedPhoto: null,
        capturedPhotoBase64: null,
        capturedAt: null,
        location: null,
        result: null,
        error: null,
        status: 'idle',
      }),

      saveScan: (newResult) => {
        const history = get().scanHistory;
        set({
          scanHistory: [newResult, ...history].slice(0, 100), // Keep last 100
        });
      },

      deleteScan: (scanId) => {
        const filtered = get().scanHistory.filter(s => s.id !== scanId);
        set({ scanHistory: filtered });
      },

      clearHistory: () => set({ scanHistory: [] }),
    }),
    {
      name: StorageKeys.SCAN_STATE,
      storage: createJSONStorage(() => createMmkvStorage()),
      partialize: (state) => ({
        scanHistory: state.scanHistory, // Only persist history, not current scan
      }),
    }
  )
);

// Selectors
export const useScanStatus = () => useScanStore((s) => s.status);
export const useScanError = () => useScanStore((s) => s.error);
export const useCapturedPhoto = () => useScanStore((s) => s.capturedPhoto);
export const useScanLocation = () => useScanStore((s) => s.location);
export const useScanResult = () => useScanStore((s) => s.result);
export const useScanHistory = () => useScanStore((s) => s.scanHistory);
