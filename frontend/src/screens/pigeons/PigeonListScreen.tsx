<<<<<<< HEAD
import React, { useState } from 'react';
=======
/**
 * T8a: Pigeon List Screen
 * - Search bar with live filtering
 * - FlatList with PigeonCard components
 * - Empty state
 * - Pull-to-refresh
 * - FAB (Floating Action Button)
 */

import React, { useState, useCallback } from 'react';
>>>>>>> main
import {
  View,
  Text,
  StyleSheet,
  FlatList,
<<<<<<< HEAD
  TouchableOpacity,
  TextInput,
=======
  TextInput,
  RefreshControl,
  ActivityIndicator,
  useColorScheme,
>>>>>>> main
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { PigeonsStackParamList } from '../../types/navigation';
<<<<<<< HEAD

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
        <MaterialCommunityIcons name="pigeon" size={32} color="#BDC3C7" />
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
            <MaterialCommunityIcons name="pigeon-off" size={48} color="#BDC3C7" />
            <Text style={styles.emptyText}>Keine Tauben gefunden</Text>
          </View>
        }
      />

      <TouchableOpacity style={styles.fab}>
        <MaterialCommunityIcons name="plus" size={24} color="white" />
      </TouchableOpacity>
=======
import type { Pigeon } from '../../types';
import { usePigeons } from '../../hooks';
import { PigeonCard } from '../../components/pigeons';

type Props = NativeStackScreenProps<PigeonsStackParamList, 'PigeonListScreen'>;

// ==================== Constants ====================

const REFRESH_COLORS = ['#4A90D9'];
const DEBOUNCE_DELAY = 300; // ms

// ==================== Component ====================

export const PigeonListScreen: React.FC<Props> = ({ navigation }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Local search state for immediate UI feedback
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Fetch pigeons with React Query
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = usePigeons({
    search: debouncedSearch || undefined,
    page: 1,
    limit: 50, // Load more at once for better UX
  });

  // Debounce search query
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Filter pigeons locally by name for additional client-side filtering
  const filteredPigeons = React.useMemo(() => {
    const pigeons = data?.pigeons || [];
    
    if (!searchQuery.trim()) {
      return pigeons;
    }
    
    // Additional client-side filtering
    const lowerQuery = searchQuery.toLowerCase();
    return pigeons.filter((pigeon) =>
      pigeon.name.toLowerCase().includes(lowerQuery) ||
      pigeon.id.toLowerCase().includes(lowerQuery)
    );
  }, [data?.pigeons, searchQuery]);

  // Handle pigeon card press (placeholder - navigation not implemented yet)
  const handlePigeonPress = useCallback((pigeon: Pigeon) => {
    // Placeholder: Navigation to detail screen will be implemented in T8b
    console.log('Pigeon pressed:', pigeon.id);
    // navigation.navigate('PigeonDetailScreen', { pigeonId: pigeon.id });
  }, []);

  // Handle FAB press (placeholder)
  const handleFabPress = useCallback(() => {
    // Placeholder: Add pigeon action will be implemented later
    console.log('FAB pressed - Add pigeon');
  }, []);

  // Handle clear search
  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
    setDebouncedSearch('');
  }, []);

  // ==================== Render Helpers ====================

  const renderPigeonItem = useCallback(({ item }: { item: Pigeon }) => (
    <PigeonCard
      pigeon={item}
      onPress={handlePigeonPress}
    />
  ), [handlePigeonPress]);

  const keyExtractor = useCallback((item: Pigeon) => item.id, []);

  // ==================== Empty State ====================

  const renderEmptyState = () => {
    if (isLoading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color="#4A90D9" />
          <Text style={[styles.emptyText, isDark && styles.emptyTextDark]}>
            Tauben werden geladen...
          </Text>
        </View>
      );
    }

    if (isError) {
      return (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons
            name="alert-circle-outline"
            size={48}
            color={isDark ? '#666' : '#E74C3C'}
          />
          <Text style={[styles.emptyText, isDark && styles.emptyTextDark]}>
            Fehler beim Laden
          </Text>
          <Text style={[styles.errorSubtext, isDark && styles.errorSubtextDark]}>
            {error?.message || 'Bitte versuche es erneut'}
          </Text>
        </View>
      );
    }

    if (searchQuery.trim()) {
      return (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons
            name="magnify-close"
            size={48}
            color={isDark ? '#666' : '#BDC3C7'}
          />
          <Text style={[styles.emptyText, isDark && styles.emptyTextDark]}>
            Keine Tauben gefunden
          </Text>
          <Text style={[styles.emptySubtext, isDark && styles.emptySubtextDark]}>
            Versuche eine andere Suche
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <MaterialCommunityIcons
          name="pigeon-off"
          size={48}
          color={isDark ? '#666' : '#BDC3C7'}
        />
        <Text style={[styles.emptyText, isDark && styles.emptyTextDark]}>
          Keine Tauben gefunden
        </Text>
        <Text style={[styles.emptySubtext, isDark && styles.emptySubtextDark]}>
          Füge deine erste Taube hinzu
        </Text>
      </View>
    );
  };

  // ==================== Render ====================

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      {/* Header */}
      <View style={[styles.header, isDark && styles.headerDark]}>
        <Text style={[styles.title, isDark && styles.titleDark]}>
          Meine Tauben
        </Text>
        <Text style={[styles.subtitle, isDark && styles.subtitleDark]}>
          {data?.pigeons?.length || 0} registrierte Tauben
        </Text>
      </View>

      {/* Search Bar */}
      <View style={[styles.searchContainer, isDark && styles.searchContainerDark]}>
        <MaterialCommunityIcons
          name="magnify"
          size={20}
          color={isDark ? '#888' : '#7F8C8D'}
          style={styles.searchIcon}
        />
        <TextInput
          style={[styles.searchInput, isDark && styles.searchInputDark]}
          placeholder="Name oder Ringnummer suchen..."
          placeholderTextColor={isDark ? '#666' : '#95A5A6'}
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
        />
        
        {searchQuery.length > 0 && (
          <MaterialCommunityIcons
            name="close-circle"
            size={20}
            color={isDark ? '#888' : '#95A5A6'}
            onPress={handleClearSearch}
            style={styles.clearIcon}
          />
        )}
      </View>

      {/* Pigeon List */}
      <FlatList
        data={filteredPigeons}
        renderItem={renderPigeonItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            colors={REFRESH_COLORS}
            tintColor={isDark ? '#4A90D9' : '#4A90D9'}
          />
        }
        ListEmptyComponent={renderEmptyState}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews={true}
      />

      {/* FAB */}
      <View
        style={styles.fabContainer}
        accessibilityRole="button"
        accessibilityLabel="Taube hinzufügen"
      >
        <MaterialCommunityIcons
          name="plus"
          size={28}
          color="white"
          onPress={handleFabPress}
          style={styles.fab}
        />
      </View>
>>>>>>> main
    </View>
  );
};

<<<<<<< HEAD
=======
// ==================== Styles ====================

>>>>>>> main
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
<<<<<<< HEAD
=======
  containerDark: {
    backgroundColor: '#000000',
  },
>>>>>>> main
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: 'white',
  },
<<<<<<< HEAD
=======
  headerDark: {
    backgroundColor: '#1C1C1E',
  },
>>>>>>> main
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
<<<<<<< HEAD
=======
  titleDark: {
    color: '#FFFFFF',
  },
>>>>>>> main
  subtitle: {
    fontSize: 14,
    color: '#7F8C8D',
    marginTop: 4,
  },
<<<<<<< HEAD
=======
  subtitleDark: {
    color: '#888',
  },
>>>>>>> main
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    margin: 16,
<<<<<<< HEAD
=======
    marginTop: 0,
>>>>>>> main
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
<<<<<<< HEAD
=======
  searchContainerDark: {
    backgroundColor: '#2C2C2E',
    borderColor: '#3A3A3C',
  },
>>>>>>> main
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#2C3E50',
  },
<<<<<<< HEAD
  clearButton: {
    padding: 4,
=======
  searchInputDark: {
    color: '#FFFFFF',
  },
  clearIcon: {
    marginLeft: 8,
>>>>>>> main
  },
  listContainer: {
    padding: 16,
    paddingTop: 0,
<<<<<<< HEAD
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
=======
    paddingBottom: 80, // Space for FAB
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    color: '#95A5A6',
    marginTop: 16,
    fontWeight: '500',
  },
  emptyTextDark: {
    color: '#888',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#BDC3C7',
    marginTop: 8,
  },
  emptySubtextDark: {
    color: '#666',
  },
  errorSubtext: {
    fontSize: 14,
    color: '#E74C3C',
    marginTop: 8,
  },
  errorSubtextDark: {
    color: '#FF6B6B',
  },
  fabContainer: {
    position: 'absolute',
    right: 20,
    bottom: 30,
>>>>>>> main
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
<<<<<<< HEAD
});
=======
  fab: {
    // Touchable area
  },
});

export default PigeonListScreen;
>>>>>>> main
