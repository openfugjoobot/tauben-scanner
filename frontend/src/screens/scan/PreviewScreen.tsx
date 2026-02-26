/**
 * PreviewScreen - Zeigt aufgenommenes Bild mit Upload-Progress
 * T7: Scan Flow - Preview → Upload → Results
 */

import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ScanStackParamList, MatchResult } from '../../types/navigation';
import { useScan, useSettingsStore } from '../../stores';

type Props = NativeStackScreenProps<ScanStackParamList, 'PreviewScreen'>;

// Simuliere API-Call für das Matching
const matchImageAPI = async (
  imageBase64: string,
  apiUrl: string,
  onProgress: (progress: number) => void
): Promise<{ matches: MatchResult[]; isNewPigeon: boolean }> => {
  // Simulate upload progress
  for (let i = 0; i <= 100; i += 10) {
    await new Promise((resolve) => setTimeout(resolve, 150));
    onProgress(i);
  }

  // Simulate API response
  const mockMatches: MatchResult[] = [
    {
      pigeonId: 'pigeon_001',
      name: 'Hansi',
      confidence: 0.87,
      photoUrl: 'https://example.com/pigeon1.jpg',
    },
    {
      pigeonId: 'pigeon_002',
      name: 'Bella',
      confidence: 0.64,
      photoUrl: 'https://example.com/pigeon2.jpg',
    },
    {
      pigeonId: 'pigeon_003',
      name: 'Max',
      confidence: 0.42,
    },
  ];

  // Randomly decide if it's a new pigeon (for demo)
  const isNewPigeon = Math.random() > 0.7;

  return {
    matches: isNewPigeon ? [] : mockMatches,
    isNewPigeon,
  };
};

export const PreviewScreen: React.FC<Props> = ({ route, navigation }) => {
  const { imageUri, imageBase64 } = route.params;
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const { setStatus, setResult, setError, resetScan } = useScan();
  const { apiUrl } = useSettingsStore();

  // Reset upload error when component mounts
  useEffect(() => {
    setUploadError(null);
    setStatus('idle');
  }, [setStatus]);

  const handleNewPhoto = useCallback(() => {
    resetScan();
    navigation.goBack();
  }, [navigation, resetScan]);

  const handleSearch = useCallback(async () => {
    if (isUploading) return;

    setIsUploading(true);
    setUploadProgress(0);
    setUploadError(null);
    setStatus('uploading');

    try {
      const base64Image = imageBase64 || imageUri.split(',')[1];
      
      if (!base64Image) {
        throw new Error('Kein Bild zum Upload vorhanden');
      }

      const { matches, isNewPigeon } = await matchImageAPI(
        base64Image,
        apiUrl,
        setUploadProgress
      );

      setStatus('completed');

      // Navigate to results
      navigation.navigate('ResultsScreen', {
        imageUri,
        matches,
        isNewPigeon,
      });
    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Upload fehlgeschlagen';
      setUploadError(errorMessage);
      setError(errorMessage);
      setStatus('error');
    } finally {
      setIsUploading(false);
    }
  }, [imageUri, imageBase64, isUploading, apiUrl, setStatus, setError, navigation]);

  const handleRetry = useCallback(() => {
    setUploadError(null);
    handleSearch();
  }, [handleSearch]);

  // Upload Progress Bar Component
  const UploadProgressBar = () => (
    <View style={styles.progressContainer}>
      <View style={styles.progressHeader}>
        <MaterialCommunityIcons name="cloud-upload" size={24} color="#4A90D9" />
        <Text style={styles.progressTitle}>Bild wird hochgeladen...</Text>
      </View>

      <View style={styles.progressBarBackground}>
        <View
          style={[
            styles.progressBarFill,
            { width: `${uploadProgress}%` },
          ]}
        />
      </View>

      <View style={styles.progressInfo}>
        <Text style={styles.progressPercent}>{uploadProgress}%</Text>
        <Text style={styles.progressStatus}>
          {uploadProgress < 30
            ? 'Bild wird vorbereitet...'
            : uploadProgress < 70
            ? 'KI-Analyse läuft...'
            : 'Ergebnisse werden geladen...'}
        </Text>
      </View>

      <ActivityIndicator
        size="small"
        color="#4A90D9"
        style={styles.progressSpinner}
      />
    </View>
  );

  // Error State Component
  const ErrorState = () => (
    <View style={styles.errorContainer}>
      <MaterialCommunityIcons name="alert-circle" size={48} color="#E74C3C" />
      <Text style={styles.errorTitle}>Upload fehlgeschlagen</Text>
      <Text style={styles.errorMessage}>{uploadError}</Text>
      <View style={styles.errorButtons}>
        <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
          <MaterialCommunityIcons name="refresh" size={20} color="white" />
          <Text style={styles.retryButtonText}>Erneut versuchen</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelErrorButton} onPress={handleNewPhoto}>
          <Text style={styles.cancelErrorText}>Neues Foto</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <MaterialCommunityIcons name="image-check-outline" size={32} color="#4A90D9" />
        <Text style={styles.title}>Vorschau</Text>
        <Text style={styles.subtitle}>Überprüfe das Bild vor dem Scannen</Text>
      </View>

      {/* Image Display */}
      <View style={styles.imageContainer}>
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={styles.capturedImage}
            resizeMode="contain"
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <MaterialCommunityIcons name="image-off" size={48} color="#BDC3C7" />
            <Text style={styles.placeholderText}>Kein Bild vorhanden</Text>
          </View>
        )}
      </View>

      {/* Quality Checklist */}
      {!isUploading && !uploadError && (
        <View style={styles.checklist}>
          <Text style={styles.checklistTitle}>Bild-Qualität prüfen:</Text>

          <View style={styles.checklistItem}>
            <MaterialCommunityIcons name="check-circle" size={20} color="#27AE60" />
            <Text style={styles.checklistText}>Taube ist gut sichtbar</Text>
          </View>

          <View style={styles.checklistItem}>
            <MaterialCommunityIcons name="check-circle" size={20} color="#27AE60" />
            <Text style={styles.checklistText}>Bild ist scharf</Text>
          </View>

          <View style={styles.checklistItem}>
            <MaterialCommunityIcons name="check-circle" size={20} color="#27AE60" />
            <Text style={styles.checklistText}>Genug Licht vorhanden</Text>
          </View>

          <View style={styles.checklistItem}>
            <MaterialCommunityIcons name="check-circle" size={20} color="#27AE60" />
            <Text style={styles.checklistText}>Hintergrund ist nicht zu stark</Text>
          </View>
        </View>
      )}

      {/* Upload Progress */}
      {isUploading && !uploadError && <UploadProgressBar />}

      {/* Error State */}
      {uploadError && <ErrorState />}

      {/* Action Buttons */}
      {!isUploading && !uploadError && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.newPhotoButton}
            onPress={handleNewPhoto}
            disabled={isUploading}
          >
            <MaterialCommunityIcons name="camera-retake" size={20} color="#7F8C8D" />
            <Text style={styles.newPhotoButtonText}>Neues Foto</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.searchButton}
            onPress={handleSearch}
            disabled={isUploading}
          >
            <MaterialCommunityIcons name="magnify-scan" size={20} color="white" />
            <Text style={styles.searchButtonText}>Taube suchen</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginTop: 12,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  imageContainer: {
    backgroundColor: '#2C3E50',
    borderRadius: 16,
    overflow: 'hidden',
    aspectRatio: 4 / 3,
    marginBottom: 20,
  },
  capturedImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#34495E',
  },
  placeholderText: {
    marginTop: 8,
    fontSize: 14,
    color: '#95A5A6',
  },
  checklist: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  checklistTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 16,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
  },
  checklistText: {
    fontSize: 14,
    color: '#34495E',
  },
  // Progress Bar
  progressContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
  },
  progressBarBackground: {
    width: '100%',
    height: 12,
    backgroundColor: '#ECF0F1',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#4A90D9',
    borderRadius: 6,
    transitionProperty: 'width',
    transitionDuration: '300ms',
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
  },
  progressPercent: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A90D9',
  },
  progressStatus: {
    fontSize: 13,
    color: '#7F8C8D',
    flex: 1,
    textAlign: 'right',
  },
  progressSpinner: {
    marginTop: 16,
  },
  // Error State
  errorContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#E74C3C',
    marginTop: 12,
    marginBottom: 4,
  },
  errorMessage: {
    fontSize: 14,
    color: '#7F8C8D',
    textAlign: 'center',
    marginBottom: 20,
  },
  errorButtons: {
    width: '100%',
    gap: 12,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#27AE60',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelErrorButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  cancelErrorText: {
    color: '#7F8C8D',
    fontSize: 15,
    fontWeight: '500',
  },
  // Action Buttons
  buttonContainer: {
    gap: 12,
    marginTop: 'auto',
  },
  newPhotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#BDC3C7',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  newPhotoButtonText: {
    color: '#7F8C8D',
    fontSize: 16,
    fontWeight: '500',
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4A90D9',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  searchButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
