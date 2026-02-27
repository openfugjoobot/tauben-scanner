import { useState, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useMatchImage } from '../../../hooks/queries';
import { useScanStore } from '../../../stores/scans';
import { useSettingsStore } from '../../../stores/settings';

export type ScanStep = 'camera' | 'preview' | 'processing' | 'results' | 'error';

interface ScanFlowState {
  step: ScanStep;
  capturedPhoto: { uri: string; base64: string } | null;
  matchResult: any | null;
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
      processingStatus: 'Verbindung zum Server wird aufgebaut...' 
    }));

    try {
      // Small delays to make transitions visible to user
      await new Promise(resolve => setTimeout(resolve, 800));
      setState(prev => ({ ...prev, processingStatus: 'Bilddaten werden übertragen...' }));
      
      const result = await matchMutation.mutateAsync({
        image: state.capturedPhoto.base64,
        threshold: matchThreshold,
      });

      setState(prev => ({ ...prev, processingStatus: 'KI-Abgleich läuft...' }));
      await new Promise(resolve => setTimeout(resolve, 500));

      // Add to scan history
      saveScan({
        id: Date.now().toString(),
        timestamp: Date.now(),
        status: (result.match ? 'completed' : 'not_found') as any,
        confidence: result.confidence,
        pigeonId: result.pigeon?.id,
        imageUri: state.capturedPhoto.uri,
      } as any);

      setState((prev) => ({
        ...prev,
        step: 'results',
        matchResult: result,
      }));
    } catch (error) {
      saveScan({
        id: Date.now().toString(),
        timestamp: Date.now(),
        status: 'error' as any,
        imageUri: state.capturedPhoto.uri,
      } as any);

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
    // @ts-ignore
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
