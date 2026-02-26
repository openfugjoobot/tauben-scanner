import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { PigeonsStackParamList } from '../../types/navigation';

type Props = NativeStackScreenProps<PigeonsStackParamList, 'PigeonDetailScreen'>;

// Mock-Daten für eine einzelne Taube
const getMockPigeon = (id: string) => ({
  id,
  name: `Taube ${id.slice(-4).toUpperCase()}`,
  registeredDate: '2025-01-15',
  lastSeen: '2025-02-25',
  location: 'Berlin-Mitte',
  sightings: 12,
  isPublic: true,
  notes: 'Diese Taube wurde regelmäßig in der Berliner Innenstadt gesichtet. Sie hat ein markantes Federkleid.',
});

const SIGHTINGS_DATA = [
  { id: 1, date: '25.02.2025', location: 'Berlin-Mitte', confidence: 0.92 },
  { id: 2, date: '24.02.2025', location: 'Berlin-Mitte', confidence: 0.89 },
  { id: 3, date: '22.02.2025', location: 'Berlin-Centrum', confidence: 0.95 },
  { id: 4, date: '20.02.2025', location: 'Berlin-Mitte', confidence: 0.87 },
  { id: 5, date: '18.02.2025', location: 'Berlin-Tiergarten', confidence: 0.91 },
];

export const PigeonDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { pigeonId } = route.params;
  const pigeon = getMockPigeon(pigeonId);

  return (
    <ScrollView style={styles.container}>
      {/* Header mit Back-Button */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="#2C3E50" />
        </TouchableOpacity>
        <View style={styles.headerTitle}>
          <Text style={styles.title}>{pigeon.name}</Text>
        </View>
        <TouchableOpacity style={styles.editButton}>
          <MaterialCommunityIcons name="pencil" size={20} color="#4A90D9" />
        </TouchableOpacity>
      </View>

      {/* Profil-Sektion */}
      <View style={styles.profileSection}>
        <View style={styles.profileImageContainer}>
          <View style={styles.profileImagePlaceholder}>
            <MaterialCommunityIcons name="bird" size={64} color="#BDC3C7" />
          </View>
          <View style={styles.statusBadge}>
            <MaterialCommunityIcons name="check-circle" size={20} color="#27AE60" />
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{pigeon.sightings}</Text>
            <Text style={styles.statLabel}>Sichtungen</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{pigeon.registeredDate.slice(0, 4)}</Text>
            <Text style={styles.statLabel}>Registriert</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>92%</Text>
            <Text style={styles.statLabel}>Ø Match</Text>
          </View>
        </View>
      </View>

      {/* Info-Karten */}
      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Informationen</Text>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="identifier" size={20} color="#7F8C8D" />
            <Text style={styles.infoLabel}>ID:</Text>
            <Text style={styles.infoValue}>{pigeon.id}</Text>
          </View>

          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="calendar" size={20} color="#7F8C8D" />
            <Text style={styles.infoLabel}>Registriert:</Text>
            <Text style={styles.infoValue}>{pigeon.registeredDate}</Text>
          </View>

          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="map-marker" size={20} color="#7F8C8D" />
            <Text style={styles.infoLabel}>Letzte Position:</Text>
            <Text style={styles.infoValue}>{pigeon.location}</Text>
          </View>

          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="eye" size={20} color="#7F8C8D" />
            <Text style={styles.infoLabel}>letzte Sichtung:</Text>
            <Text style={styles.infoValue}>{pigeon.lastSeen}</Text>
          </View>

          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="earth" size={20} color="#7F8C8D" />
            <Text style={styles.infoLabel}>Sichtbarkeit:</Text>
            <Text style={[styles.infoValue, { color: pigeon.isPublic ? '#27AE60' : '#E74C3C' }]}>
              {pigeon.isPublic ? 'Öffentlich' : 'Privat'}
            </Text>
          </View>
        </View>

        {pigeon.notes && (
          <View style={styles.notesCard}>
            <Text style={styles.notesLabel}>Notizen</Text>
            <Text style={styles.notesText}>{pigeon.notes}</Text>
          </View>
        )}
      </View>

      {/* Sichtungen */}
      <View style={styles.sightingsSection}>
        <Text style={styles.sectionTitle}>Letzte Sichtungen</Text>
        <View style={styles.sightingsList}>
          {SIGHTINGS_DATA.map((sighting, index) => (
            <View key={sighting.id} style={styles.sightingItem}>
              <View style={styles.sightingNumber}>
                <Text style={styles.sightingNumberText}>#{index + 1}</Text>
              </View>
              <View style={styles.sightingInfo}>
                <Text style={styles.sightingDate}>{sighting.date}</Text>
                <Text style={styles.sightingLocation}>{sighting.location}</Text>
              </View>
              <View style={styles.confidenceBadge}>
                <MaterialCommunityIcons name="percent" size={12} color="white" />
                <Text style={styles.confidenceText}>{Math.round(sighting.confidence * 100)}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Aktionen */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton}>
          <MaterialCommunityIcons name="share-variant" size={20} color="#4A90D9" />
          <Text style={styles.actionButtonText}>Taube teilen</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionButton, styles.deleteButton]}>
          <MaterialCommunityIcons name="delete" size={20} color="#E74C3C" />
          <Text style={[styles.actionButtonText, styles.deleteText]}>Löschen</Text>
        </TouchableOpacity>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: 'white',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F7FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EBF4FD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileSection: {
    backgroundColor: 'white',
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  profileImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F5F7FA',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#EBF4FD',
  },
  statusBadge: {
    position: 'absolute',
    bottom: 0,
    right: '30%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  statLabel: {
    fontSize: 12,
    color: '#7F8C8D',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#ECF0F1',
  },
  infoSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 16,
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F7FA',
    gap: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#7F8C8D',
    minWidth: 100,
  },
  infoValue: {
    fontSize: 14,
    color: '#2C3E50',
    fontWeight: '500',
    flex: 1,
  },
  notesCard: {
    backgroundColor: '#FEF9E7',
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#FCE8B2',
  },
  notesLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B6914',
    marginBottom: 8,
  },
  notesText: {
    fontSize: 14,
    color: '#7D6608',
    lineHeight: 20,
  },
  sightingsSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sightingsList: {
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
  },
  sightingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F7FA',
  },
  sightingNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#4A90D9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sightingNumberText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  sightingInfo: {
    flex: 1,
    marginLeft: 12,
  },
  sightingDate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
  },
  sightingLocation: {
    fontSize: 12,
    color: '#7F8C8D',
    marginTop: 2,
  },
  confidenceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: '#27AE60',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  confidenceText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  actions: {
    padding: 20,
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ECF0F1',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4A90D9',
  },
  deleteButton: {
    borderColor: '#F5B7B1',
  },
  deleteText: {
    color: '#E74C3C',
  },
});
