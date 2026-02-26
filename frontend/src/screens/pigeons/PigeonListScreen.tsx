import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { PigeonsStackParamList } from '../../types/navigation';

type Props = NativeStackScreenProps<PigeonsStackParamList, 'PigeonListScreen'>;

// Mock-Daten für Tauben
const MOCK_PIGEONS = [
  {
    id: 'pigeon-001',
    name: 'Taube Alpha',
    lastSeen: '2025-02-25',
    location: 'Berlin-Mitte',
    sightings: 12,
    imageUrl: null,
  },
  {
    id: 'pigeon-002',
    name: 'Taube Beta',
    lastSeen: '2025-02-24',
    location: 'Berlin-Kreuzberg',
    sightings: 8,
    imageUrl: null,
  },
  {
    id: 'pigeon-003',
    name: 'Taube Gamma',
    lastSeen: '2025-02-23',
    location: 'Berlin-Prenzlauer Berg',
    sightings: 5,
    imageUrl: null,
  },
  {
    id: 'pigeon-004',
    name: 'Taube Delta',
    lastSeen: '2025-02-22',
    location: 'Berlin-Charlottenburg',
    sightings: 15,
    imageUrl: null,
  },
  {
    id: 'pigeon-005',
    name: 'Taube Epsilon',
    lastSeen: '2025-02-20',
    location: 'Berlin-Neukölln',
    sightings: 3,
    imageUrl: null,
  },
];

export const PigeonListScreen: React.FC<Props> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPigeons = MOCK_PIGEONS.filter(pigeon =>
    pigeon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pigeon.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderPigeonItem = ({ item }: { item: typeof MOCK_PIGEONS[0] }) => (
    <TouchableOpacity
      style={styles.pigeonCard}
      onPress={() => navigation.navigate('PigeonDetailScreen', { pigeonId: item.id })}
    >
      <View style={styles.pigeonImagePlaceholder}>
        <MaterialCommunityIcons name="bird" size={32} color="#BDC3C7" />
      </View>

      <View style={styles.pigeonInfo}>
        <Text style={styles.pigeonName}>{item.name}</Text>
        
        <View style={styles.pigeonMeta}>
          <MaterialCommunityIcons name="map-marker" size={14} color="#7F8C8D" />
          <Text style={styles.pigeonLocation}>{item.location}</Text>
        </View>

        <View style={styles.pigeonStats}>
          <View style={styles.statBadge}>
            <MaterialCommunityIcons name="eye" size={12} color="#4A90D9" />
            <Text style={styles.statText}>{item.sightings}x gesehen</Text>
          </View>

          <Text style={styles.lastSeen}>Zuletzt: {item.lastSeen}</Text>
        </View>
      </View>

      <MaterialCommunityIcons name="chevron-right" size={24} color="#BDC3C7" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Meine Tauben</Text>
        <Text style={styles.subtitle}>{MOCK_PIGEONS.length} registrierte Tauben</Text>
      </View>

      <View style={styles.searchContainer}>
        <MaterialCommunityIcons
          name="magnify"
          size={20}
          color="#7F8C8D"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Suchen..."
          placeholderTextColor="#95A5A6"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
            <MaterialCommunityIcons name="close-circle" size={20} color="#95A5A6" />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={filteredPigeons}
        renderItem={renderPigeonItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="image-off" size={48} color="#BDC3C7" />
            <Text style={styles.emptyText}>Keine Tauben gefunden</Text>
          </View>
        }
      />

      <TouchableOpacity style={styles.fab}>
        <MaterialCommunityIcons name="plus" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  subtitle: {
    fontSize: 14,
    color: '#7F8C8D',
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    margin: 16,
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#2C3E50',
  },
  clearButton: {
    padding: 4,
  },
  listContainer: {
    padding: 16,
    paddingTop: 0,
    gap: 12,
  },
  pigeonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  pigeonImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F5F7FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pigeonInfo: {
    flex: 1,
    marginLeft: 12,
  },
  pigeonName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 4,
  },
  pigeonMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  pigeonLocation: {
    fontSize: 12,
    color: '#7F8C8D',
  },
  pigeonStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EBF4FD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statText: {
    fontSize: 12,
    color: '#4A90D9',
    fontWeight: '500',
  },
  lastSeen: {
    fontSize: 12,
    color: '#95A5A6',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#95A5A6',
    marginTop: 16,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4A90D9',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
});
