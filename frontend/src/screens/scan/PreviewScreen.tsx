import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ScanStackParamList } from '../../types/navigation';

type Props = NativeStackScreenProps<ScanStackParamList, 'PreviewScreen'>;

export const PreviewScreen: React.FC<Props> = ({ route, navigation }) => {
  const { imageUri } = route.params;

  const handleConfirm = () => {
    // Placeholder: Sende Bild zur Analyse
    navigation.navigate('ResultsScreen', {
      pigeonId: 'mock-pigeon-123',
      matchScore: 0.87,
      imageUri,
    });
  };

  const handleRetake = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialCommunityIcons name="image-check" size={32} color="#4A90D9" />
        <Text style={styles.title}>Vorschau</Text>
        <Text style={styles.subtitle}>Überprüfe das Bild vor dem Scannen</Text>
      </View>

      <View style={styles.imageContainer}>
        <View style={styles.imagePlaceholder}>
          <MaterialCommunityIcons name="image" size={64} color="#BDC3C7" />
          <Text style={styles.placeholderText}>{imageUri}</Text>
        </View>
      </View>

      <View style={styles.checklist}>
        <Text style={styles.checklistTitle}>Prüfung:</Text>
        <View style={styles.checklistItem}>
          <MaterialCommunityIcons name="check-circle" size={20} color="#27AE60" />
          <Text style={styles.checklistText}>Taube ist gut sichtbar</Text>
        </View>
        <View style={styles.checklistItem}>
          <MaterialCommunityIcons name="check-circle" size={20} color="#27AE60" />
          <Text style={styles.checklistText}>Bild ist scharf</Text>
        </View>
        <View style={styles.checklistItem}>
          <MaterialCommunityIcons name="check-circle" size={20} color="#F39C12" />
          <Text style={styles.checklistText}>Genug Licht</Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.retakeButton} onPress={handleRetake}>
          <MaterialCommunityIcons name="camera-retake" size={20} color="#7F8C8D" />
          <Text style={styles.retakeButtonText}>Neu aufnehmen</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
          <MaterialCommunityIcons name="magnify-scan" size={20} color="white" />
          <Text style={styles.confirmButtonText}>Taube scannen</Text>
        </TouchableOpacity>
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
    paddingVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginTop: 12,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  imageContainer: {
    flex: 1,
    marginVertical: 16,
  },
  imagePlaceholder: {
    flex: 1,
    backgroundColor: '#ECF0F1',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#BDC3C7',
  },
  placeholderText: {
    marginTop: 12,
    fontSize: 12,
    color: '#95A5A6',
    paddingHorizontal: 20,
    textAlign: 'center',
  },
  checklist: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  checklistTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 12,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  checklistText: {
    fontSize: 14,
    color: '#34495E',
  },
  buttonContainer: {
    gap: 12,
  },
  retakeButton: {
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
  retakeButtonText: {
    color: '#7F8C8D',
    fontSize: 16,
    fontWeight: '500',
  },
  confirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4A90D9',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
