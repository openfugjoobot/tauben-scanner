import { useState, useEffect, useCallback } from 'react';
import * as MediaLibrary from 'expo-media-library';

export type MediaLibraryPermissionStatus = 'granted' | 'denied' | 'undetermined';

interface UseMediaLibraryPermissionReturn {
  status: MediaLibraryPermissionStatus;
  isGranted: boolean;
  isDenied: boolean;
  isLoading: boolean;
  requestPermission: () => Promise<boolean>;
  checkPermission: () => Promise<void>;
}

export const useMediaLibraryPermission = (): UseMediaLibraryPermissionReturn => {
  const [status, setStatus] = useState<MediaLibraryPermissionStatus>('undetermined');
  const [isLoading, setIsLoading] = useState(true);

  const checkPermission = useCallback(async () => {
    try {
      const { status: mediaStatus } = await MediaLibrary.getPermissionsAsync();
      setStatus(mediaStatus as MediaLibraryPermissionStatus);
    } catch (error) {
      setStatus('denied');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      const { status: mediaStatus } = await MediaLibrary.requestPermissionsAsync();
      setStatus(mediaStatus as MediaLibraryPermissionStatus);
      return mediaStatus === 'granted';
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
