import { useState, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useMatchImage } from '../../../hooks/queries';
import { useScanStore } from '../../../stores/scans';
import { useSettingsStore } from '../../../stores/settings';
import type { MatchResponse, Pigeon } from '../../../services/api/apiClient.types';
import type { ScanResult as StoreScanResult } from '../../../stores/scans/scanStore.types';

export type ScanStep = 'camera' | 'preview' | 'processing' | 'results' | 'error';

interface MatchResult {
  match: boolean;
  pigeon: Pigeon | null;
  confidence: number;
  message: string;
  isNewPigeon: boolean;
}

interface ScanFlowState {
  step: ScanStep;
  capturedPhoto: { uri: string; base64: string } | null;
  matchResult: MatchResult | null;
  error: string | null;
  processingStatus: string;
}

export const useScanFlow = () => {
  const navigation = useNavigation();
  const { saveScan } = useScanStore();
  const { matchThreshold } = useSettingsStore();
  const matchMutation = useMatchImage();

  const [state, setState] = useState<ScanFlowState>({
    step: 'camera',
    capturedPhoto: null,
    matchResult: null,
    error: null,
    processingStatus: '',
  });

  const capturePhoto = useCallback((photo: { uri: string; base64: string }) => {
    setState((prev) => ({
      ...prev,
      step: 'preview',
      capturedPhoto: photo,
    }));
  }, []);

  const retakePhoto = useCallback(() => {
    setState((prev) => ({
      ...prev,
      step: 'camera',
      capturedPhoto: null,
    }));
  }, []);

  const processImage = useCallback(async () => {
    if (!state.capturedPhoto?.base64) return;

    setState((prev) => ({
      ...prev,
      step: 'processing',
      processingStatus: 'Verbindung zum Server wird aufgebaut...',
    }));

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setState((prev) => ({ ...prev, processingStatus: 'Bilddaten werden uebertragen...' }));

      const response = await matchMutation.mutateAsync({
        image: state.capturedPhoto.base64,
        threshold: matchThreshold,
      });

      setState((prev) => ({ ...prev, processingStatus: 'KI-Abgleich laeuft...' }));
      await new Promise((resolve) => setTimeout(resolve, 500));

      const result: MatchResult = {
        match: response.success,
        pigeon: response.pigeon,
        confidence: response.confidence,
        message: response.message,
        isNewPigeon: response.isNewPigeon,
      };

      const storeResult: StoreScanResult = {
        id: Date.now().toString(),
        pigeonId: result.pigeon?.id || null,
        confidence: result.confidence,
        timestamp: Date.now(),
        isNewPigeon: result.isNewPigeon,
      };
      saveScan(storeResult);

      setState((prev) => ({
        ...prev,
        step: 'results',
        matchResult: result,
      }));
    } catch (error) {
      const errorResult: StoreScanResult = {
        id: Date.now().toString(),
        pigeonId: null,
        confidence: 0,
        timestamp: Date.now(),
        isNewPigeon: false,
      };
      saveScan(errorResult);

      setState((prev) => ({
        ...prev,
        step: 'error',
        error: error instanceof Error ? error.message : 'Unbekannter Fehler',
      }));
    }
  }, [state.capturedPhoto, matchThreshold, matchMutation, saveScan]);

  const reset = useCallback(() => {
    setState({
      step: 'camera',
      capturedPhoto: null,
      matchResult: null,
      error: null,
      processingStatus: '',
    });
  }, []);

  const navigateToPigeon = useCallback((pigeonId: string) => {
    // @ts-ignore - navigation type complexity
    navigation.navigate('PigeonsFlow', {
      screen: 'PigeonDetail',
      params: { pigeonId },
    });
  }, [navigation]);

  return {
    ...state,
    isProcessing: matchMutation.isPending,
    capturePhoto,
    retakePhoto,
    processImage,
    reset,
    navigateToPigeon,
  };
};
