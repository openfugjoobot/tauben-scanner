import { useState, useEffect, useCallback } from 'react';
import * as Location from 'expo-location';

export type LocationPermissionStatus = 'granted' | 'denied' | 'undetermined';

interface UseLocationPermissionReturn {
  status: LocationPermissionStatus;
  isGranted: boolean;
  isDenied: boolean;
  isLoading: boolean;
  requestPermission: () => Promise<boolean>;
  checkPermission: () => Promise<void>;
}

export const useLocationPermission = (): UseLocationPermissionReturn => {
  const [status, setStatus] = useState<LocationPermissionStatus>('undetermined');
  const [isLoading, setIsLoading] = useState(true);

  const checkPermission = useCallback(async () => {
    try {
      const { status: locationStatus } = await Location.getForegroundPermissionsAsync();
      setStatus(locationStatus as LocationPermissionStatus);
    } catch (error) {
      setStatus('denied');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
      setStatus(locationStatus as LocationPermissionStatus);
      return locationStatus === 'granted';
    } catch (error) {
      setStatus('denied');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkPermission();
  }, [checkPermission]);

  return {
    status,
    isGranted: status === 'granted',
    isDenied: status === 'denied',
    isLoading,
    requestPermission,
    checkPermission,
  };
};
