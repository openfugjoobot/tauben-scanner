/**
 * Navigation Types für Tauben Scanner App
 * React Navigation v7 mit TypeScript
<<<<<<< HEAD
 */

import { NavigatorScreenParams } from '@react-navigation/native';
=======
 * T7: Scan Flow - Erweiterte Navigation Types
 */

import type { NavigatorScreenParams } from '@react-navigation/native';

// Match-Result für Scan Flow
export interface MatchResult {
  pigeonId: string;
  name: string;
  confidence: number;
  photoUrl?: string;
}
>>>>>>> main

// ==================== SCAN STACK ====================
export type ScanStackParamList = {
  ScanScreen: undefined;
<<<<<<< HEAD
  PreviewScreen: { imageUri: string };
  ResultsScreen: {
    pigeonId: string;
    matchScore: number;
    imageUri: string;
=======
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
>>>>>>> main
  };
};

// ==================== PIGEONS STACK ====================
export type PigeonsStackParamList = {
  PigeonListScreen: undefined;
<<<<<<< HEAD
  PigeonDetailScreen: { pigeonId: string };
=======
  PigeonDetailScreen: { 
    pigeonId?: string;
    isNew?: boolean;
    initialPhotoUri?: string;
  };
>>>>>>> main
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
<<<<<<< HEAD

export type {
  ScanStackParamList,
  PigeonsStackParamList,
  RootTabParamList,
  RootStackParamList,
};
=======
>>>>>>> main
