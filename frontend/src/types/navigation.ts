/**
 * Navigation Types für Tauben Scanner App
 * React Navigation v7 mit TypeScript
 */

import { NavigatorScreenParams } from '@react-navigation/native';

// ==================== SCAN STACK ====================
export type ScanStackParamList = {
  ScanScreen: undefined;
  PreviewScreen: { imageUri: string };
  ResultsScreen: {
    pigeonId: string;
    matchScore: number;
    imageUri: string;
  };
};

// ==================== PIGEONS STACK ====================
export type PigeonsStackParamList = {
  PigeonListScreen: undefined;
  PigeonDetailScreen: { pigeonId: string };
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

// ==================== NAVIGATION EXPORTS ====================
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootTabParamList {}
  }
}

export type {
  ScanStackParamList,
  PigeonsStackParamList,
  RootTabParamList,
  RootStackParamList,
};
