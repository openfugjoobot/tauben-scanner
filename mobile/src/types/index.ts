// Re-export shared types from API
export type { Pigeon, MatchResponse, CreatePigeonRequest } from '../services/api/apiClient.types';

// Navigation Types
export type { ScanStackParamList, PigeonsStackParamList, TabParamList, RootStackParamList } from '../navigation/types';

// Use Pigeon type from API for MatchResult
import type { Pigeon as ApiPigeon } from '../services/api/apiClient.types';

export interface MatchResult {
  match: boolean;
  pigeon: ApiPigeon | null;
  confidence: number;
  message: string;
  isNewPigeon: boolean;
}

export interface ScanHistoryItem {
  id: string;
  timestamp: number;
  status: 'completed' | 'not_found' | 'error';
  confidence?: number;
  pigeonId?: string;
  imageUri: string;
}

// Onboarding Types
export interface OnboardingSlide {
  id: string;
  icon: string;
  title: string;
  description: string;
}

// Shared types for atoms components
export interface TextStyles {
  fontSize: number;
  fontWeight: string;
  lineHeight: number;
}

export interface ButtonStyles {
  backgroundColor?: string;
  borderWidth?: number;
  borderColor?: string;
  paddingVertical: number;
  paddingHorizontal: number;
}
