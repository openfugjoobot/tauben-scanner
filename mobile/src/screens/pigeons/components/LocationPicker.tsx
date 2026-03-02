import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from '../../../components/atoms/Text';
import { Icon } from '../../../components/atoms/Icon';
import { Button } from '../../../components/atoms/Button';
import { useTheme } from '../../../theme';
import { getLocationWithMunicipality } from '../../../services/location/locationService';

interface LocationPickerProps {
  location: { lat: number; lng: number; municipality?: string } | null;
  municipality?: string | null;
  onLocationSelected: (lat: number, lng: number, municipality?: string) => void;
  onLocationCleared?: () => void;
  error?: string;
}

export const LocationPicker: React.FC<LocationPickerProps> = ({
  location,
  municipality,
  onLocationSelected,
  onLocationCleared,
  error,
}) => {
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const handleDetectLocation = async () => {
    setIsLoading(true);
    setLocationError(null);

    const result = await getLocationWithMunicipality();

    setIsLoading(false);

    if (result.success && result.data) {
      onLocationSelected(result.data.lat, result.data.lng, result.data.municipality || undefined);
    } else {
      setLocationError(result.errorMessage || 'Standort konnte nicht ermittelt werden');
    }
  };

  const handleClear = () => {
    if (onLocationCleared) {
      onLocationCleared();
    }
    setLocationError(null);
  };

  const displayError = error || locationError;

  return (
    <View style={styles.container}>
      <Text variant="caption" style={{ marginBottom: 4, color: theme.colors.onSurfaceVariant }}>
        Standort
      </Text>

      {!location ? (
        // No location selected - show detect button
        <Button
          variant="outline"
          size="large"
          onPress={handleDetectLocation}
          disabled={isLoading}
          loading={isLoading}
          icon="map-marker-radius"
        >
          Standort ermitteln
        </Button>
      ) : (
        // Location selected - show details with clear button
        <View
          style={[
            styles.locationCard,
            {
              borderColor: displayError ? theme.colors.error : theme.colors.outline,
              backgroundColor: theme.colors.surfaceVariant,
            },
          ]}
        >
          <View style={styles.locationContent}>
            <Icon
              name="map-marker"
              size={24}
              color={theme.colors.primary}
              style={styles.locationIcon}
            />
            <View style={styles.locationTextContainer}>
              {location.municipality && (
                <Text variant="body" style={{ fontWeight: '600' }}>
                  Gemeinde: {location.municipality}
                </Text>
              )}
              <Text variant="caption" style={{ color: theme.colors.onSurfaceVariant }}>
                {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleClear}
              style={styles.clearButton}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Icon name="close-circle" size={24} color={theme.colors.error} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {displayError && (
        <View style={styles.errorContainer}>
          <Icon name="alert-circle" size={16} color={theme.colors.error} />
          <Text variant="caption" style={{ marginLeft: 4, color: theme.colors.error, flex: 1 }}>
            {displayError}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  locationCard: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 16,
  },
  locationContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIcon: {
    marginRight: 12,
  },
  locationTextContainer: {
    flex: 1,
  },
  clearButton: {
    marginLeft: 8,
    padding: 4,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
});
