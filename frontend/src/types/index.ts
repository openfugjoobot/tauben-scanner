/**
 * T4 API Layer - TypeScript Interfaces
 * Complete type definitions for Tauben Scanner API
 */

// ==================== Base Types ====================

export interface Location {
  lat: number;
  lng: number;
  name?: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

// ==================== Pigeon Types ====================

export interface Pigeon {
  id: string;
  name: string;
  description?: string;
  photo_url?: string;
  first_seen?: string;
  sightings_count?: number;
}

export interface PigeonDetail extends Pigeon {
  location?: Location;
  sightings: Sighting[];
  is_public?: boolean;
  created_at: string;
  updated_at?: string;
}

export interface CreatePigeonRequest {
  name: string;
  description?: string;
  color?: string;
  photo: string; // base64 encoded image
  location?: Location;
  is_public?: boolean;
}

export interface CreatePigeonResponse {
  id: string;
  name: string;
  description?: string;
  location?: Location;
  first_seen?: string;
  photo_url: string | null;
  embedding_generated: boolean;
  created_at: string;
}

export interface PigeonsListResponse {
  pigeons: Pigeon[];
  pagination: Pagination;
}

// ==================== Sighting Types ====================

export interface SightingPigeon {
  id: string;
  name: string;
}

export interface Sighting {
  id: string;
  pigeon: SightingPigeon;
  location?: Location;
  notes?: string;
  condition?: string;
  timestamp: string;
}

export interface CreateSightingRequest {
  pigeon_id: string;
  location?: Location;
  notes?: string;
  condition?: string;
}

export interface CreateSightingResponse {
  id: string;
  pigeon_id: string;
  location?: Location;
  notes?: string;
  condition?: string;
  timestamp: string;
}

export interface SightingDetail {
  id: string;
  pigeon_id: string;
  pigeon_name?: string;
  location?: Location;
  notes?: string;
  condition?: string;
  timestamp: string;
}

export interface SightingsListResponse {
  sightings: SightingDetail[];
  pagination: Pagination;
}

// ==================== Match Types ====================

export interface MatchRequest {
  photo?: string; // base64 encoded image
  embedding?: number[]; // optional: client-extracted embedding
  location?: Location;
  threshold?: number; // default: 0.80
}

export interface SimilarPigeon {
  id: string;
  name: string;
  similarity: number;
}

export interface MatchResponse {
  match: boolean;
  pigeon?: Pigeon;
  confidence: number;
  similar_pigeons?: SimilarPigeon[];
  suggestion?: string;
}

// ==================== Image Upload Types ====================

export interface ImageUploadRequest {
  image: Blob | File | string; // React Native Blob, Web File, or base64
  pigeon_id?: string;
  is_primary?: boolean;
}

export interface ImageUploadResponse {
  id: string;
  pigeon_id?: string;
  url: string;
  file_path: string;
  created_at: string;
}

// ==================== API Error Types ====================

export interface ApiErrorResponse {
  error: string;
  message: string;
  field?: string;
  details?: string[];
}

export interface ApiError {
  code: string;
  message: string;
  status: number;
  field?: string;
  details?: string[];
}

// ==================== Query Parameters ====================

export interface PigeonsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface SightingsQueryParams {
  page?: number;
  limit?: number;
  pigeon_id?: string;
}

// ==================== API State Types ====================

export type ApiStatus = 'idle' | 'loading' | 'success' | 'error' | 'retrying';

export interface ApiState<T = unknown> {
  data: T | null;
  status: ApiStatus;
  error: ApiError | null;
  retryCount: number;
}

// ==================== Health Check ====================

export interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  services: {
    database: 'connected' | 'disconnected';
    storage: 'connected' | 'disconnected';
    embedding_model: 'loaded' | 'not_loaded';
  };
  error?: string;
  message?: string;
}
