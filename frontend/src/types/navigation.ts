/**
 * Navigation Types für Tauben Scanner App
 * React Navigation v7 mit TypeScript
 * T7: Scan Flow - Erweiterte Navigation Types
 */

import { NavigatorScreenParams, NavigationProp } from '@react-navigation/native';

// Match-Result für Scan Flow
export interface MatchResult {
  pigeonId: string;
  name: string;
  confidence: number;
  photoUrl?: string;
}

// ==================== SCAN STACK ====================
export type ScanStackParamList = {
  ScanScreen: undefined;
  PreviewScreen: { imageUri: string; imageBase64?: string };
  ResultsScreen: {
    imageUri: string;
    matches: MatchResult[];
    isNewPigeon: boolean;
  };
  PigeonDetailScreen?: { 
    pigeonId?: string;
    isNew?: boolean;
    initialPhotoUri?: string;
  };
};

// ==================== PIGEONS STACK ====================
export type PigeonsStackParamList = {
  PigeonListScreen: undefined;
  PigeonDetailScreen: { 
    pigeonId?: string;
    isNew?: boolean;
    initialPhotoUri?: string;
  };
};

// ==================== ROOT TAB ====================
export type RootTabParamList = {
  Home: undefined;
  ScanTab: NavigatorScreenParams<ScanStackParamList>;
  PigeonsTab: NavigatorScreenParams<PigeonsStackParamList>;
  Settings: undefined;
};

// ==================== ROOT STACK ====================
export type RootStackParamList = {
  MainTabs: undefined;
};

// ==================== NAVIGATION PROP TYPES ====================
export type RootTabNavigationProp = NavigationProp<RootTabParamList>;

// ==================== NAVIGATION EXPORTS ====================
export type {
  ScanStackParamList,
  PigeonsStackParamList,
  RootTabParamList,
  RootStackParamList,
};

// ==================== GLOBAL TYPE DECLARATION ====================
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootTabParamList {}
  }
}