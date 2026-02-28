import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text } from '../../../components/atoms/Text';
import { Card } from '../../../components/atoms/Card';
import { Icon } from '../../../components/atoms/Icon';
import { palette } from '../../../theme/colors';
import { useTheme } from "../../../theme";

interface Sighting {
  id: string;
  date: string;
  location: {
    lat: number;
    lng: number;
    address?: string;
  };
}

interface SightingsListProps {
  sightings: Sighting[];
}

export const SightingsList: React.FC<SightingsListProps> = ({ sightings }) => {
  const theme = useTheme();
  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return 'Unbekannt';
      const date = new Date(dateString);
      return date.toLocaleDateString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      return dateString || 'Unbekannt';
    }
  };

  const renderSighting = ({ item }: { item: Sighting }) => (
    <View style={styles.sightingItem}>
      <View style={styles.timeline}>
        <View style={styles.dot} />
        <View style={styles.line} />
      </View>
      
      <Card style={[styles.content, { backgroundColor: "white" }]}>
        <View style={styles.header}>
          <Text variant="caption" style={styles.date}>
            {formatDate(item.date)}
          </Text>
        </View>
        
        <View style={styles.locationContainer}>
          <Icon name="map-marker" size={16} color={theme.colors.onSurfaceVariant} />
          <Text variant="caption" style={styles.location} numberOfLines={1}>
            {item.location.address || `${item.location.lat.toFixed(4)}, ${item.location.lng.toFixed(4)}`}
          </Text>
        </View>
      </Card>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text variant="h3" style={styles.title}>
        Letzte Sichtungen
      </Text>
      
      <View style={styles.list}>
        {sightings.map((sighting) => (
          <React.Fragment key={sighting.id}>
            {renderSighting({ item: sighting })}
          </React.Fragment>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  title: {
    marginBottom: 20,
    /* color handled inline */
  },
  list: {
    paddingLeft: 4,
  },
  sightingItem: {
    flexDirection: 'row',
  },
  timeline: {
    width: 24,
    alignItems: 'center',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "blue",
    zIndex: 1,
  },
  line: {
    flex: 1,
    width: 2,
    backgroundColor: "#E0E0E0",
    marginVertical: -2,
  },
  content: {
    flex: 1,
    marginHorizontal: 12,
    marginBottom: 20,
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  date: {
    /* color handled inline */
    fontWeight: '600',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    /* color handled inline */
    marginLeft: 4,
  },
});
