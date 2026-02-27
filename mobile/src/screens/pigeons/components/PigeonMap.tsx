import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Text } from '../../../components/atoms/Text';
import { palette } from '../../../theme/colors';

interface Location {
  lat: number;
  lng: number;
}

interface Sighting {
  id: string;
  location: Location;
}

interface PigeonMapProps {
  sightings: Sighting[];
}

export const PigeonMap: React.FC<PigeonMapProps> = ({ sightings }) => {
  if (sightings.length === 0) return null;

  const firstLocation = sightings[0].location;

  return (
    <View style={styles.container}>
      <Text variant="h3" style={styles.title}>
        Sichtungsorte
      </Text>
      <View style={styles.mapContainer}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={{
            latitude: firstLocation.lat,
            longitude: firstLocation.lng,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          scrollEnabled={false}
          zoomEnabled={false}
          rotateEnabled={false}
          pitchEnabled={false}
        >
          {sightings.map((sighting) => (
            <Marker
              key={sighting.id}
              coordinate={{
                latitude: sighting.location.lat,
                longitude: sighting.location.lng,
              }}
              pinColor={palette.primary}
            />
          ))}
        </MapView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 8,
    marginBottom: 20,
  },
  title: {
    marginBottom: 16,
    color: palette.gray[900],
  },
  mapContainer: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: palette.gray[200],
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
