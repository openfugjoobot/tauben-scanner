import type { NavigatorScreenParams } from '@react-navigation/native';

// Scan Flow
export type ScanStackParamList = {
  Scan: undefined;
  Preview: { photoUri: string; photoBase64: string };
  Results: { matchResult: any };
  NewPigeon: { photoUri: string; location?: any };
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
