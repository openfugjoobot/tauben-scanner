import { useCallback, useState } from 'react';
import { registerPigeon, getPigeon, listPigeons, reportSighting, matchPigeon } from '../services/api';
import type { MatchRequest, CreatePigeonResponse, Location } from '../types/api';

interface CreatePigeonParams {
  name: string;
  description?: string;
  photo: string;
  location?: Location;
  color?: string;
}

interface UsePigeonApiReturn {
  createPigeon: (pigeon: CreatePigeonParams) => Promise<CreatePigeonResponse>;
  getPigeon: (id: string) => Promise<any>;
  getPigeons: (params?: { page?: number; limit?: number; search?: string }) => Promise<any>;
  addSighting: (sighting: { pigeon_id: string; location?: Location; notes?: string; photo?: string }) => Promise<any>;
  match: (request: MatchRequest) => Promise<any>;
  error: string | null;
}

export function usePigeonApi(): UsePigeonApiReturn {
  const [error, setError] = useState<string | null>(null);

  const createPigeon = useCallback(async (pigeon: CreatePigeonParams): Promise<CreatePigeonResponse> => {
    setError(null);
    
    try {
      const response = await registerPigeon({
        name: pigeon.name,
        description: pigeon.description,
        photo: pigeon.photo,
        location: pigeon.location,
        is_public: false,
      });
      
      return response as CreatePigeonResponse;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Fehler beim Speichern der Taube';
      setError(message);
      throw new Error(message);
    }
  }, []);

  const getPigeonFn = useCallback(async (id: string) => {
    try {
      const response = await getPigeon(id);
      return response;
    } catch (err) {
      throw err;
    }
  }, []);

  const getPigeonsFn = useCallback(async (params?: { page?: number; limit?: number; search?: string }) => {
    try {
      const response = await listPigeons(params);
      return response;
    } catch (err) {
      throw err;
    }
  }, []);

  const addSightingFn = useCallback(async (sighting: { pigeon_id: string; location?: Location; notes?: string; photo?: string }) => {
    try {
      const response = await reportSighting(sighting);
      return response;
    } catch (err) {
      throw err;
    }
  }, []);

  const matchFn = useCallback(async (request: MatchRequest) => {
    try {
      const response = await matchPigeon(request);
      return response;
    } catch (err) {
      throw err;
    }
  }, []);

  return {
    createPigeon,
    getPigeon: getPigeonFn,
    getPigeons: getPigeonsFn,
    addSighting: addSightingFn,
    match: matchFn,
    error,
  };
}
