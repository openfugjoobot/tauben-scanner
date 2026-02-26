import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ScanStackParamList } from '../../types/navigation';

type Props = NativeStackScreenProps<ScanStackParamList, 'ScanScreen'>;

export const ScanScreen: React.FC<Props> = ({ navigation }) => {
  const handleTakePhoto = () => {
    // Placeholder für Kamera-Funktionalität
    const mockImageUri = 'file://mock/photo.jpg';
    navigation.navigate('PreviewScreen', { imageUri: mockImageUri });
  };

  const handleSelectFromGallery = () => {
    // Placeholder für Galerie-Funktionalität
    const mockImageUri = 'file://mock/gallery.jpg';
    navigation.navigate('PreviewScreen', { imageUri: mockImageUri });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialCommunityIcons name="scan-helper" size={64} color="#4A90D9" />
        <Text style={styles.title}>Taube scannen</Text>
        <Text style={styles.subtitle}>Wähle eine Methode um eine Taube zu scannen</Text>
      </View>

      <View style={styles.optionsContainer}>
        <TouchableOpacity style={styles.optionCard} onPress={handleTakePhoto}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="camera-iris" size={40} color="white" />
          </View>
          <Text style={styles.optionTitle}>Foto aufnehmen</Text>
          <Text style={styles.optionDescription}>Verwende die Kamera um eine Taube zu fotografieren</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionCard} onPress={handleSelectFromGallery}>
          <View style={[styles.iconContainer, styles.secondaryIconContainer]}>
            <MaterialCommunityIcons name="image-multiple" size={40} color="#4A90D9" />
          </View>
          <Text style={styles.optionTitle}>Aus Galerie wählen</Text>
          <Text style={styles.optionDescription}>Wähle ein vorhandenes Foto aus deiner Galerie</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tipContainer}>
        <MaterialCommunityIcons name="lightbulb-outline" size={20} color="#F39C12" />
        <Text style={styles.tipText}>
          <Text style={styles.tipBold}>Tipp: </Text>
          Achte auf gute Beleuchtung für beste Ergebnisse.
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
  header: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  title: {
    fontSize: 24,
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
  optionsContainer: {
    gap: 16,
  },
  optionCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4A90D9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  secondaryIconContainer: {
    backgroundColor: '#EBF4FD',
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 8,
  },
  optionDescription: {
    fontSize: 14,
    color: '#7F8C8D',
    textAlign: 'center',
  },
  tipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    padding: 16,
    backgroundColor: '#FEF9E7',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FCE8B2',
  },
  tipText: {
    fontSize: 14,
    color: '#8B6914',
    marginLeft: 8,
    flex: 1,
  },
  tipBold: {
    fontWeight: '600',
  },
});
