import React from 'react';
import { View, StyleSheet, Image, ScrollView } from 'react-native';
import { Text, Button, Card, Chip, ProgressBar } from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScanStackParamList } from '../../navigation/types';
import { useTheme } from "../../theme";

type ResultsScreenRouteProp = RouteProp<ScanStackParamList, 'Results'>;

// Erweiterte Pigeon-Type für die UI
interface PigeonWithDetails {
  id: string;
  name?: string;
  bandNumber?: string;
  description?: string;
  imageUri?: string;
}

// Erweiterte MatchResult-Type
interface ExtendedMatchResult {
  match: boolean;
  confidence: number;
  pigeon: PigeonWithDetails | null;
  message?: string;
  isNewPigeon: boolean;
}

const getConfidenceColor = (confidence: number, isDark: boolean): string => {
  if (confidence >= 80) return isDark ? '#4ADE80' : '#22C55E'; // Success
  if (confidence >= 60) return isDark ? '#FBBF24' : '#F59E0B'; // Warning
  if (confidence >= 40) return isDark ? '#FB923C' : '#F97316'; // Orange variant
  return isDark ? '#F87171' : '#EF4444'; // Error
};

const getConfidenceLabel = (confidence: number): string => {
  if (confidence >= 80) return 'Sehr wahrscheinlich';
  if (confidence >= 60) return 'Wahrscheinlich';
  if (confidence >= 40) return 'Möglich';
  return 'Unsicher';
};

export const ResultsScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute<ResultsScreenRouteProp>();
  const { matchResult } = route.params;
  
  // Fallback wenn kein Result
  const result: ExtendedMatchResult = matchResult || {
    match: false,
    confidence: 0,
    pigeon: null,
    isNewPigeon: true,
    message: 'Keine Übereinstimmung gefunden'
  };

  const isDark = theme.dark ?? false;
  const confidenceColor = getConfidenceColor(result.confidence, isDark);
  const confidenceLabel = getConfidenceLabel(result.confidence);

  const handleViewDetails = () => {
    if (result.pigeon?.id) {
      // Navigation zu PigeonDetail über MainTabs > PigeonsFlow
      navigation.navigate('MainTabs', {
        screen: 'PigeonsFlow',
        params: {
          screen: 'PigeonDetail',
          params: { pigeonId: result.pigeon.id }
        }
      });
    }
  };

  const handleNewPigeon = () => {
    // TODO: Navigation zu NewPigeon implementieren
    // navigation.navigate('NewPigeon', { photoUri: '' });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text variant="headlineMedium" style={[styles.title, { color: theme.colors.onSurface }]}>
            {result.pigeon?.name ? 'Taube gefunden!' : 'Keine Übereinstimmung'}
          </Text>
        </View>

        {/* Konfidenz-Score */}
        <Card style={[styles.confidenceCard, { borderColor: confidenceColor }]}>
          <Card.Content>
            <View style={styles.confidenceHeader}>
              <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>Übereinstimmung</Text>
              <Chip
                style={[styles.confidenceChip, { backgroundColor: confidenceColor }]}
                textStyle={{ color: theme.colors.onPrimary, fontWeight: 'bold' }}
              >
                {Math.round(result.confidence)}%
              </Chip>
            </View>

            <ProgressBar
              progress={result.confidence / 100}
              color={confidenceColor}
              style={styles.progressBar}
            />

            <Text
              variant="bodyMedium"
              style={[styles.confidenceLabel, { color: confidenceColor }]}
            >
              {confidenceLabel}
            </Text>
          </Card.Content>
        </Card>

        {/* Tauben-Details */}
        {result.pigeon && (
          <Card style={styles.detailsCard}>
            <Card.Content>
              <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
                Gefundene Taube
              </Text>

              {result.pigeon.imageUri && (
                <View style={styles.pigeonImageContainer}>
                  <Image
                    source={{ uri: result.pigeon.imageUri }}
                    style={styles.pigeonImage}
                    resizeMode="cover"
                  />
                </View>
              )}

              <View style={styles.detailRow}>
                <Text variant="bodyMedium" style={[styles.detailLabel, { color: theme.colors.onSurfaceVariant }]}>
                  Name:
                </Text>
                <Text variant="bodyLarge" style={[styles.detailValue, { color: theme.colors.onSurface }]}>
                  {result.pigeon.name || 'Unbekannt'}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text variant="bodyMedium" style={[styles.detailLabel, { color: theme.colors.onSurfaceVariant }]}>
                  Ring-Nr:
                </Text>
                <Text variant="bodyLarge" style={[styles.detailValue, { color: theme.colors.onSurface }]}>
                  {result.pigeon.bandNumber || 'Keine'}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text variant="bodyMedium" style={[styles.detailLabel, { color: theme.colors.onSurfaceVariant }]}>
                  ID:
                </Text>
                <Text variant="bodyMedium" style={[styles.detailValue, styles.idText, { color: theme.colors.onSurfaceVariant }]}>
                  #{result.pigeon.id}
                </Text>
              </View>

              {result.pigeon.description && (
                <View style={[styles.descriptionContainer, { borderTopColor: theme.colors.outline }]}>
                  <Text variant="bodyMedium" style={[styles.detailLabel, { color: theme.colors.onSurfaceVariant }]}>
                    Beschreibung:
                  </Text>
                  <Text variant="bodySmall" style={[styles.description, { color: theme.colors.onSurfaceVariant }]}>
                    {result.pigeon.description}
                  </Text>
                </View>
              )}
            </Card.Content>
          </Card>
        )}

        {/* Kein Match */}
        {!result.pigeon && (
          <Card style={[styles.noMatchCard, { 
            backgroundColor: isDark ? theme.colors.surface : '#FFF8E1',
            borderColor: isDark ? theme.colors.outline : '#FFE0B2'
          }]}>
            <Card.Content>
              <Text variant="titleMedium" style={{ textAlign: 'center', marginBottom: 8, color: theme.colors.onSurface }}>
                🤔 Keine passende Taube
              </Text>
              <Text variant="bodyMedium" style={{ textAlign: 'center', color: theme.colors.onSurfaceVariant }}>
                Diese Taube wurde noch nicht in der Datenbank gefunden.
              </Text>
            </Card.Content>
          </Card>
        )}
      </ScrollView>

      {/* Action Buttons */}
      <View style={[styles.buttonContainer, { backgroundColor: theme.colors.surface, borderTopColor: theme.colors.outline }]}>
        {result.pigeon && (
          <Button
            mode="contained"
            onPress={handleViewDetails}
            style={styles.primaryButton}
            icon="eye"
          >
            Details ansehen
          </Button>
        )}

        <Button
          mode={result.pigeon ? "outlined" : "contained"}
          onPress={handleNewPigeon}
          style={styles.button}
          icon="plus"
          disabled={true} // TODO: Navigation implementieren
        >
          Neue Taube anlegen
        </Button>

        <Button
          mode="text"
          onPress={() => navigation.goBack()}
          style={styles.button}
          icon="arrow-left"
        >
          Zurück zum Scannen
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    fontWeight: '600',
  },
  confidenceCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderWidth: 2,
    elevation: 2,
  },
  confidenceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  confidenceChip: {
    borderRadius: 16,
    height: 36,
  },
  progressBar: {
    height: 16,
    borderRadius: 8,
  },
  confidenceLabel: {
    marginTop: 12,
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
  detailsCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 2,
  },
  sectionTitle: {
    marginBottom: 16,
    fontWeight: '600',
  },
  pigeonImageContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  pigeonImage: {
    width: 200,
    height: 200,
    borderRadius: 12,
  },
  detailRow: {
    flexDirection: 'row',
    marginVertical: 8,
    alignItems: 'center',
    paddingVertical: 4,
  },
  detailLabel: {
    width: 90,
    fontWeight: '500',
  },
  detailValue: {
    flex: 1,
    fontWeight: '600',
  },
  idText: {
    fontSize: 13,
  },
  descriptionContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
  },
  description: {
    marginTop: 8,
    lineHeight: 22,
  },
  noMatchCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    elevation: 2,
  },
  buttonContainer: {
    padding: 16,
    paddingTop: 8,
    borderTopWidth: 1,
  },
  primaryButton: {
    marginBottom: 8,
    paddingVertical: 4,
  },
  button: {
    marginVertical: 4,
    paddingVertical: 4,
  },
});

export default ResultsScreen;
