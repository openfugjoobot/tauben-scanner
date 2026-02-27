export type ScanStatus = 
  | 'idle' 
  | 'capturing' 
  | 'uploading' 
  | 'processing' 
  | 'completed' 
  | 'error';

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

export interface ScanResult {
  id: string;
  pigeonId: string | null;
  confidence: number;
  matchedPhotoUrl?: string;
  timestamp: number;
  isNewPigeon: boolean;
}

export interface ScanState {
  status: ScanStatus;
  capturedPhoto: string | null;
  capturedPhotoBase64: string | null;
  capturedAt: number | null;
  location: LocationData | null;
  result: ScanResult | null;
  error: string | null;
  scanHistory: ScanResult[];
}

export interface ScanActions {
  setStatus: (status: ScanStatus) => void;
  capturePhoto: (uri: string, base64: string) => void;
  setLocation: (location: LocationData) => void;
  setResult: (result: ScanResult) => void;
  setError: (error: string | null) => void;
  clearCurrentScan: () => void;
  saveScan: (result: ScanResult) => void;
  deleteScan: (scanId: string) => void;
  clearHistory: () => void;
}
