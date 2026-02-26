import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from '../../../components/atoms/Text';
import { Icon } from '../../../components/atoms/Icon';
import { useTheme } from '../../../theme';

interface LocationPickerProps {
  location: { lat: number; lng: number } | null;
  onLocationSelected: (lat: number, lng: number) => void;
  error?: string;
}

export const LocationPicker: React.FC<LocationPickerProps> = ({
  location,
  onLocationSelected,
  error,
}) => {
  const theme = useTheme();

  const handlePress = () => {
    // In a real app, this would open a map picker
    onLocationSelected(52.5200, 13.4050); // Mocking Berlin coords
  };

  return (
    <View style={styles.container}>
      <Text variant="caption" style={{ marginBottom: 4, color: theme.colors.onSurfaceVariant }}>
        Standort
      </Text>
      
      <TouchableOpacity
        onPress={handlePress}
        style={[
          styles.picker,
          {
            borderColor: error ? theme.colors.error : theme.colors.outline,
            backgroundColor: theme.colors.surfaceVariant,
          },
        ]}
      >
        <View style={styles.content}>
          <Icon
            name="map-marker-radius"
            size={24}
            color={location ? theme.colors.primary : theme.colors.onSurfaceVariant}
          />
          <View style={styles.textContainer}>
            {location ? (
              <Text variant="body">
                {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
              </Text>
            ) : (
              <Text variant="body" style={{ color: theme.colors.onSurfaceVariant }}>
                Standort wählen
              </Text>
            )}
          </View>
          <Icon name="chevron-right" size={20} color={theme.colors.onSurfaceVariant} />
        </View>
      </TouchableOpacity>
      
      {error && (
        <Text variant="caption" style={{ marginTop: 4, color: theme.colors.error }}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  picker: {
    height: 56,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
  },
});
