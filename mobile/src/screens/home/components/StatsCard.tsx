import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Card } from '../../../components/atoms/Card';
import { Text } from '../../../components/atoms/Text';
import { Icon, IconName } from '../../../components/atoms/Icon';
import { useTheme } from '../../../theme';
import { spacing } from '../../../theme/spacing';

interface StatsCardProps {
  totalPigeons: number;
  totalSightings: number;
  recentScans: number;
  isLoading?: boolean;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  totalPigeons,
  totalSightings,
  recentScans,
  isLoading = false,
}) => {
  const theme = useTheme();

  if (isLoading) {
    return (
      <Card padding="large" style={styles.card}>
        <Text variant="h3" style={styles.title}>
          Übersicht
        </Text>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text variant="caption" style={{ marginTop: spacing.sm }}>Lade Daten...</Text>
        </View>
      </Card>
    );
  }

  const stats: { icon: IconName; value: number; label: string }[] = [
    { icon: 'bird', value: totalPigeons, label: 'Tauben' },
    { icon: 'eye', value: totalSightings, label: 'Sichtungen' },
    { icon: 'camera', value: recentScans, label: 'Scans' },
  ];

  return (
    <Card padding="large" style={styles.card}>
      <Text variant="h3" style={styles.title}>
        Übersicht
      </Text>
      
      <View style={styles.statsRow}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.statItem}>
            <Icon name={stat.icon} size={24} color={theme.colors.primary} />
            <Text variant="h2" style={styles.statValue}>
              {stat.value}
            </Text>
            <Text variant="caption" color={theme.colors.onSurfaceVariant}>
              {stat.label}
            </Text>
          </View>
        ))}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
  },
  title: {
    marginBottom: spacing.md,
  },
  loadingContainer: {
    paddingVertical: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    marginTop: spacing.xs,
    marginBottom: 2,
  },
});
