/**
 * Store Provider - Integration der Zustand Stores
 * T3: State Management
 * 
 * Diese Komponente initialisiert Network-Status-Erkennung
 * und synchronisiert Stores mit der App-Lifecycle
 * Unterstützt sowohl Web als auch React Native (Expo)
 */

import {ReactNode, useEffect, useState} from 'react';
import {Platform} from 'react-native';
import {useApp} from '../../stores';

interface StoreProviderProps {
  children: ReactNode;
}

export const StoreProvider = ({children}: StoreProviderProps) => {
  const {setOnlineStatus, isOnline} = useApp();
  const [isNetInfoAvailable, setIsNetInfoAvailable] = useState(false);

  useEffect(() => {
    // Online/Offline-Status erkennen - unterschiedlich für Web vs Native
    
    if (Platform.OS === 'web') {
      // Web: Standard Browser APIs
      const handleOnline = () => {
        console.log('[StoreProvider] App went online');
        setOnlineStatus(true);
      };

      const handleOffline = () => {
        console.log('[StoreProvider] App went offline');
        setOnlineStatus(false);
      };

      if (typeof window !== 'undefined') {
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        
        // Initialen Status setzen
        setOnlineStatus(navigator.onLine);

        // Visibility API für App-Lifecycle
        const handleVisibilityChange = () => {
          if (document.hidden) {
            console.log('[StoreProvider] App in background');
          } else {
            console.log('[StoreProvider] App in foreground');
            setOnlineStatus(navigator.onLine);
          }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
          window.removeEventListener('online', handleOnline);
          window.removeEventListener('offline', handleOffline);
          document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
      }
    } else {
      // React Native: NetInfo verwenden
      let unsubscribe: (() => void) | null = null;
      
      const setupNetInfo = async () => {
        try {
          // Dynamisch importieren für Web-Kompatibilität
          const NetInfo = await import('@react-native-community/netinfo');
          setIsNetInfoAvailable(true);
          
          unsubscribe = NetInfo.default.addEventListener((state) => {
            const isConnected = state.isConnected ?? false;
            console.log('[StoreProvider] NetInfo update:', state.isConnected);
            setOnlineStatus(isConnected);
          });
          
          // Initialer Status
          const initialState = await NetInfo.default.fetch();
          setOnlineStatus(initialState.isConnected ?? false);
        } catch (error) {
          console.warn('[StoreProvider] NetInfo not available, using default online state');
          setOnlineStatus(true); // Fallback: assume online
        }
      };
      
      setupNetInfo();
      
      return () => {
        if (unsubscribe) {
          unsubscribe();
        }
      };
    }
  }, [setOnlineStatus]);

  // Debug Logging
  useEffect(() => {
    console.log('[StoreProvider] Online Status:', isOnline);
  }, [isOnline]);

  return <>{children}</>;
};
