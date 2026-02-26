import React, { useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  RefreshControl,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StatCard, QuickActionButton, RecentSightings, OfflineIndicator } from '../../components/home';
import { usePigeons, useSightings } from '../../hooks';
import { useIsOnline } from '../../stores';
import type { RootTabNavigationProp } from '../../types/navigation';

// Sync-Status Typen
type SyncStatus = 'synced' | 'syncing' | 'pending' | 'error';

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<RootTabNavigationProp>();
  const isOnline = useIsOnline();

  // React Query Hooks für Daten
  const {
    data: pigeons = [],
    isLoading: isLoadingPigeons,
    refetch: refetchPigeons,
  } = usePigeons();

  const {
    data: sightings = [],
    isLoading: isLoadingSightings,
    refetch: refetchSightings,
  } = useSightings();

  // Pull-to-Refresh State
  const [refreshing, setRefreshing] = React.useState(false);

  // Pull-to-Refresh Handler
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([refetchPigeons(), refetchSightings()]);
    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  }, [refetchPigeons, refetchSightings]);

  // Statistiken berechnen
  const stats = useMemo(() => {
    const pigeonCount = pigeons.length;
    const scanCount = sightings.length;

    // Sichtungen heute berechnen
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const sightingsToday = sightings.filter((s) => {
      const sightingDate = new Date(s.spottedAt);
      return sightingDate >= today;
    }).length;

    // Letzte Aktivität berechnen
    let lastActivity = 'Keine Scans';
    if (sightings.length > 0) {
      const latestSighting = [...sightings].sort(
        (a, b) => new Date(b.spottedAt).getTime() - new Date(a.spottedAt).getTime()
      )[0];
      const lastSightingDate = new Date(latestSighting.spottedAt);
      const now = new Date();
      const diffInHours = Math.floor(
        (now.getTime() - lastSightingDate.getTime()) / (1000 * 60 * 60)
      );
      const diffInDays = Math.floor(diffInHours / 24);

      if (diffInHours < 1) {
        lastActivity = 'Gerade eben';
      } else if (diffInHours < 24) {
        lastActivity = `${diffInHours} Std.`;
      } else {
        lastActivity = `${diffInDays} Tg.`;
      }
    }

    return {
      pigeonCount,
      scanCount,
      sightingsToday,
      lastActivity,
    };
  }, [pigeons, sightings]);

  // Sync-Status bestimmen
  const syncStatus: SyncStatus = useMemo(() => {
    if (!isOnline) return 'pending';
    if (isLoadingPigeons || isLoadingSightings) return 'syncing';
    return 'synced';
  }, [isOnline, isLoadingPigeons, isLoadingSightings]);

  const syncStatusConfig = {
    synced: { icon: 'cloud-check' as const, text: 'Synchronisiert', color: '#27AE60' },
    syncing: { icon: 'cloud-sync' as const, text: 'Synchronisiere...', color: '#F39C12' },
    pending: { icon: 'cloud-off' as const, text: 'Offline (Wartet)', color: '#E74C3C' },
    error: { icon: 'cloud-alert' as const, text: 'Sync-Fehler', color: '#E74C3C' },
  };

  const syncConfig = syncStatusConfig[syncStatus];

  // Navigation Handler
  const handleNavigateToScan = () => {
    navigation.navigate('ScanTab' as never);
  };

  const handleNavigateToPigeons = () => {
    navigation.navigate('PigeonsTab' as never);
  };

  const isLoading = isLoadingPigeons || isLoadingSightings;

  return (
    <SafeAreaView style={styles.safeArea}>
      <OfflineIndicator />
      <StatusBar barStyle="dark-content" backgroundColor="#F5F7FA" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#4A90D9']}
            tintColor="#4A90D9"
            title="Aktualisiere..."
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <MaterialCommunityIcons name="home" size={48} color="#4A90D9" />
          <Text style={styles.title}>Willkommen bei Tauben Scanner</Text>
          <Text style={styles.subtitle}>KI-gestützte Taubenerkennung</Text>

          {/* Sync-Status */}
          <View style={styles.syncContainer}>
            <MaterialCommunityIcons
              name={syncConfig.icon}
              size={14}
              color={syncConfig.color}
            />
            <Text style={[styles.syncText, { color: syncConfig.color }]}>
              {syncConfig.text}
            </Text>
          </View>
        </View>

        {/* Statistiken */}
        <View style={styles.statsContainer}>
          <StatCard
            icon="bird"
            value={stats.pigeonCount}
            label="Registrierte Tauben"
            isLoading={isLoading}
          />
          <StatCard
            icon="camera"
            value={stats.sightingsToday}
            label="Sichtungen heute"
            isLoading={isLoading}
          />
          <StatCard
            icon="clock-outline"
            value={stats.lastActivity}
            label="Letzte Aktivität"
            isLoading={isLoading}
          />
        </View>

        {/* Quick Actions */}
        <View style={styles.actionSection}>
          <Text style={styles.sectionTitle}>Schnellzugriff</Text>
          <QuickActionButton
            icon="camera-iris"
            label="Neue Sichtung scannen"
            onPress={handleNavigateToScan}
            variant="primary"
          />
          <QuickActionButton
            icon="format-list-bulleted"
            label="Alle Tauben anzeigen"
            onPress={handleNavigateToPigeons}
            variant="secondary"
          />
        </View>

        {/* Letzte Sichtungen */}
        <RecentSightings
          sightings={sightings}
          pigeons={pigeons}
          maxItems={3}
          isLoading={isLoadingSightings}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  content: {
    paddingBottom: 24,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#7F8C8D',
  },
  syncContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: '#F5F7FA',
    borderRadius: 12,
    gap: 6,
  },
  syncText: {
    fontSize: 12,
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 20,
    gap: 12,
  },
  actionSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 16,
  },
});
