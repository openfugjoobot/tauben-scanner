import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ScanStackParamList } from '../../types/navigation';

type Props = NativeStackScreenProps<ScanStackParamList, 'ResultsScreen'>;

export const ResultsScreen: React.FC<Props> = ({ route, navigation }) => {
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
        <MaterialCommunityIcons name="magnify-plus-outline" size={48} color="#4A90D9" />
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
          <MaterialCommunityIcons name="bird" size={32} color="#4A90D9" />
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
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity style={styles.primaryAction} onPress={handleAddNew}>
              <MaterialCommunityIcons name="plus-circle" size={24} color="white" />
              <Text style={styles.primaryActionText}>Als neue Taube registrieren</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryAction} onPress={handleScanAgain}>
              <MaterialCommunityIcons name="camera-retake" size={20} color="#4A90D9" />
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
  header: {
    alignItems: 'center',
    paddingVertical: 30,
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
    fontSize: 12,
    color: '#7F8C8D',
    marginTop: 2,
  },
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
    gap: 12,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 8,
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
    fontSize: 16,
    fontWeight: '500',
  },
});
