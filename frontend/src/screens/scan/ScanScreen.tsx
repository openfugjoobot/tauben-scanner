/**
 * ScanScreen - Kamera-Screen mit Overlay UI
 * T7: Scan Flow - Camera → Preview → Results Flow
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from "expo-camera";
import { Button, View } from "react-native";
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ScanStackParamList } from '../../types/navigation';
import { useScan } from '../../stores';

type Props = NativeStackScreenProps<ScanStackParamList, 'ScanScreen'>;

export const ScanScreen: React.FC<Props> = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { setCapturedPhoto, setStatus, setLocation } = useScan();

  const requestCameraPermission = async (): Promise<boolean> => {
    try {
      // Check permission status
      const permission = await Camera.checkPermissions();
      if (permission.camera === 'granted') {
        return true;
      }
      
      // Request permission
      const request = await Camera.requestPermissions();
      return request.camera === 'granted';
    } catch (error) {
      console.error('Camera permission error:', error);
      return false;
    }
  };

  const handleTakePhoto = useCallback(async () => {
    setIsLoading(true);
    
    try {
      const hasPermission = await requestCameraPermission();
      if (!hasPermission) {
        Alert.alert(
          'Kamera-Zugriff benötigt',
          'Bitte erlaube den Kamera-Zugriff in den Einstellungen, um Fotos aufzunehmen.'
        );
        setIsLoading(false);
        return;
      }

      setStatus('capturing');

      // Take photo using Capacitor Camera
      const photo = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
        width: 1920,
        height: 1920,
      });

      if (photo.dataUrl) {
        setCapturedPhoto(photo.dataUrl);
        
        // Navigate to preview with the captured image
        navigation.navigate('PreviewScreen', {
          imageUri: photo.dataUrl,
          imageBase64: photo.dataUrl.split(',')[1], // Remove data URI prefix
        });
      }
    } catch (error) {
      console.error('Camera error:', error);
      
      // User cancelled - don't show error
      if (error instanceof Error && error.message?.includes('cancel')) {
        setStatus('idle');
        setIsLoading(false);
        return;
      }

      Alert.alert(
        'Fehler',
        'Das Foto konnte nicht aufgenommen werden. Bitte versuche es erneut.'
      );
      setStatus('error');
    } finally {
      setIsLoading(false);
    }
  }, [navigation, setCapturedPhoto, setStatus]);

  const handleSelectFromGallery = useCallback(async () => {
    setIsLoading(true);
    
    try {
      const hasPermission = await requestCameraPermission();
      if (!hasPermission) {
        Alert.alert(
          'Galerie-Zugriff benötigt',
          'Bitte erlaube den Zugriff auf die Galerie in den Einstellungen.'
        );
        setIsLoading(false);
        return;
      }

      setStatus('capturing');

      // Select from gallery
      const photo = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Photos,
      });

      if (photo.dataUrl) {
        setCapturedPhoto(photo.dataUrl);
        
        navigation.navigate('PreviewScreen', {
          imageUri: photo.dataUrl,
          imageBase64: photo.dataUrl.split(',')[1],
        });
      }
    } catch (error) {
      console.error('Gallery error:', error);
      
      // User cancelled
      if (error instanceof Error && error.message?.includes('cancel')) {
        setStatus('idle');
        setIsLoading(false);
        return;
      }

      Alert.alert(
        'Fehler',
        'Das Bild konnte nicht aus der Galerie geladen werden.'
      );
      setStatus('error');
    } finally {
      setIsLoading(false);
    }
  }, [navigation, setCapturedPhoto, setStatus]);

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#4A90D9" />
        <Text style={styles.loadingText}>Kamera wird geöffnet...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <MaterialCommunityIcons name="scan-helper" size={64} color="#4A90D9" />
        <Text style={styles.title}>Taube scannen</Text>
        <Text style={styles.subtitle}>
          Fotografiere eine Taube, um sie zu identifizieren
        </Text>
      </View>

      {/* Instruction Card */}
      <View style={styles.instructionCard}>
        <Text style={styles.instructionTitle}>So funktioniert's:</Text>
        <View style={styles.instructionItem}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepText}>1</Text>
          </View>
          <Text style={styles.instructionText}>
            Mache ein Foto der Taube aus nächster Nähe
          </Text>
        </View>
        <View style={styles.instructionItem}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepText}>2</Text>
          </View>
          <Text style={styles.instructionText}>
            Unsere KI analysiert das Bild
          </Text>
        </View>
        <View style={styles.instructionItem}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepText}>3</Text>
          </View>
          <Text style={styles.instructionText}>
            Erhalte die Übereinstimmung mit bekannten Tauben
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleTakePhoto}
          activeOpacity={0.8}
        >
          <View style={styles.buttonIconContainer}>
            <MaterialCommunityIcons name="camera-iris" size={32} color="white" />
          </View>
          <Text style={styles.primaryButtonText}>Foto aufnehmen</Text>
          <Text style={styles.buttonSubtext}>
            Optimal für beste Ergebnisse
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={handleSelectFromGallery}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="image-multiple" size={24} color="#4A90D9" />
          <Text style={styles.secondaryButtonText}>Aus Galerie wählen</Text>
        </TouchableOpacity>
      </View>

      {/* Tips */}
      <View style={styles.tipContainer}>
        <MaterialCommunityIcons name="lightbulb-outline" size={20} color="#F39C12" />
        <Text style={styles.tipText}>
          <Text style={styles.tipBold}>Tipp: </Text>
          Achte auf gute Beleuchtung und positioniere die Taube mittig im Bild.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    padding: 20,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#7F8C8D',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  instructionCard: {
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
  instructionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 16,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#4A90D9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  instructionText: {
    flex: 1,
    fontSize: 14,
    color: '#34495E',
    lineHeight: 20,
  },
  optionsContainer: {
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#4A90D9',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#4A90D9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginBottom: 4,
  },
  buttonSubtext: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#4A90D9',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4A90D9',
  },
  tipContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 20,
    padding: 16,
    backgroundColor: '#FEF9E7',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FCE8B2',
  },
  tipText: {
    fontSize: 13,
    color: '#8B6914',
    marginLeft: 8,
    flex: 1,
    lineHeight: 18,
  },
  tipBold: {
    fontWeight: '600',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#7F8C8D',
  },
});
