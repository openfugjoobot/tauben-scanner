import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { usePigeonsNavigation } from '../../navigation/hooks';
import { Text } from '../../components/atoms/Text';
import { Button } from '../../components/atoms/Button';
import { Icon } from '../../components/atoms/Icon';
import { PigeonList } from './components/PigeonList';
import { usePigeons } from '../../hooks/queries';
import { useDebounce } from '../../hooks';
import { useTheme } from '../../theme';
import { spacing } from '../../theme/spacing';
import { SearchBar } from '../../components/molecules/SearchBar';

export const PigeonListScreen: React.FC = () => {
  const navigation = usePigeonsNavigation();
  const theme = useTheme();
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const debouncedSearch = useDebounce(searchQuery, 500);
  const effectiveSearch = debouncedSearch;

  const { data, isLoading, isFetching, refetch, isError, error } = usePigeons({
    page,
    limit: 20,
    search: effectiveSearch || undefined,
  });

  const handleEndReached = useCallback(() => {
    if (data?.pagination && page < data.pagination.pages) {
      setPage((p) => p + 1);
    }
  }, [data, page]);

  const handlePigeonPress = useCallback(
    (id: string) => {
      navigation.navigate('PigeonDetail', { pigeonId: id });
    },
    [navigation]
  );

  const handleAddPigeon = useCallback(() => {
    navigation.navigate('NewPigeon');
  }, [navigation]);

  // ERROR state
  if (isError) {
    return (
      <View style={styles.centered}>
        <Icon name="alert-circle" size={64} color={theme.colors.error} />
        <Text variant="h3" style={[styles.emptyTitle, { color: theme.colors.error }]} >
          Verbindungsfehler
        </Text>
        <Text variant="body" color={theme.colors.onSurfaceVariant} style={styles.emptyText}>
          {error?.message || 'Server nicht erreichbar. Bitte später erneut versuchen.'}
        </Text>
        <Button variant="primary" onPress={() => refetch()} style={styles.addButton}>
          Erneut laden
        </Button>
      </View>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text variant="body" color={theme.colors.onSurfaceVariant} style={styles.loadingText}>
          Tauben werden geladen...
        </Text>
      </View>
    );
  }

  // Empty state - keine Daten UND keine Suche
  if (!data?.pigeons?.length && !searchQuery) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text variant="h1" style={styles.headerTitle}>
          Tauben
        </Text>
        
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onClear={() => setSearchQuery('')}
          placeholder="Tauben suchen..."
        />

        <View style={styles.centered}>
          <Icon name="bird" size={64} color={theme.colors.onSurfaceVariant} />
          <Text variant="h3" style={styles.emptyTitle}>
            Keine Tauben gefunden
          </Text>
          <Text variant="body" color={theme.colors.onSurfaceVariant} style={styles.emptyText}>
            Füge deine erste Taube hinzu oder starte einen Scan.
          </Text>
          <Button variant="primary" onPress={handleAddPigeon} style={styles.addButton}>
            Taube hinzufügen
          </Button>
        </View>
      </View>
    );
  }

  // Empty state - Suche ohne Ergebnisse
  if (!data?.pigeons?.length && searchQuery) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text variant="h1" style={styles.headerTitle}>
          Tauben
        </Text>
        
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onClear={() => setSearchQuery('')}
          placeholder="Tauben suchen..."
        />

        <View style={styles.centered}>
          <Icon name="magnify-close" size={64} color={theme.colors.onSurfaceVariant} />
          <Text variant="h3" style={styles.emptyTitle}>
            Keine Ergebnisse
          </Text>
          <Text variant="body" color={theme.colors.onSurfaceVariant} style={styles.emptyText}>
            Keine Tauben gefunden für "{searchQuery}"
          </Text>
          <Button variant="secondary" onPress={() => setSearchQuery('')} style={styles.addButton}>
            Suche zurücksetzen
          </Button>
        </View>
      </View>
    );
  }

  // DATA vorhanden
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text variant="h1" style={styles.headerTitle}>
        Tauben
      </Text>
      
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        onClear={() => setSearchQuery('')}
        placeholder="Tauben suchen..."
      />

      <View style={styles.listContainer}>
        <PigeonList
          pigeons={data?.pigeons || []}
          onPigeonPress={handlePigeonPress}
          onEndReached={handleEndReached}
          isLoadingMore={isFetching}
        />
      </View>

      {/* Floating Add FAB */}
      <TouchableOpacity 
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={handleAddPigeon}
        activeOpacity={0.8}
      >
        <Icon name="plus" size={24} color={theme.colors.onPrimary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerTitle: {
    marginTop: 16,
    marginHorizontal: spacing.md,
    marginBottom: 8,
  },
  listContainer: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  loadingText: {
    marginTop: spacing.md,
  },
  emptyTitle: {
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  addButton: {
    marginTop: spacing.md,
  },
  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
});
