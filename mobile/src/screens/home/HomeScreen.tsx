import React from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useTabNavigation } from '../../.../navigation/hooks';
import { Text } from '../../components/atoms/Text';
import { OfflineBanner } from '../../components/molecules/OfflineBanner';
import { StatsCard } from './components/StatsCard';
import { RecentScansList } from './components/RecentScansList';
import { QuickActions } from './components/QuickActions';
import { usePigeons } from '../../hooks/queries';
import { useScanStore } from '../../stores/scans';
import { useIsOnline } from '../../stores/app';
import { useTheme } from '../../theme';
import { usePermissions } from '../../hooks';

export const HomeScreen: React.FC = () => {
  const navigation = useTabNavigation();
  const theme = useTheme();
  usePermissions(); // Request permissions on app start
  
  const { data: pigeonsData, isLoading: pigeonsLoading, refetch: refetchPigeons } = usePigeons({ limit: 1 });
  const { scanHistory } = useScanStore();
  
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refetchPigeons();
    setRefreshing(false);
  }, [refetchPigeons]);

  const stats = {
    totalPigeons: pigeonsData?.pagination.total || 0,
    totalSightings: pigeonsData?.pigeons.reduce((sum, p) => sum + p.sightingsCount, 0) || 0,
    recentScans: scanHistory.length,
  };

  const handleScanPress = () => {
    navigation.navigate('ScanFlow', { screen: 'Scan' });
  };

  const handleAddPigeonPress = () => {
    navigation.navigate('PigeonsFlow', { screen: 'NewPigeon' });
  };

  return (
    <View style={styles.container}>
      <OfflineBanner />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
      >
        <Text variant="h1" style={styles.title}>
          Start
        </Text>
        
        <StatsCard
          totalPigeons={stats.totalPigeons}
          totalSightings={stats.totalSightings}
          recentScans={stats.recentScans}
          isLoading={pigeonsLoading}
        />
        
        <QuickActions
          onScanPress={handleScanPress}
          onAddPigeonPress={handleAddPigeonPress}
        />
        
        <RecentScansList scans={scanHistory.slice(0, 5)} />
        
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  title: {
    marginBottom: 16,
  },
});
