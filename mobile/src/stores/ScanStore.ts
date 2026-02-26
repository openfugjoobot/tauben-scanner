import { create } from 'zustand';

export interface ScanData {
  photoUri: string | null;
  timestamp: number | null;
}

interface ScanStore {
  scan: ScanData;
  setPhoto: (uri: string) => void;
  clearPhoto: () => void;
}

export const useScanStore = create<ScanStore>((set) => ({
  scan: {
    photoUri: null,
    timestamp: null,
  },
  setPhoto: (uri: string) =>
    set({
      scan: {
        photoUri: uri,
        timestamp: Date.now(),
      },
    }),
  clearPhoto: () =>
    set({
      scan: {
        photoUri: null,
        timestamp: null,
      },
    }),
}));
