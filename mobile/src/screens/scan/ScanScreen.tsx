import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CameraCapture } from '../../components/organisms/CameraCapture/CameraCapture';
import { useScanFlow } from './hooks/useScanFlow';
import { ScanOverlay } from './components/ScanOverlay';
import { ProcessingView } from './components/ProcessingView';
import { MatchResultView } from './components/MatchResultView';
import { ErrorView } from './components/ErrorView';
import { ImagePreview } from './components/ImagePreview';

export const ScanScreen: React.FC = () => {
  const navigation = useNavigation();
  const {
    step,
    capturedPhoto,
    matchResult,
    error,
    isProcessing,
    capturePhoto,
    retakePhoto,
    processImage,
    reset,
    navigateToPigeon,
  } = useScanFlow();

  // Handle back button
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      if (step === 'processing') {
          // Prevent going back while processing
          // @ts-ignore
          e.preventDefault();
      }
    });
    return unsubscribe;
  }, [navigation, step]);

  // Camera step
  if (step === 'camera') {
    return (
      <View style={styles.container}>
        <CameraCapture
          onPhotoCaptured={capturePhoto}
          onCancel={() => navigation.goBack()}
        />
        <ScanOverlay />
      </View>
    );
  }

  // Preview step
  if (step === 'preview' && capturedPhoto) {
    return (
      <View style={styles.container}>
        <ImagePreview
          photo={capturedPhoto}
          onRetake={retakePhoto}
          onConfirm={processImage}
          isProcessing={isProcessing}
        />
      </View>
    );
  }

  // Processing step
  if (step === 'processing') {
    return (
      <ProcessingView />
    );
  }

  // Results step
  if (step === 'results' && matchResult) {
    return (
      <MatchResultView
        result={matchResult}
        onViewPigeon={navigateToPigeon}
        onScanAgain={reset}
        onGoHome={() => navigation.navigate('Home' as never)}
      />
    );
  }

  // Error step
  if (step === 'error') {
    return (
      <ErrorView
        error={error || 'Unbekannter Fehler'}
        onRetry={processImage}
        onCancel={reset}
      />
    );
  }

  return null;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
