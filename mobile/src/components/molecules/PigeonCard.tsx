import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card } from '../atoms/Card';
import { Text } from '../atoms/Text';
import { Avatar } from '../atoms/Avatar';
import { Badge } from '../atoms/Badge';
import { Icon } from '../atoms/Icon';
import { useTheme } from '../../theme';
import { spacing } from '../../theme/spacing';
import type { Pigeon } from '../../services/api';

interface PigeonCardProps {
  pigeon: Pigeon;
  onPress?: () => void;
  showSightings?: boolean;
  style?: any;
}

export const PigeonCard: React.FC<PigeonCardProps> = ({
  pigeon,
  onPress,
  showSightings = true,
}) => {
  const theme = useTheme();

  return (
    <Card onPress={onPress} padding="medium" style={styles.card}>
      <View style={styles.container}>
        <Avatar
          source={pigeon.photoUrl}
          name={pigeon.name}
          size="medium"
        />
        
        <View style={styles.content}>
          <View style={styles.header}>
            <Text variant="h3" numberOfLines={1} style={styles.name}>
              {pigeon.name}
            </Text>
            {showSightings && pigeon.sightingsCount > 0 && (
              <Badge variant="primary" size="small">
                {pigeon.sightingsCount}
              </Badge>
            )}
          </View>
          
          {pigeon.description && (
            <Text variant="caption" color={theme.colors.onSurfaceVariant} numberOfLines={1}>
              {pigeon.description}
            </Text>
          )}
          
          <View style={styles.footer}>
            <Icon name="calendar" size={14} color={theme.colors.onSurfaceVariant} />
            <Text variant="caption" color={theme.colors.onSurfaceVariant}>
              {pigeon.lastSeen ? new Date(pigeon.lastSeen).toLocaleDateString('de-DE') : new Date(pigeon.firstSeen).toLocaleDateString('de-DE')}
            </Text>
          </View>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.md,
    marginVertical: spacing.sm,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  content: {
    flex: 1,
    marginLeft: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: {
    flex: 1,
    marginRight: spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
    gap: 4,
  },
});
