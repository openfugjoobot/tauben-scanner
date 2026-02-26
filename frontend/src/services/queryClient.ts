/**
 * React Query Client Konfiguration
 * T3: State Management
 */

import {QueryClient} from '@tanstack/react-query';
import {QueryCache, MutationCache} from '@tanstack/react-query';

// Retry-Logik für API-Calls
const retryDelay = (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000);

// Query Client erstellen
export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      console.error(`Query error [${query.queryKey.join(' / ')}]:`, error);
    },
  }),
  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      console.error(`Mutation error [${mutation.options.mutationKey?.join(' / ') || 'unknown'}]:`, error);
    },
  }),
  defaultOptions: {
    queries: {
      // Caching
      staleTime: 5 * 60 * 1000, // 5 Minuten
      gcTime: 10 * 60 * 1000, // 10 Minuten (vormals cacheTime)
      
      // Refetching
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      refetchOnMount: 'always',
      
      // Retry
      retry: 3,
      retryDelay,
      
      // Network
      networkMode: 'online',
      
      // Errors
      throwOnError: false,
    },
    mutations: {
      // Retry
      retry: 1,
      retryDelay: 1000,
      
      // Network
      networkMode: 'online',
    },
  },
});

// Persistente Query-Keys (werden beim App-Neustart nicht gelöscht)
export const PERSISTED_QUERY_KEYS = [
  'settings',
  'pigeons',
];

// Hilfsfunktion: Cache manuell invalidieren
export const invalidateQueries = async (queryKey: string[]) => {
  await queryClient.invalidateQueries({queryKey});
};

// Hilfsfunktion: Alle Tauben-Queries invalidieren
export const invalidatePigeonQueries = async () => {
  await queryClient.invalidateQueries({queryKey: ['pigeons']});
};

// Hilfsfunktion: Alle Sighting-Queries invalidieren
export const invalidateSightingQueries = async () => {
  await queryClient.invalidateQueries({queryKey: ['sightings']});
};

// Hilfsfunktion: Spezifische Query vorab laden
export const prefetchQuery = async (queryKey: string[], fetchFn: () => Promise<unknown>) => {
  await queryClient.prefetchQuery({
    queryKey,
    queryFn: fetchFn,
  });
};

// Hilfsfunktion: Query aus dem Cache entfernen
export const removeQuery = (queryKey: string[]) => {
  queryClient.removeQueries({queryKey});
};

// Hilfsfunktion: Alle Queries löschen (z.B. beim Logout)
export const clearAllQueries = () => {
  queryClient.clear();
};

// DevTools-Konfiguration
export const getDevtoolsOptions = () => ({
  initialIsOpen: false,
  position: 'bottom' as const,
  buttonPosition: 'bottom-right' as const,
});
