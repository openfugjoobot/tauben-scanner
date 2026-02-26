<<<<<<< HEAD
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ScanStackParamList } from '../../types/navigation';
=======
/**
 * ResultsScreen - Zeigt Übereinstimmungs-Matches
 * T7: Scan Flow - Results mit MatchDisplay Komponente
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ScanStackParamList, MatchResult } from '../../types/navigation';
import { MatchDisplay } from '../../components/scan/MatchDisplay';
import { useScan } from '../../stores';
>>>>>>> main

type Props = NativeStackScreenProps<ScanStackParamList, 'ResultsScreen'>;

export const ResultsScreen: React.FC<Props> = ({ route, navigation }) => {
<<<<<<< HEAD
  const { pigeonId, matchScore, imageUri } = route.params;

  const handleConfirmMatch = () => {
    // Bestätige die Übereinstimmung
    navigation.navigate('ScanScreen');
  };

  const handleAddNew = () => {
    // Füge als neue Taube hinzu
    navigation.navigate('ScanScreen');
  };

  const handleScanAgain = () => {
    navigation.navigate('ScanScreen');
  };

  const getMatchColor = (score: number) => {
    if (score >= 0.8) return '#27AE60';
    if (score >= 0.6) return '#F39C12';
    return '#E74C3C';
  };

  const getMatchText = (score: number) => {
    if (score >= 0.8) return 'Sehr wahrscheinlich';
    if (score >= 0.6) return 'Wahrscheinlich';
    return 'Unsicher';
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <MaterialCommunityIcons name="magnify-check" size={48} color="#4A90D9" />
        <Text style={styles.title}>Scan-Ergebnis</Text>
        <Text style={styles.subtitle}>KI-Analyse abgeschlossen</Text>
      </View>

      <View style={styles.scoreCard}>
        <Text style={styles.scoreLabel}>Übereinstimmung</Text>
        
        <View style={styles.scoreCircle}>
          <Text style={[styles.scoreValue, { color: getMatchColor(matchScore) }]}>
            {Math.round(matchScore * 100)}%
          </Text>
        </View>

        <Text style={[styles.scoreText, { color: getMatchColor(matchScore) }]}>
          {getMatchText(matchScore)}
        </Text>
      </View>

      <View style={styles.resultCard}>
        <View style={styles.resultHeader}>
          <MaterialCommunityIcons name="pigeon" size={32} color="#4A90D9" />
          <View style={styles.pigeonInfo}>
            <Text style={styles.pigeonName}>Taube #{pigeonId.slice(-4)}</Text>
            <Text style={styles.pigeonId}>ID: {pigeonId}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.details}>
          <View style={styles.detailItem}>
            <MaterialCommunityIcons name="map-marker" size={18} color="#7F8C8D" />
            <Text style={styles.detailText}>Zuletzt gesehen: Berlin</Text>
          </View>

          <View style={styles.detailItem}>
            <MaterialCommunityIcons name="calendar" size={18} color="#7F8C8D" />
            <Text style={styles.detailText}>Registriert: 15.01.2025</Text>
          </View>

          <View style={styles.detailItem}>
            <MaterialCommunityIcons name="eye" size={18} color="#7F8C8D" />
            <Text style={styles.detailText}>8 Sichtungen</Text>
          </View>
        </View>
      </View>

      <View style={styles.actionsContainer}>
        <Text style={styles.actionTitle}>Nächste Schritte:</Text>

        {matchScore >= 0.7 ? (
          <>
            <TouchableOpacity style={styles.primaryAction} onPress={handleConfirmMatch}>
              <MaterialCommunityIcons name="check-circle" size={24} color="white" />
              <Text style={styles.primaryActionText}>Übereinstimmung bestätigen</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryAction} onPress={handleAddNew}>
              <MaterialCommunityIcons name="plus-circle" size={20} color="#4A90D9" />
              <Text style={styles.secondaryActionText}>Als neue Taube hinzufügen</Text>
=======
  const { imageUri, matches, isNewPigeon } = route.params;
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const { resetScan } = useScan();

  const handleMatchSelect = useCallback((matchId: string) => {
    setSelectedMatchId(matchId === selectedMatchId ? null : matchId);
  }, [selectedMatchId]);

  const handleConfirmMatch = useCallback(() => {
    if (!selectedMatchId) {
      Alert.alert('Bitte wählen', 'Wähle eine Taube aus der Liste aus.');
      return;
    }

    const match = matches.find((m) => m.pigeonId === selectedMatchId);
    if (match) {
      // Navigate to pigeon detail
      navigation.navigate('PigeonDetailScreen', {
        pigeonId: match.pigeonId,
        isNew: false,
      });
    }
  }, [selectedMatchId, matches, navigation]);

  const handleAddNewPigeon = useCallback(() => {
    // Navigate to create new pigeon
    navigation.navigate('PigeonDetailScreen', {
      isNew: true,
      initialPhotoUri: imageUri,
    });
  }, [navigation, imageUri]);

  const handleScanAgain = useCallback(() => {
    resetScan();
    navigation.navigate('ScanScreen');
  }, [navigation, resetScan]);

  // Empty Matches State
  const EmptyMatchesState = () => (
    <View style={styles.emptyContainer}>
      <MaterialCommunityIcons
        name="alert-box-outline"
        size={64}
        color="#BDC3C7"
      />
      <Text style={styles.emptyTitle}>Keine Übereinstimmung gefunden</Text>
      <Text style={styles.emptySubtitle}>
        Diese Taube wurde noch nicht in unserer Datenbank erfasst.
      </Text>
      <Text style={styles.emptyHint}>
        Füge sie als neue Taube hinzu oder versuche ein besseres Foto.
      </Text>
    </View>
  );

  // Get the best match
  const bestMatch = matches.length > 0
    ? matches.reduce((prev, current) =>
        prev.confidence > current.confidence ? prev : current
      )
    : null;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <MaterialCommunityIcons name="check-decagram" size={32} color="white" />
        </View>
        <Text style={styles.title}>Scan-Ergebnis</Text>
        <Text style={styles.subtitle}>
          {isNewPigeon
            ? 'Keine passende Taube gefunden'
            : `${matches.length} Übereinstimmung${matches.length !== 1 ? 'en' : ''} gefunden`}
        </Text>
      </View>

      {/* Scanned Image Preview */}
      <View style={styles.imageCard}>
        <Text style={styles.imageLabel}>Aufgenommenes Bild</Text>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: imageUri }}
            style={styles.capturedImage}
            resizeMode="cover"
          />
        </View>
      </View>

      {/* Best Match Card (if available) */}
      {!isNewPigeon && bestMatch && (
        <View style={styles.bestMatchCard}>
          <View style={styles.bestMatchHeader}>
            <MaterialCommunityIcons name="trophy" size={20} color="#F39C12" />
            <Text style={styles.bestMatchTitle}>Beste Übereinstimmung</Text>
          </View>

          <View style={styles.bestMatchContent}>
            <Text style={styles.bestMatchName}>
              {bestMatch.name}
            </Text>
            <View style={styles.bestMatchScore}>
              <Text
                style={[
                  styles.bestMatchScoreText,
                  { color: bestMatch.confidence >= 0.8 ? '#27AE60' : '#F39C12' },
                ]}
              >
                {Math.round(bestMatch.confidence * 100)}%
              </Text>
              <Text style={styles.bestMatchConfidence}>
                {bestMatch.confidence >= 0.8
                  ? 'Sehr wahrscheinlich'
                  : 'Wahrscheinlich'}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Matches List */}
      {!isNewPigeon && (
        <View style={styles.matchesSection}>
          <Text style={styles.sectionTitle}></Text>
          {matches.map((match) => (
            <MatchDisplay
              key={match.pigeonId}
              pigeonId={match.pigeonId}
              name={match.name}
              confidence={match.confidence}
              photoUrl={match.photoUrl}
              isSelected={selectedMatchId === match.pigeonId}
              onPress={() => handleMatchSelect(match.pigeonId)}
            />
          ))}
        </View>
      )}

      {/* Empty State */}
      {isNewPigeon && <EmptyMatchesState />}

      {/* Actions */}
      <View style={styles.actionsContainer}>
        <Text style={styles.actionTitle}>Nächste Schritte:</Text>

        {!isNewPigeon ? (
          <>
            <TouchableOpacity
              style={[
                styles.primaryAction,
                !selectedMatchId && styles.primaryActionDisabled,
              ]}
              onPress={handleConfirmMatch}
              disabled={!selectedMatchId}
            >
              <MaterialCommunityIcons name="check" size={20} color="white" />
              <Text style={styles.primaryActionText}>
                {selectedMatchId
                  ? 'Auswahl bestätigen'
                  : 'Wähle eine Taube aus'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryAction}
              onPress={handleAddNewPigeon}
            >
              <MaterialCommunityIcons
                name="plus-circle"
                size={20}
                color="#4A90D9"
              />
              <Text style={styles.secondaryActionText}>
                Als neue Taube hinzufügen
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.tertiaryAction}
              onPress={handleScanAgain}
            >
              <MaterialCommunityIcons
                name="camera-retake"
                size={18}
                color="#7F8C8D"
              />
              <Text style={styles.tertiaryActionText}>Erneut scannen</Text>
>>>>>>> main
            </TouchableOpacity>
          </>
        ) : (
          <>
<<<<<<< HEAD
            <TouchableOpacity style={styles.primaryAction} onPress={handleAddNew}>
              <MaterialCommunityIcons name="plus-circle" size={24} color="white" />
              <Text style={styles.primaryActionText}>Als neue Taube registrieren</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryAction} onPress={handleScanAgain}>
              <MaterialCommunityIcons name="camera-retake" size={20} color="#4A90D9" />
=======
            <TouchableOpacity
              style={styles.primaryAction}
              onPress={handleAddNewPigeon}
            >
              <MaterialCommunityIcons
                name="plus-circle"
                size={20}
                color="white"
              />
              <Text style={styles.primaryActionText}>
                Als neue Taube registrieren
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryAction}
              onPress={handleScanAgain}
            >
              <MaterialCommunityIcons
                name="camera-retake"
                size={20}
                color="#4A90D9"
              />
>>>>>>> main
              <Text style={styles.secondaryActionText}>Erneut scannen</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
<<<<<<< HEAD
  header: {
    alignItems: 'center',
    paddingVertical: 30,
=======
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  headerIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#4A90D9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
>>>>>>> main
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
<<<<<<< HEAD
    marginTop: 12,
    marginBottom: 8,
=======
    marginBottom: 4,
>>>>>>> main
  },
  subtitle: {
    fontSize: 14,
    color: '#7F8C8D',
  },
<<<<<<< HEAD
  scoreCard: {
    backgroundColor: 'white',
    margin: 20,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scoreLabel: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 16,
  },
  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#E8EAF0',
  },
  scoreValue: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  scoreText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
  },
  resultCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pigeonInfo: {
    marginLeft: 12,
  },
  pigeonName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
  },
  pigeonId: {
=======
  // Image Card
  imageCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  imageLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7F8C8D',
    marginBottom: 12,
  },
  imageContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    aspectRatio: 16 / 9,
    backgroundColor: '#2C3E50',
  },
  capturedImage: {
    width: '100%',
    height: '100%',
  },
  // Best Match
  bestMatchCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: '#F39C12',
  },
  bestMatchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  bestMatchTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F39C12',
  },
  bestMatchContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bestMatchName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  bestMatchScore: {
    alignItems: 'flex-end',
  },
  bestMatchScoreText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  bestMatchConfidence: {
>>>>>>> main
    fontSize: 12,
    color: '#7F8C8D',
    marginTop: 2,
  },
<<<<<<< HEAD
  divider: {
    height: 1,
    backgroundColor: '#ECF0F1',
    marginVertical: 16,
  },
  details: {
    gap: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#34495E',
  },
  actionsContainer: {
    margin: 20,
=======
  // Matches Section
  matchesSection: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 12,
  },
  // Empty State
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#7F8C8D',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyHint: {
    fontSize: 13,
    color: '#95A5A6',
    textAlign: 'center',
  },
  // Actions
  actionsContainer: {
    marginTop: 8,
>>>>>>> main
    gap: 12,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
<<<<<<< HEAD
    marginBottom: 8,
=======
    marginBottom: 4,
>>>>>>> main
  },
  primaryAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4A90D9',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
<<<<<<< HEAD
=======
  primaryActionDisabled: {
    backgroundColor: '#BDC3C7',
  },
>>>>>>> main
  primaryActionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#4A90D9',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  secondaryActionText: {
    color: '#4A90D9',
<<<<<<< HEAD
    fontSize: 16,
=======
    fontSize: 15,
    fontWeight: '600',
  },
  tertiaryAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 6,
  },
  tertiaryActionText: {
    color: '#7F8C8D',
    fontSize: 14,
>>>>>>> main
    fontWeight: '500',
  },
});
