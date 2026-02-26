import { useState, useEffect, useCallback } from 'react';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';

export type CameraPermissionStatus = 'granted' | 'denied' | 'undetermined';

interface UseCameraPermissionReturn {
  status: CameraPermissionStatus;
  isGranted: boolean;
  isDenied: boolean;
  isLoading: boolean;
  requestPermission: () => Promise<boolean>;
  checkPermission: () => Promise<void>;
}

export const useCameraPermission = (): UseCameraPermissionReturn => {
  const [status, setStatus] = useState<CameraPermissionStatus>('undetermined');
  const [isLoading, setIsLoading] = useState(true);

  const checkPermission = useCallback(async () => {
    try {
      const { status: cameraStatus } = await Camera.getCameraPermissionsAsync();
      setStatus(cameraStatus as CameraPermissionStatus);
    } catch (error) {
      console.error('Error checking camera permission:', error);
      setStatus('denied');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
      
      // Also request media library permission for saving photos
      const { status: mediaStatus } = await MediaLibrary.requestPermissionsAsync();
      
      setStatus(cameraStatus as CameraPermissionStatus);
      return cameraStatus === 'granted';
    } catch (error) {
      console.error('Error requesting camera permission:', error);
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
