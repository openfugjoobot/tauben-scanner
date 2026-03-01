import { useNavigation as useRNNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList, ScanStackParamList, PigeonsStackParamList, TabParamList } from './types';

type RootNavigationProp = NativeStackNavigationProp<RootStackParamList>;
type TabNavigationProp = NativeStackNavigationProp<TabParamList>;
type ScanNavigationProp = NativeStackNavigationProp<ScanStackParamList>;
type PigeonsNavigationProp = NativeStackNavigationProp<PigeonsStackParamList>;

export const useRootNavigation = () => useRNNavigation<RootNavigationProp>();
export const useTabNavigation = () => useRNNavigation<TabNavigationProp>();
export const useScanNavigation = () => useRNNavigation<ScanNavigationProp>();
export const usePigeonsNavigation = () => useRNNavigation<PigeonsNavigationProp>();
