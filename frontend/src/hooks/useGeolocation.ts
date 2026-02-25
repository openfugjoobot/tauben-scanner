import { useState, useCallback, useEffect, useRef } from 'react';

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  altitude: number | null;
  heading: number | null;
  speed: number | null;
  timestamp: number | null;
  locationName: string | null;
}

interface GeolocationError {
  code: number;
  message: string;
}

interface UseGeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
  watch?: boolean;
  onLocationChange?: (location: GeolocationState) => void;
  onError?: (error: GeolocationError) => void;
}

interface UseGeolocationReturn {
  location: GeolocationState;
  error: GeolocationError | null;
  isLoading: boolean;
  isSupported: boolean;
  permission: 'granted' | 'denied' | 'prompt' | 'unknown';
  
  // Actions
  getCurrentPosition: () => Promise<void>;
  startWatching: () => void;
  stopWatching: () => void;
  requestPermission: () => Promise<'granted' | 'denied' | 'prompt'>;
  reverseGeocode: (lat: number, lng: number) => Promise<string | null>;
}

const initialState: GeolocationState = {
  latitude: null,
  longitude: null,
  accuracy: null,
  altitude: null,
  heading: null,
  speed: null,
  timestamp: null,
  locationName: null,
};

/**
 * Hook for managing device geolocation
 */
export function useGeolocation(options: UseGeolocationOptions = {}): UseGeolocationReturn {
  const {
    enableHighAccuracy = true,
    timeout = 10000,
    maximumAge = 0,
    watch = false,
    onLocationChange,
    onError,
  } = options;

  const [location, setLocation] = useState<GeolocationState>(initialState);
  const [error, setError] = useState<GeolocationError | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [permission, setPermission] = useState<'granted' | 'denied' | 'prompt' | 'unknown'>('unknown');
  const watchIdRef = useRef<number | null>(null);

  const isSupported = typeof navigator !== 'undefined' && 'geolocation' in navigator;

  // Check permission status on mount
  useEffect(() => {
    if (!isSupported) return;

    const checkPermission = async () => {
      try {
        if ('permissions' in navigator) {
          const result = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
          setPermission(result.state as 'granted' | 'denied' | 'prompt');
          
          result.addEventListener('change', () => {
            setPermission(result.state as 'granted' | 'denied' | 'prompt');
          });
        }
      } catch {
        // Permissions API not supported or failed
        setPermission('unknown');
      }
    };

    checkPermission();
  }, [isSupported]);

  const handleSuccess = useCallback((position: GeolocationPosition) => {
    const newLocation: GeolocationState = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
      altitude: position.coords.altitude,
      heading: position.coords.heading,
      speed: position.coords.speed,
      timestamp: position.timestamp,
      locationName: null,
    };
    
    setLocation(newLocation);
    setIsLoading(false);
    setError(null);
    onLocationChange?.(newLocation);
  }, [onLocationChange]);

  const handleError = useCallback((error: GeolocationPositionError) => {
    const geolocationError: GeolocationError = {
      code: error.code,
      message: getErrorMessage(error.code),
    };
    
    setError(geolocationError);
    setIsLoading(false);
    onError?.(geolocationError);
  }, [onError]);

  const getCurrentPosition = useCallback(async (): Promise<void> => {
    if (!isSupported) {
      setError({ code: 0, message: 'Geolocation wird von diesem Gerät nicht unterstützt' });
      return;
    }

    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      handleSuccess,
      handleError,
      {
        enableHighAccuracy,
        timeout,
        maximumAge,
      }
    );
  }, [isSupported, enableHighAccuracy, timeout, maximumAge, handleSuccess, handleError]);

  const startWatching = useCallback(() => {
    if (!isSupported || watchIdRef.current !== null) return;

    watchIdRef.current = navigator.geolocation.watchPosition(
      handleSuccess,
      handleError,
      {
        enableHighAccuracy,
        timeout,
        maximumAge,
      }
    );
  }, [isSupported, enableHighAccuracy, timeout, maximumAge, handleSuccess, handleError]);

  const stopWatching = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  }, []);

  const requestPermission = useCallback(async (): Promise<'granted' | 'denied' | 'prompt'> => {
    if (!isSupported) {
      return 'denied';
    }

    try {
      await getCurrentPosition();
      return 'granted';
    } catch {
      return permission === 'denied' ? 'denied' : 'prompt';
    }
  }, [isSupported, getCurrentPosition, permission]);

  const reverseGeocode = useCallback(async (lat: number, lng: number): Promise<string | null> => {
    try {
      // Using OpenStreetMap Nominatim for reverse geocoding (free, no API key needed)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'TaubenScanner/1.0'
          }
        }
      );
      
      if (!response.ok) {
        return null;
      }
      
      const data = await response.json();
      
      // Build location name from address components
      const address = data.address;
      const parts = [];
      
      if (address.road) parts.push(address.road);
      if (address.house_number) parts.push(address.house_number);
      if (address.suburb || address.village) parts.push(address.suburb || address.village);
      if (address.city || address.town) parts.push(address.city || address.town);
      
      const locationName = parts.length > 0 ? parts.join(', ') : data.display_name?.split(',').slice(0, 2).join(', ') || null;
      
      setLocation(prev => ({ ...prev, locationName }));
      return locationName;
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
      return null;
    }
  }, []);

  // Auto-start watching if enabled
  useEffect(() => {
    if (watch) {
      startWatching();
    }
    return () => {
      stopWatching();
    };
  }, [watch, startWatching, stopWatching]);

  return {
    location,
    error,
    isLoading,
    isSupported,
    permission,
    getCurrentPosition,
    startWatching,
    stopWatching,
    requestPermission,
    reverseGeocode,
  };
}

function getErrorMessage(code: number): string {
  switch (code) {
    case 1:
      return 'Standortzugriff wurde verweigert. Bitte erlaube den Zugriff in den Einstellungen.';
    case 2:
      return 'Standort konnte nicht ermittelt werden. Bitte versuche es später erneut.';
    case 3:
      return 'Zeitüberschreitung bei der Standortermittlung. Bitte versuche es erneut.';
    default:
      return 'Ein unbekannter Fehler ist aufgetreten.';
  }
}
