export interface MatchResult {
  success?: boolean;
  confidence?: number;
  pigeon?: {
    id: string;
    name?: string;
    bandNumber?: string;
  };
  message?: string;
  isNewPigeon?: boolean;
}

export interface ScanResult {
  id: string;
  timestamp: number;
  status: 'completed' | 'not_found' | 'error';
  confidence?: number;
  pigeonId?: string;
  imageUri: string;
}
