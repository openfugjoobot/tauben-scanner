import type { Pigeon } from '../services/api/apiClient.types';

export interface MatchResult {
  success?: boolean;
  confidence?: number;
  pigeon?: Pigeon | null;
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
