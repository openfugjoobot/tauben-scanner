/**
 * Store Provider - Integration der Zustand Stores
 * T3: State Management
 * 
 * Diese Komponente initialisiert Network-Status-Erkennung
 * und synchronisiert Stores mit der App-Lifecycle
 */

import {ReactNode, useEffect} from 'react';
import {useApp} from '../../stores';

interface StoreProviderProps {
  children: ReactNode;
}

export const StoreProvider = ({children}: StoreProviderProps) => {
  const {setOnlineStatus, isOnline} = useApp();

  useEffect(() => {
    // Online/Offline-Status erkennen
    const handleOnline = () => {
      console.log('[StoreProvider] App went online');
      setOnlineStatus(true);
    };

    const handleOffline = () => {
      console.log('[StoreProvider] App went offline');
      setOnlineStatus(false);
    };

    // Event Listener hinzufügen
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
        // Re-check online status wenn App wieder sichtbar
        setOnlineStatus(navigator.onLine);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [setOnlineStatus]);

  // Debug Logging in Entwicklung
  useEffect(() => {
    if (__DEV__) {
      console.log('[StoreProvider] Online Status:', isOnline);
    }
  }, [isOnline]);

  return <>{children}</>;
};
