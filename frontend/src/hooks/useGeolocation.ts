import { useState, useEffect, useCallback } from 'react';

interface Location {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

interface GeolocationState {
  location: Location | null;
  error: string | null;
  isLoading: boolean;
}

export const useGeolocation = () => {
  const [state, setState] = useState<GeolocationState>({
    location: null,
    error: null,
    isLoading: false,
  });

  const getCurrentPosition = useCallback(() => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    if (!('geolocation' in navigator)) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: 'Geolocation wird nicht unterstützt',
      }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          location: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp,
          },
          error: null,
          isLoading: false,
        });
      },
      (error) => {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: error.message,
        }));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, []);

  return {
    ...state,
    getCurrentPosition,
  };
};
