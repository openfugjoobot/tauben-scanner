import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios';
import type { ApiError, ApiErrorCode } from './apiClient.types';

const DEFAULT_TIMEOUT = 30000;
const UPLOAD_TIMEOUT = 120000;

// API URL direkt setzen - zuverlässiger als Interceptor
// Wichtig: Muss mit /api enden!
const API_URL = 'https://tauben-scanner.fugjoo.duckdns.org/api';

console.log('[API] Using API URL:', API_URL);

class ApiClient {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: API_URL,
      timeout: DEFAULT_TIMEOUT,
      headers: { 
        'Content-Type': 'application/json',
      },
    });
    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor - nur für Auth Header
    this.instance.interceptors.request.use(
      (config) => {
        // Debug logging
        console.log('[API Request]', config.method?.toUpperCase(), config.url);
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.instance.interceptors.response.use(
      (response) => {
        console.log('[API Response]', response.status, response.config.url);
        // Transformiere Daten: snake_case -> camelCase + absolute URLs
        response.data = this.transformResponse(response.data);
        return response;
      },
      (error: AxiosError) => {
        console.error('[API Error]', error.message, error.code);
        const apiError = this.normalizeError(error);
        return Promise.reject(apiError);
      }
    );
  }

  private transformResponse(data: any): any {
    if (!data) return data;

    // Array von Tauben
    if (Array.isArray(data.pigeons)) {
      data.pigeons = data.pigeons.map((pigeon: any) => this.transformPigeon(pigeon));
      return data;
    }

    // Einzelne Taube
    if (data.id && (data.photo_url !== undefined || data.photoUrl !== undefined)) {
      return this.transformPigeon(data);
    }

    // Match-Response
    if (data.pigeon && typeof data.pigeon === 'object') {
      data.pigeon = this.transformPigeon(data.pigeon);
      return data;
    }

    return data;
  }

  private transformPigeon(pigeon: any): any {
    if (!pigeon) return pigeon;

    const transformed = { ...pigeon };

    // photo_url -> photoUrl
    if (pigeon.photo_url !== undefined) {
      transformed.photoUrl = this.makeAbsoluteUrl(pigeon.photo_url);
      delete transformed.photo_url;
    } else if (pigeon.photoUrl && pigeon.photoUrl.startsWith('/')) {
      // Relative URL zu absolut machen
      transformed.photoUrl = this.makeAbsoluteUrl(pigeon.photoUrl);
    }

    // snake_case -> camelCase
    if (pigeon.first_seen !== undefined) {
      transformed.firstSeen = pigeon.first_seen;
      delete transformed.first_seen;
    }
    if (pigeon.last_seen !== undefined) {
      transformed.lastSeen = pigeon.last_seen;
      delete transformed.last_seen;
    }
    if (pigeon.created_at !== undefined) {
      transformed.createdAt = pigeon.created_at;
      delete transformed.created_at;
    }
    if (pigeon.updated_at !== undefined) {
      transformed.updatedAt = pigeon.updated_at;
      delete transformed.updated_at;
    }
    if (pigeon.sightings_count !== undefined) {
      transformed.sightingsCount = pigeon.sightings_count;
      delete transformed.sightings_count;
    }
    if (pigeon.owner_id !== undefined) {
      transformed.ownerId = pigeon.owner_id;
      delete transformed.owner_id;
    }

    // Transform sightings array: timestamp -> date, snake_case -> camelCase
    if (Array.isArray(pigeon.sightings)) {
      transformed.sightings = pigeon.sightings.map((sighting: any) => {
        const s = { ...sighting };
        // Backend sends 'timestamp', component expects 'date'
        if (sighting.timestamp !== undefined) {
          s.date = sighting.timestamp;
          delete s.timestamp;
        }
        // Transform location properties if needed
        if (sighting.location_lat !== undefined) {
          s.location = s.location || {};
          s.location.lat = sighting.location_lat;
          delete s.location_lat;
        }
        if (sighting.location_lng !== undefined) {
          s.location = s.location || {};
          s.location.lng = sighting.location_lng;
          delete s.location_lng;
        }
        if (sighting.location_name !== undefined) {
          s.location = s.location || {};
          s.location.address = sighting.location_name;
          delete s.location_name;
        }
        return s;
      });
    }

    return transformed;
  }

  private makeAbsoluteUrl(url: string): string {
    if (!url) return url;
    if (url.startsWith('http')) return url; // Bereits absolut

    // Basis-URL ohne /api
    const baseUrl = API_URL.replace(/\/api$/, '');
    const cleanPath = url.startsWith('/') ? url : `/${url}`;
    return `${baseUrl}${cleanPath}`;
  }

  private normalizeError(error: AxiosError): ApiError {
    if (error.response) {
      const status = error.response.status;
      const errorMap: Record<number, ApiErrorCode> = {
        400: 'VALIDATION_ERROR',
        401: 'UNAUTHORIZED',
        404: 'NOT_FOUND',
        500: 'SERVER_ERROR',
      };
      return {
        code: errorMap[status] || 'UNKNOWN_ERROR',
        message: (error.response.data as any)?.message || error.message,
        status,
      };
    }
    if (error.request) {
      return { 
        code: 'NETWORK_ERROR', 
        message: `Netzwerkfehler: ${error.message}. Prüfe Internet-Verbindung.` 
      };
    }
    return { code: 'UNKNOWN_ERROR', message: error.message };
  }

  async get<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.get<T>(endpoint, config);
    return response.data;
  }

  async post<T>(endpoint: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.post<T>(endpoint, data, {
      ...config,
      timeout: endpoint.includes('/images') ? UPLOAD_TIMEOUT : DEFAULT_TIMEOUT,
    });
    return response.data;
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await this.instance.put<T>(endpoint, data);
    return response.data;
  }

  async delete<T>(endpoint: string): Promise<T> {
    const response = await this.instance.delete<T>(endpoint);
    return response.data;
  }

  getBaseUrl(): string {
    return API_URL;
  }
}

export const apiClient = new ApiClient();
