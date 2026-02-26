import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card } from '../../../components/atoms/Card';
import { Text } from '../../../components/atoms/Text';
import { Skeleton } from '../../../components/atoms/Skeleton';
import { Icon } from '../../../components/atoms/Icon';
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
        <Skeleton width="60%" height={24} />
        <View style={styles.statsRow}>
          <Skeleton width={80} height={60} />
          <Skeleton width={80} height={60} />
          <Skeleton width={80} height={60} />
        </View>
      </Card>
    );
  }

  const stats = [
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
