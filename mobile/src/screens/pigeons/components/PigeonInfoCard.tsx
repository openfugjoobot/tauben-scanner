import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card } from '../../../components/atoms/Card';
import { Text } from '../../../components/atoms/Text';
import { Icon } from '../../../components/atoms/Icon';
import { palette } from '../../../theme/colors';
import { Pigeon } from '../../../services/api/apiClient.types';
import { useTheme } from "../../../theme";

interface PigeonInfoCardProps {
  pigeon: Pigeon;
}

export const PigeonInfoCard: React.FC<PigeonInfoCardProps> = ({ pigeon }) => {
  const theme = useTheme();
  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return 'Unbekannt';
      const date = new Date(dateString);
      return date.toLocaleDateString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch (error) {
      return dateString || 'Unbekannt';
    }
  };

  return (
    <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
      <Text variant="h3" style={styles.title}>
        Details
      </Text>

      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Icon name="tag" size={20} color={theme.colors.onSurfaceVariant} />
          <View style={styles.infoText}>
            <Text variant="caption" style={styles.label}>
              Ringnummer
            </Text>
            <Text variant="body">
              {pigeon.ringNumber || 'Keine'}
            </Text>
          </View>
        </View>

        <View style={styles.infoItem}>
          <Icon name="calendar" size={20} color={theme.colors.onSurfaceVariant} />
          <View style={styles.infoText}>
            <Text variant="caption" style={styles.label}>
              Zuerst gesehen
            </Text>
            <Text variant="body">
              {formatDate(pigeon.firstSeen)}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Icon name="eye" size={20} color={theme.colors.onSurfaceVariant} />
          <View style={styles.infoText}>
            <Text variant="caption" style={styles.label}>
              Sichtungen
            </Text>
            <Text variant="body">
              {pigeon.sightingsCount}
            </Text>
          </View>
        </View>

        <View style={styles.infoItem}>
          <Icon name="clock" size={20} color={theme.colors.onSurfaceVariant} />
          <View style={styles.infoText}>
            <Text variant="caption" style={styles.label}>
              Zuletzt aktualisiert
            </Text>
            <Text variant="body">
              {formatDate(pigeon.updatedAt)}
            </Text>
          </View>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  title: {
    marginBottom: 16,
    /* color handled inline */
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  infoItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    marginLeft: 12,
  },
  label: {
    /* color handled inline */
    textTransform: 'uppercase',
  },
});
