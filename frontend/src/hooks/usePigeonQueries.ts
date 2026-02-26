/**
 * React Query Hooks für Tauben-API
 * T3: State Management - React Query Integration
 */

import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {queryKeys, Pigeon, Sighting, MatchResponse} from '../types/store';
import {useSettingsStore} from '../stores';

// API Client-Hilfsfunktion
const apiClient = async (endpoint: string, options?: RequestInit) => {
  const apiUrl = useSettingsStore.getState().apiUrl;
  const apiKey = useSettingsStore.getState().apiKey;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options?.headers as Record<string, string>) || {}),
  };
  
  if (apiKey) {
    headers['Authorization'] = `Bearer ${apiKey}`;
  }
  
  const response = await fetch(`${apiUrl}${endpoint}`, {
    ...options,
    headers,
  });
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
};

// ==========================================
// Query Hooks
// ==========================================

/**
 * Alle Tauben abrufen
 */
export const usePigeons = () => {
  return useQuery({
    queryKey: queryKeys.pigeons,
    queryFn: async (): Promise<Pigeon[]> => {
      return apiClient('/pigeons');
    },
    staleTime: 5 * 60 * 1000, // 5 Minuten
    gcTime: 10 * 60 * 1000, // 10 Minuten
  });
};

/**
 * Einzelne Taube abrufen
 */
export const usePigeon = (id: string) => {
  return useQuery({
    queryKey: queryKeys.pigeon(id),
    queryFn: async (): Promise<Pigeon> => {
      return apiClient(`/pigeons/${id}`);
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

/**
 * Alle Sichtungen abrufen
 */
export const useSightings = () => {
  return useQuery({
    queryKey: queryKeys.sightings,
    queryFn: async (): Promise<Sighting[]> => {
      return apiClient('/sightings');
    },
    staleTime: 2 * 60 * 1000, // 2 Minuten
    gcTime: 5 * 60 * 1000,
  });
};

/**
 * Sichtungen einer bestimmten Taube abrufen
 */
export const useSightingsByPigeon = (pigeonId: string) => {
  return useQuery({
    queryKey: queryKeys.sightingsByPigeon(pigeonId),
    queryFn: async (): Promise<Sighting[]> => {
      return apiClient(`/pigeons/${pigeonId}/sightings`);
    },
    enabled: !!pigeonId,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

// ==========================================
// Mutation Hooks
// ==========================================

interface CreatePigeonData {
  name: string;
  ringNumber?: string;
  color: string;
}

/**
 * Neue Taube erstellen
 */
export const useCreatePigeon = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreatePigeonData): Promise<Pigeon> => {
      return apiClient('/pigeons', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      // Invalidiert die Tauben-Liste nach erfolgreicher Erstellung
      queryClient.invalidateQueries({queryKey: queryKeys.pigeons});
    },
  });
};

/**
 * Taube aktualisieren
 */
export const useUpdatePigeon = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({id, ...data}: Partial<CreatePigeonData> & {id: string}): Promise<Pigeon> => {
      return apiClient(`/pigeons/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },
    onSuccess: (_, variables) => {
      // Invalidiert sowohl die Liste als auch das einzelne Detail
      queryClient.invalidateQueries({queryKey: queryKeys.pigeons});
      queryClient.invalidateQueries({queryKey: queryKeys.pigeon(variables.id)});
    },
  });
};

/**
 * Taube löschen
 */
export const useDeletePigeon = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      return apiClient(`/pigeons/${id}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: queryKeys.pigeons});
    },
  });
};

interface CreateSightingData {
  pigeonId: string;
  location: {latitude: number; longitude: number};
  photoUrl?: string;
  notes?: string;
}

/**
 * Neue Sichtung erstellen
 */
export const useCreateSighting = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateSightingData): Promise<Sighting> => {
      return apiClient('/sightings', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({queryKey: queryKeys.sightings});
      queryClient.invalidateQueries({queryKey: queryKeys.sightingsByPigeon(variables.pigeonId)});
    },
  });
};

// ==========================================
// Match/Scan Hook
// ==========================================

interface MatchImageData {
  imageBase64: string;
  threshold?: number;
}

/**
 * Bild-Matching für Tauben-Scan
 */
export const useMatchImage = () => {
  return useMutation({
    mutationFn: async (data: MatchImageData): Promise<MatchResponse> => {
      return apiClient('/match', {
        method: 'POST',
        body: JSON.stringify({
          image: data.imageBase64,
          threshold: data.threshold,
        }),
      });
    },
  });
};
