import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios';
import type { ApiError, ApiErrorCode } from './apiClient.types';

const DEFAULT_TIMEOUT = 30000;
const UPLOAD_TIMEOUT = 120000;

// Base URL without /api - endpoints will be prefixed with /api
const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://tauben-scanner.fugjoo.duckdns.org';

class ApiClient {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: BASE_URL,
      timeout: DEFAULT_TIMEOUT,
      headers: { 
        'Content-Type': 'application/json',
      },
    });
    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.instance.interceptors.request.use(
      (config) => config,
      (error) => Promise.reject(error)
    );

    this.instance.interceptors.response.use(
      (response) => {
        response.data = this.transformResponse(response.data);
        return response;
      },
      (error: AxiosError) => {
        const apiError = this.normalizeError(error);
        return Promise.reject(apiError);
      }
    );
  }

  private transformResponse(data: any): any {
    if (!data) return data;

    if (Array.isArray(data.pigeons)) {
      data.pigeons = data.pigeons.map((pigeon: any) => this.transformPigeon(pigeon));
      return data;
    }

    if (data.id && (data.photo_url !== undefined || data.photoUrl !== undefined)) {
      return this.transformPigeon(data);
    }

    if (data.pigeon && typeof data.pigeon === 'object') {
      data.pigeon = this.transformPigeon(data.pigeon);
      return data;
    }

    return data;
  }

  private transformPigeon(pigeon: any): any {
    if (!pigeon) return pigeon;

    const transformed = { ...pigeon };

    if (pigeon.photo_url !== undefined) {
      transformed.photoUrl = this.makeAbsoluteUrl(pigeon.photo_url);
      delete transformed.photo_url;
    } else if (pigeon.photoUrl && pigeon.photoUrl.startsWith('/')) {
      transformed.photoUrl = this.makeAbsoluteUrl(pigeon.photoUrl);
    }

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

    if (Array.isArray(pigeon.sightings)) {
      transformed.sightings = pigeon.sightings.map((sighting: any) => {
        const s = { ...sighting };
        if (sighting.timestamp !== undefined) {
          s.date = sighting.timestamp;
          delete s.timestamp;
        }
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
    if (url.startsWith('http')) return url;

    const cleanPath = url.startsWith('/') ? url : `/${url}`;
    return `${BASE_URL}${cleanPath}`;
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
}

export const apiClient = new ApiClient();
