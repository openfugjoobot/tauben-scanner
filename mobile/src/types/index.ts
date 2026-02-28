// Navigation Types (imported from navigation/types.ts)
export type { ScanStackParamList, PigeonsStackParamList, TabParamList, RootStackParamList } from '../navigation/types';

// Scan Result Types
export interface MatchResult {
  match: boolean;
  pigeon: Pigeon | null;
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
