import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Card } from '../../../components/atoms/Card';
import { Text } from '../../../components/atoms/Text';
import { Icon } from '../../../components/atoms/Icon';
import { EmptyState } from '../../../components/molecules/EmptyState';
import { useTheme } from '../../../theme';
import { spacing } from '../../../theme/spacing';
import type { ScanResult } from '../../../stores/scans/scanStore.types';

interface RecentScansListProps {
  scans: (ScanResult & { status?: 'success' | 'error' | 'pending' })[];
}

export const RecentScansList: React.FC<RecentScansListProps> = ({ scans }) => {
  const theme = useTheme();

  if (scans.length === 0) {
    return (
      <View style={styles.container}>
        <Text variant="h3" style={styles.title}>
          Letzte Scans
        </Text>
        <EmptyState
          icon="camera-outline"
          title="Noch keine Scans"
          message="Scannen Sie Ihre erste Taube, um sie hier zu sehen."
        />
      </View>
    );
  }

  const renderScanItem = ({ item }: { item: ScanResult & { status?: 'success' | 'error' | 'pending' } }) => {
    const date = new Date(item.timestamp);
    const isSuccess = item.status === 'success' || (item.pigeonId !== undefined && item.pigeonId !== null);
    const isError = item.status === 'error';

    return (
      <Card padding="medium" style={styles.scanCard}>
        <View style={styles.scanRow}>
          <Icon
            name={isSuccess ? 'check-circle' : isError ? 'alert-circle' : 'camera'}
            size={24}
            color={isSuccess ? (theme.colors.success as string) : isError ? (theme.colors.error as string) : theme.colors.primary}
          />
          
          <View style={styles.scanInfo}>
            <Text variant="body" numberOfLines={1}>
              {isSuccess ? 'Taube erkannt' : isError ? 'Fehler beim Scannen' : 'Scan durchgeführt'}
            </Text>
            <Text variant="caption" color={theme.colors.onSurfaceVariant}>
              {date.toLocaleString('de-DE', {
                day: '2-digit',
                month: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </View>
          
          {item.confidence !== undefined && (
            <Text
              variant="caption"
              style={{
                color: item.confidence > 0.8 ? (theme.colors.success as string) : (theme.colors.warning as string),
              }}
            >
              {Math.round(item.confidence * 100)}%
            </Text>
          )}
        </View>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <Text variant="h3" style={styles.title}>
        Letzte Scans
      </Text>
      
      <FlatList
        data={scans}
        renderItem={renderScanItem}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  title: {
    marginBottom: 12,
  },
  scanCard: {
    marginHorizontal: 0,
  },
  scanRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scanInfo: {
    flex: 1,
    marginLeft: 12,
  },
});
