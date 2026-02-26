/**
 * T4 API Layer - API Service Functions
 * Direct API calls using the axios client
 */

import { apiClient } from './apiClient';
import {
  PigeonsListResponse,
  PigeonDetail,
  CreatePigeonRequest,
  CreatePigeonResponse,
  SightingsListResponse,
  CreateSightingRequest,
  CreateSightingResponse,
  MatchRequest,
  MatchResponse,
  ImageUploadResponse,
  PigeonsQueryParams,
  SightingsQueryParams,
  HealthCheckResponse,
  ApiErrorResponse,
  ApiError,
} from '../types';
import type { AxiosError } from 'axios';

// ==================== Pigeons API ====================

/**
 * Get paginated list of pigeons
 * GET /api/pigeons
 */
export const fetchPigeons = async (params?: PigeonsQueryParams): Promise<PigeonsListResponse> => {
  const response = await apiClient.get<PigeonsListResponse>('/api/pigeons', {
    params: {
      page: params?.page || 1,
      limit: params?.limit || 20,
      search: params?.search,
    },
  });
  return response.data;
};

/**
 * Get single pigeon by ID
 * GET /api/pigeons/:id
 */
export const fetchPigeon = async (id: string): Promise<PigeonDetail> => {
  const response = await apiClient.get<PigeonDetail>(`/api/pigeons/${id}`);
  return response.data;
};

/**
 * Create a new pigeon
 * POST /api/pigeons
 */
export const createPigeon = async (data: CreatePigeonRequest): Promise<CreatePigeonResponse> => {
  const response = await apiClient.post<CreatePigeonResponse>('/api/pigeons', data, {
    timeout: 60000, // Longer timeout for image processing
  });
  return response.data;
};

// ==================== Images/Match API ====================

/**
 * Match a pigeon by image
 * POST /api/images/match
 */
export const matchImage = async (data: MatchRequest): Promise<MatchResponse> => {
  const response = await apiClient.post<MatchResponse>('/api/images/match', data, {
    timeout: 60000, // Longer timeout for embedding extraction
  });
  return response.data;
};

/**
 * Upload an image for a pigeon
 * POST /api/images/upload
 */
export const uploadImage = async (
  formData: FormData,
  onProgress?: (progress: number) => void
): Promise<ImageUploadResponse> => {
  const response = await apiClient.post<ImageUploadResponse>('/api/images/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    timeout: 120000, // 2 minute timeout for image upload
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(progress);
      }
    },
  });
  return response.data;
};

// ==================== Sightings API ====================

/**
 * Get paginated list of sightings
 * GET /api/sightings
 */
export const fetchSightings = async (params?: SightingsQueryParams): Promise<SightingsListResponse> => {
  const response = await apiClient.get<SightingsListResponse>('/api/sightings', {
    params: {
      page: params?.page || 1,
      limit: params?.limit || 20,
    },
  });
  return response.data;
};

/**
 * Create a new sighting
 * POST /api/sightings
 */
export const createSighting = async (data: CreateSightingRequest): Promise<CreateSightingResponse> => {
  const response = await apiClient.post<CreateSightingResponse>('/api/sightings', data);
  return response.data;
};

// ==================== Health Check ====================

/**
 * Check API health status
 * GET /health
 */
export const checkHealth = async (): Promise<HealthCheckResponse> => {
  const response = await apiClient.get<HealthCheckResponse>('/health', {
    timeout: 10000, // Short timeout for health check
  });
  return response.data;
};

// ==================== Error Handling ====================

/**
 * Type guard for Axios errors
 */
export const isAxiosError = (error: unknown): error is AxiosError => {
  return error instanceof Error && 'isAxiosError' in error;
};

/**
 * Parse API error response
 */
export const parseError = (error: unknown): ApiError => {
  if (isAxiosError(error)) {
    const response = error.response?.data as ApiErrorResponse | undefined;
    return {
      code: response?.error || 'HTTP_ERROR',
      message: response?.message || error.message || 'Ein Fehler ist aufgetreten',
      status: error.response?.status || 0,
      field: response?.field,
      details: undefined, // Could parse details if available
    };
  }

  return {
    code: 'UNKNOWN_ERROR',
    message: error instanceof Error ? error.message : 'Ein Fehler ist aufgetreten',
    status: 0,
  };
};

// Alias exports for backward compatibility
export const listPigeons = fetchPigeons;
export const getPigeon = fetchPigeon;
export const registerPigeon = createPigeon;
export const matchPigeon = matchImage;
export const reportSighting = createSighting;
export const listSightings = fetchSightings;

// Get current API base URL
export const getApiBaseUrl = async (): Promise<string> => {
  try {
    const { Preferences } = await import('@capacitor/preferences');
    const { value } = await Preferences.get({ key: 'app_settings' });
    if (value) {
      const settings = JSON.parse(value);
      return settings.backendUrl || 'https://tauben-scanner.fugjoo.duckdns.org';
    }
  } catch {
    // Default fallback
  }
  return 'https://tauben-scanner.fugjoo.duckdns.org';
};

// Export all as default object
export default {
  fetchPigeons,
  fetchPigeon,
  createPigeon,
  matchImage,
  uploadImage,
  fetchSightings,
  createSighting,
  checkHealth,
  // Backward compatibility
  listPigeons,
  getPigeon,
  registerPigeon,
  matchPigeon,
  reportSighting,
  listSightings,
};
