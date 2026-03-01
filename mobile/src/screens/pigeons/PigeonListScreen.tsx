import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Text } from '../../components/atoms/Text';
import { Button } from '../../components/atoms/Button';
import { Input } from '../../components/atoms/Input';
import { Card } from '../../components/atoms/Card';
import { Icon } from '../../components/atoms/Icon';
import { PigeonList } from './components/PigeonList';
import { usePigeons } from '../../hooks/queries';
import { useDebounce } from '../../hooks';
import { useTheme } from '../../theme';
import { spacing } from '../../theme/spacing';

export const PigeonListScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const theme = useTheme();
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const debouncedSearch = useDebounce(searchQuery, 500);
  const effectiveSearch = debouncedSearch;

  const { data, isLoading, isFetching, refetch, isError, error } = usePigeons({
    page,
    limit: 20,
    search: effectiveSearch || undefined,
  });

  // DEBUG: Log data state
  console.log('PigeonList data:', data, 'isLoading:', isLoading, 'isError:', isError, 'error:', error);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    setPage(1);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

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

  // Loading state
  if (isLoading && !refreshing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text variant="body" color={theme.colors.onSurfaceVariant} style={styles.loadingText}>
          Tauben werden geladen...
        </Text>
      </View>
    );
  }

  // ERROR state - NEU!
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

  // Empty state (nur wenn wirklich keine Daten)
  if (!data?.pigeons?.length && !isLoading) {
    return (
      <View style={styles.container}>
        <Card style={styles.searchCard}>
          <Input
            placeholder="Suchen..."
          blurOnSubmit={false}
          returnKeyType="search"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </Card>

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

  // DATA vorhanden
  return (
    <View style={styles.container}>
      <Card style={styles.searchCard}>
        <Input
          placeholder="Suchen..."
          blurOnSubmit={false}
          returnKeyType="search"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </Card>

      <View style={styles.listContainer}>
        <PigeonList
          pigeons={data?.pigeons || []}
          onPigeonPress={handlePigeonPress}
          onEndReached={handleEndReached}
          isLoadingMore={isFetching && !!data?.pigeons?.length}
        />
      </View>

      {/* Floating Add Button */}
      <View style={styles.fabContainer}>
        <Button
          variant="primary"
          onPress={handleAddPigeon}
          icon="plus"
          style={styles.fab}
        >
          Hinzufügen
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchCard: {
    margin: spacing.md,
    marginBottom: 0,
    padding: spacing.md,
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
  fabContainer: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg,
  },
  fab: {
    elevation: 4,
  },
});
