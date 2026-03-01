import type { NavigatorScreenParams } from '@react-navigation/native';

interface PigeonData {
  id: string;
  name?: string;
  bandNumber?: string;
  email?: string;
  phone?: string;
  address?: string;
}

interface MatchResultData {
  match: boolean;
  pigeon: PigeonData | null;
  confidence: number;
  message: string;
  isNewPigeon: boolean;
}

// Scan Flow
export type ScanStackParamList = {
  Scan: undefined;
  Results: { 
    matchResult: MatchResultData | null;
    photoUri: string;
  };
  NewPigeon: { photoUri: string; location?: { lat: number; lng: number } };
};

// Pigeons Flow
export type PigeonsStackParamList = {
  PigeonList: undefined;
  PigeonDetail: { pigeonId: string };
  PigeonEdit: { pigeonId: string };
  NewPigeon: { photoUri?: string };
};

// Main Tabs
export type TabParamList = {
  Home: undefined;
  ScanFlow: NavigatorScreenParams<ScanStackParamList>;
  PigeonsFlow: NavigatorScreenParams<PigeonsStackParamList>;
  Settings: undefined;
};

// Root
export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<TabParamList>;
  Onboarding: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
