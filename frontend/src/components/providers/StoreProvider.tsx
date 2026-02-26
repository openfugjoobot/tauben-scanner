/**
 * Store Provider - Integration der Zustand Stores
 * T3: State Management
 *
 * Diese Komponente initialisiert Network-Status-Erkennung
 * und synchronisiert Stores mit der App-Lifecycle
 */

import {ReactNode, useEffect} from 'react';
import NetInfo from '@react-native-community/netinfo';
import {AppState} from 'react-native';
import {useApp} from '../../stores';

interface StoreProviderProps {
  children: ReactNode;
}

export const StoreProvider = ({children}: StoreProviderProps) => {
  const {setOnlineStatus, isOnline} = useApp();

  useEffect(() => {
    // Network-Status mit NetInfo erkennen
    const unsubscribeNetInfo = NetInfo.addEventListener((state) => {
      setOnlineStatus(state.isConnected ?? true);
    });

    // AppState für Lifecycle-Events
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        // Re-check online status wenn App wieder aktiv
        NetInfo.fetch().then((state) => {
          setOnlineStatus(state.isConnected ?? true);
        });
      }
    });

    return () => {
      unsubscribeNetInfo();
      subscription.remove();
    };
  }, [setOnlineStatus]);

  return <>{children}</>;
};
