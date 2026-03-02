import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Surface } from 'react-native-paper';
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
      <Surface style={[styles.surface, { elevation: 1 }]}>
        <Text variant="h3" style={styles.title}>
          Übersicht
        </Text>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text variant="caption" style={{ marginTop: spacing.sm, color: theme.colors.onSurfaceVariant }}>
            Lade Daten...
          </Text>
        </View>
      </Surface>
    );
  }

  const stats: { icon: IconName; value: number; label: string }[] = [
    { icon: 'bird', value: totalPigeons, label: 'Tauben' },
    { icon: 'eye', value: totalSightings, label: 'Sichtungen' },
    { icon: 'camera', value: recentScans, label: 'Scans' },
  ];

  return (
    <Surface style={[styles.surface, { elevation: 1 }]}>
      <Text variant="h3" style={styles.title}>
        Übersicht
      </Text>
      
      <View style={styles.statsRow}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.statItem}>
            <View style={[styles.iconContainer, { backgroundColor: theme.colors.primaryContainer }]}>
              <Icon name={stat.icon} size={24} color={theme.colors.primary} />
            </View>
            <Text variant="h2" style={[styles.statValue, { color: theme.colors.primary }]}>
              {stat.value}
            </Text>
            <Text variant="caption" style={{ color: theme.colors.onSurfaceVariant }}>
              {stat.label}
            </Text>
          </View>
        ))}
      </View>
    </Surface>
  );
};

const styles = StyleSheet.create({
  surface: {
    marginBottom: spacing.md,
    padding: spacing.lg,
    borderRadius: 12,
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
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  statValue: {
    marginBottom: 2,
  },
});
