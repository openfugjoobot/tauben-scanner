import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios';
import { useSettingsStore } from '../../stores/settings';
import type { ApiError, ApiErrorCode } from './apiClient.types';

const DEFAULT_TIMEOUT = 30000;
const UPLOAD_TIMEOUT = 120000;

class ApiClient {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      timeout: DEFAULT_TIMEOUT,
      headers: { 'Content-Type': 'application/json' },
    });
    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.instance.interceptors.request.use(
      (config) => {
        const { apiUrl, apiKey } = useSettingsStore.getState();
        config.baseURL = apiUrl;
        if (apiKey) {
          config.headers.Authorization = `Bearer ${apiKey}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.instance.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        const apiError = this.normalizeError(error);
        return Promise.reject(apiError);
      }
    );
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
      return { code: 'NETWORK_ERROR', message: 'Netzwerkfehler. Bitte prüfen Sie Ihre Verbindung.' };
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

  async upload<T>(
    endpoint: string,
    file: FormData,
    onProgress?: (progress: number) => void
  ): Promise<T> {
    const response = await this.instance.post<T>(endpoint, file, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: UPLOAD_TIMEOUT,
      onUploadProgress: (e) => {
        if (onProgress && e.total) {
          onProgress(Math.round((e.loaded / e.total) * 100));
        }
      },
    });
    return response.data;
  }
}

export const apiClient = new ApiClient();
