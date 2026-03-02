import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Surface, Divider } from 'react-native-paper';
import { Text } from '../../../components/atoms/Text';
import { Icon } from '../../../components/atoms/Icon';
import { ListTile } from '../../../components/molecules/ListTile';
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
        <Surface style={[styles.emptyContainer, { elevation: 0 }]} >
          <View style={styles.illustration}>
            <Icon name="camera-outline" size={64} color={theme.colors.onSurfaceVariant} />
          </View>
          <Text variant="h3" style={[styles.emptyTitle, { color: theme.colors.onSurfaceVariant }]}>
            Noch keine Scans
          </Text>
          <Text variant="body" style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center' }}>
            Scannen Sie Ihre erste Taube, um sie hier zu sehen.
          </Text>
        </Surface>
      </View>
    );
  }

  const getScanIcon = (status: string | undefined) => {
    if (status === 'success') return 'check-circle' as const;
    if (status === 'error') return 'alert-circle' as const;
    return 'camera' as const;
  };

  const getScanTitle = (status: string | undefined) => {
    if (status === 'success') return 'Taube erkannt';
    if (status === 'error') return 'Fehler beim Scannen';
    return 'Scan durchgeführt';
  };

  const getScanColor = (status: string | undefined) => {
    if (status === 'success') return theme.colors.success;
    if (status === 'error') return theme.colors.error;
    return theme.colors.primary;
  };

  const formatDate = (timestamp: string | number) => {
    const date = new Date(timestamp);
    return date.toLocaleString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <View style={styles.container}>
      <Text variant="h3" style={styles.title}>
        Letzte Scans
      </Text>

      {scans.map((scan, index) => (
        <React.Fragment key={scan.id}>
          <ListTile
            leading={
              <View style={[styles.iconContainer, { backgroundColor: theme.colors.surfaceVariant }]} >
                <Icon
                  name={getScanIcon(scan.status)}
                  size={24}
                  color={getScanColor(scan.status)}
                />
              </View>
            }
            title={getScanTitle(scan.status)}
            subtitle={formatDate(scan.timestamp)}
            trailing={
              scan.confidence !== undefined ? (
                <Text
                  variant="caption"
                  style={{
                    color: scan.confidence > 0.8 
                      ? theme.colors.success 
                      : theme.colors.warning,
                    fontWeight: '600',
                  }}
                >
                  {Math.round(scan.confidence * 100)}%
                </Text>
              ) : undefined
            }
            onPress={() => { /* Navigation to scan detail could go here */ }}
          />
          {index < scans.length - 1 && <Divider style={styles.divider} />}
        </React.Fragment>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.md,
  },
  title: {
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    marginHorizontal: spacing.md,
    marginVertical: spacing.xs,
  },
  emptyContainer: {
    padding: spacing.xl,
    alignItems: 'center',
    borderRadius: 12,
    marginTop: spacing.sm,
  },
  illustration: {
    marginBottom: spacing.md,
    opacity: 0.5,
  },
  emptyTitle: {
    marginBottom: spacing.sm,
  },
});
