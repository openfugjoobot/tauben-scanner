/**
 * T8a: Pigeon List Screen
 * - Search bar with live filtering
 * - FlatList with PigeonCard components
 * - Empty state
 * - Pull-to-refresh
 * - FAB (Floating Action Button)
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  RefreshControl,
  ActivityIndicator,
  useColorScheme,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { PigeonsStackParamList } from '../../types/navigation';
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
    </View>
  );
};

// ==================== Styles ====================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  containerDark: {
    backgroundColor: '#000000',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: 'white',
  },
  headerDark: {
    backgroundColor: '#1C1C1E',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  titleDark: {
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 14,
    color: '#7F8C8D',
    marginTop: 4,
  },
  subtitleDark: {
    color: '#888',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    margin: 16,
    marginTop: 0,
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  searchContainerDark: {
    backgroundColor: '#2C2C2E',
    borderColor: '#3A3A3C',
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
  searchInputDark: {
    color: '#FFFFFF',
  },
  clearIcon: {
    marginLeft: 8,
  },
  listContainer: {
    padding: 16,
    paddingTop: 0,
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
  fab: {
    // Touchable area
  },
});

export default PigeonListScreen;
