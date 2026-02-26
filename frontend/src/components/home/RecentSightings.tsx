import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Sighting, Pigeon } from '../../types/store';
import type { RootTabNavigationProp } from '../../types/navigation';

interface RecentSightingsProps {
  sightings: Sighting[];
  pigeons: Pigeon[];
  maxItems?: number;
  isLoading?: boolean;
}

interface SightingItemProps {
  sighting: Sighting;
  pigeon: Pigeon | undefined;
  index: number;
}

const SightingItem: React.FC<SightingItemProps> = ({ sighting, pigeon, index }) => {
  const formattedDate = new Date(sighting.spottedAt).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <View style={styles.sightingItem}>
      <View style={styles.sightingNumber}>
        <Text style={styles.numberText}>{index + 1}</Text>
      </View>
      <View style={styles.sightingContent}>
        <Text style={styles.sightingName} numberOfLines={1}>
          {pigeon?.name || 'Unbekannte Taube'}
        </Text>
        <Text style={styles.sightingMeta}>{pigeon?.color || 'Unbekannte Farbe'}</Text>
        <Text style={styles.sightingDate}>{formattedDate}</Text>
      </View>
      {sighting.photoUrl ? (
        <MaterialCommunityIcons name="image" size={20} color="#4A90D9" />
      ) : (
        <MaterialCommunityIcons name="image-off" size={20} color="#95A5A6" />
      )}
    </View>
  );
};

export const RecentSightings: React.FC<RecentSightingsProps> = ({
  sightings,
  pigeons,
  maxItems = 3,
  isLoading = false,
}) => {
  const navigation = useNavigation<RootTabNavigationProp>();

  const recentSightings = sightings
    .sort((a, b) => new Date(b.spottedAt).getTime() - new Date(a.spottedAt).getTime())
    .slice(0, maxItems);

  const getPigeonById = (id: string) => pigeons.find((p) => p.id === id);

  const handleViewAll = () => {
    navigation.navigate('PigeonsTab', { screen: 'PigeonListScreen' });
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Letzte Sichtungen</Text>
        <View style={styles.loadingContainer}>
          <MaterialCommunityIcons name="loading" size={24} color="#4A90D9" />
          <Text style={styles.loadingText}>Lade Sichtungen...</Text>
        </View>
      </View>
    );
  }

  if (recentSightings.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Letzte Sichtungen</Text>
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="image-off" size={48} color="#95A5A6" />
          <Text style={styles.emptyText}>Noch keine Sichtungen vorhanden</Text>
          <Text style={styles.emptySubtext}>Scanne eine Taube, um loszulegen!</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Letzte Sichtungen</Text>
        <TouchableOpacity onPress={handleViewAll}>
          <Text style={styles.viewAllLink}>Alle anzeigen</Text>
        </TouchableOpacity>
      </View>
      {recentSightings.map((sighting, index) => (
        <SightingItem
          key={sighting.id}
          sighting={sighting}
          pigeon={getPigeonById(sighting.pigeonId)}
          index={index}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
  },
  viewAllLink: {
    fontSize: 14,
    color: '#4A90D9',
    fontWeight: '500',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  loadingText: {
    marginTop: 8,
    color: '#7F8C8D',
    fontSize: 14,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: 'white',
    borderRadius: 16,
    marginTop: 8,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: '#2C3E50',
    fontWeight: '500',
  },
  emptySubtext: {
    marginTop: 4,
    fontSize: 14,
    color: '#7F8C8D',
  },
  sightingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sightingNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E8F4FC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#4A90D9',
  },
  sightingContent: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  sightingName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 2,
  },
  sightingMeta: {
    fontSize: 13,
    color: '#7F8C8D',
  },
  sightingDate: {
    fontSize: 12,
    color: '#95A5A6',
    marginTop: 2,
  },
});
