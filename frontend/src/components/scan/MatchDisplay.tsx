/**
 * MatchDisplay Komponente
 * T7: Scan Flow - Zeigt einzelnes Match mit Bild, Score und Name
 */

import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export interface MatchDisplayProps {
  pigeonId: string;
  name: string;
  confidence: number;
  photoUrl?: string;
  onPress?: () => void;
  isSelected?: boolean;
}

export const MatchDisplay: React.FC<MatchDisplayProps> = ({
  name,
  confidence,
  photoUrl,
  onPress,
  isSelected = false,
}) => {
  const getMatchColor = (score: number) => {
    if (score >= 0.8) return '#27AE60';
    if (score >= 0.6) return '#F39C12';
    return '#E74C3C';
  };

  const getMatchLabel = (score: number) => {
    if (score >= 0.8) return 'Sehr wahrscheinlich';
    if (score >= 0.6) return 'Wahrscheinlich';
    return 'Unsicher';
  };

  const scorePercent = Math.round(confidence * 100);
  const matchColor = getMatchColor(confidence);

  return (
    <TouchableOpacity
      style={[
        styles.container,
        isSelected && styles.selectedContainer,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Photo */}
      <View style={styles.imageContainer}>
        {photoUrl ? (
          <Image source={{ uri: photoUrl }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={styles.placeholder}>
            <MaterialCommunityIcons name="pigeon" size={40} color="#BDC3C7" />
          </View>
        )}
      </View>

      {/* Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
        <Text style={[styles.label, { color: matchColor }]}>
          {getMatchLabel(confidence)}
        </Text>
      </View>

      {/* Score */}
      <View style={[styles.scoreContainer, { backgroundColor: matchColor + '20' }]}>
        <Text style={[styles.scoreText, { color: matchColor }]}>
          {scorePercent}%
        </Text>
      </View>

      {/* Selection indicator */}
      {isSelected && (
        <View style={styles.selectedIndicator}>
          <MaterialCommunityIcons name="check-circle" size={24} color="#4A90D9" />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedContainer: {
    borderColor: '#4A90D9',
    backgroundColor: '#F0F7FF',
  },
  imageContainer: {
    width: 64,
    height: 64,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F5F7FA',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ECF0F1',
  },
  infoContainer: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 4,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
  },
  scoreContainer: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  scoreText: {
    fontSize: 14,
    fontWeight: '700',
  },
  selectedIndicator: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: 'white',
    borderRadius: 12,
  },
});
