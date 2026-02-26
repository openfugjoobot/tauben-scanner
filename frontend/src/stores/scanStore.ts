/**
 * Scan Store - Aktueller Scan (Foto, Ergebnisse, Status)
 * T3: State Management
 */

import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';
import {ScanState, ScanResult} from '../types/store';
import {mmkvStorage, StorageKeys} from './storage';

const MAX_HISTORY_ITEMS = 50;

export const useScanStore = create<ScanState>()(
  persist(
    (set, get) => ({
      // Initial State
      status: 'idle',
      capturedPhoto: null,
      location: null,
      result: null,
      error: null,
      scanHistory: [],
      
      // Actions
      setStatus: (status) => set({status}),
      
      setCapturedPhoto: (capturedPhoto) => set({capturedPhoto}),
      
      setLocation: (location) => set({location}),
      
      setResult: (result) => set({result}),
      
      setError: (error) => set({error, status: error ? 'error' : get().status}),
      
      addToHistory: (result) => {
        const {scanHistory} = get();
        const newHistory = [result, ...scanHistory].slice(0, MAX_HISTORY_ITEMS);
        set({scanHistory: newHistory});
      },
      
      clearHistory: () => set({scanHistory: []}),
      
      resetScan: () => {
        set({
          status: 'idle',
          capturedPhoto: null,
          location: null,
          result: null,
          error: null,
        });
      },
    }),
    {
      name: StorageKeys.SCAN_STATE,
      storage: createJSONStorage(() => mmkvStorage),
      // Nur History persistieren, nicht der aktuelle (temporäre) Scan
      partialize: (state) => ({
        scanHistory: state.scanHistory,
      }),
      onRehydrateStorage: () => (state) => {
        console.log('ScanStore rehydrated, history items:', state?.scanHistory?.length ?? 0);
      },
    }
  )
);

// Custom Hook für einfachen Zugriff
export const useScan = () => {
  const store = useScanStore();
  return {
    // State
    status: store.status,
    capturedPhoto: store.capturedPhoto,
    location: store.location,
    result: store.result,
    error: store.error,
    scanHistory: store.scanHistory,
    // Computed
    isScanning: store.status === 'capturing' || store.status === 'uploading' || store.status === 'processing',
    isComplete: store.status === 'completed',
    hasError: store.status === 'error',
    // Actions
    setStatus: store.setStatus,
    setCapturedPhoto: store.setCapturedPhoto,
    setLocation: store.setLocation,
    setResult: store.setResult,
    setError: store.setError,
    addToHistory: store.addToHistory,
    clearHistory: store.clearHistory,
    resetScan: store.resetScan,
  };
};

// Selector Hooks für Performance
export const useScanStatus = () => useScanStore((state) => state.status);
export const useCapturedPhoto = () => useScanStore((state) => state.capturedPhoto);
export const useScanLocation = () => useScanStore((state) => state.location);
export const useScanResult = () => useScanStore((state) => state.result);
export const useScanError = () => useScanStore((state) => state.error);
export const useScanHistory = () => useScanStore((state) => state.scanHistory);

// Hilfsfunktion für Scan-Aktionen
export const createScanResult = (
  overrides: Partial<ScanResult> = {}
): ScanResult => ({
  id: `scan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  pigeonId: null,
  confidence: 0,
  timestamp: Date.now(),
  ...overrides,
});
