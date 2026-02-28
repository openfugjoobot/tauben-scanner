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
