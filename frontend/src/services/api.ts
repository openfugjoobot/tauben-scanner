// api.ts - API Service (fetch-basiert)
import { apiClient, ApiError } from './apiClient';
import type { Pigeon } from '../types';

interface ScanResponse {
  success: boolean;
  pigeons: Pigeon[];
  confidence: number;
}

export const scanPigeon = async (imageBase64: string, location?: { lat: number; lng: number }): Promise<ScanResponse> => {
  return apiClient.post<ScanResponse>('/scan', {
    imageBase64,
    ...(location ? { location: { latitude: location.lat, longitude: location.lng } } : {}),
  });
};

export const getPigeons = (): Promise<Pigeon[]> => apiClient.get<Pigeon[]>('/pigeons');

export const getPigeonById = (id: string): Promise<Pigeon> => apiClient.get<Pigeon>(`/pigeons/${id}`);

export { ApiError };