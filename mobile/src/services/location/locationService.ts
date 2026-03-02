import * as Location from 'expo-location';

export interface LocationWithMunicipality {
  lat: number;
  lng: number;
  municipality: string | null;
}

interface NominatimResponse {
  address?: {
    city?: string;
    town?: string;
    village?: string;
    municipality?: string;
    county?: string;
    state?: string;
    country?: string;
  };
  display_name?: string;
  error?: string;
}

/**
 * Request location permissions from the user
 */
export const requestLocationPermission = async (): Promise<boolean> => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  return status === Location.PermissionStatus.GRANTED;
};

/**
 * Check if location permission is granted
 */
export const checkLocationPermission = async (): Promise<boolean> => {
  const { status } = await Location.getForegroundPermissionsAsync();
  return status === Location.PermissionStatus.GRANTED;
};

/**
 * Get current GPS position
 */
export const getCurrentPosition = async (): Promise<Location.LocationObject | null> => {
  try {
    const position = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    return position;
  } catch (error) {
    console.error('[LocationService] Failed to get current position:', error);
    return null;
  }
};

/**
 * Reverse geocode coordinates to get municipality using Nominatim API
 */
export const reverseGeocode = async (
  lat: number,
  lng: number
): Promise<string | null> => {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=de`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'TaubenScanner/1.0',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data: NominatimResponse = await response.json();

    if (data.error) {
      console.error('[LocationService] Nominatim error:', data.error);
      return null;
    }

    // Try to get municipality from different address fields
    const address = data.address;
    if (address) {
      // Priority: municipality > city > town > village > county
      return (
        address.municipality ||
        address.city ||
        address.town ||
        address.village ||
        address.county ||
        null
      );
    }

    return null;
  } catch (error) {
    console.error('[LocationService] Reverse geocoding failed:', error);
    return null;
  }
};

export type LocationError = 'PERMISSION_DENIED' | 'GPS_UNAVAILABLE' | 'NETWORK_ERROR' | 'UNKNOWN';

export interface LocationResult {
  success: boolean;
  data?: LocationWithMunicipality;
  error?: LocationError;
  errorMessage?: string;
}

/**
 * Get current location with municipality (combined function)
 */
export const getLocationWithMunicipality = async (): Promise<LocationResult> => {
  try {
    // Check permission
    const hasPermission = await checkLocationPermission();
    if (!hasPermission) {
      const granted = await requestLocationPermission();
      if (!granted) {
        return {
          success: false,
          error: 'PERMISSION_DENIED',
          errorMessage: 'Standortberechtigung wurde verweigert. Bitte erlauben Sie den Zugriff in den Einstellungen.',
        };
      }
    }

    // Get GPS position
    const position = await getCurrentPosition();
    if (!position) {
      return {
        success: false,
        error: 'GPS_UNAVAILABLE',
        errorMessage: 'Konnte aktuellen Standort nicht ermitteln. Bitte prüfen Sie Ihre GPS-Einstellungen.',
      };
    }

    const { latitude, longitude } = position.coords;

    // Get municipality
    const municipality = await reverseGeocode(latitude, longitude);

    return {
      success: true,
      data: {
        lat: latitude,
        lng: longitude,
        municipality,
      },
    };
  } catch (error) {
    console.error('[LocationService] Failed to get location:', error);
    return {
      success: false,
      error: 'UNKNOWN',
      errorMessage: 'Ein unbekannter Fehler ist aufgetreten.',
    };
  }
};
