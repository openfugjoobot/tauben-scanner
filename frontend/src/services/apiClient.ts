/**
 * T4 API Layer - API Client
 * Axios-based API client with interceptors and retry logic
 */

import axios, { 
  AxiosInstance, 
  AxiosError, 
  InternalAxiosRequestConfig 
} from 'axios';
import { ApiError } from '../types';

// ==================== Configuration ====================

const DEFAULT_BASE_URL = 'https://tauben-scanner.fugjoo.duckdns.org';
const DEFAULT_TIMEOUT = 30000; // 30 seconds
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second initial delay

// URLs that should never be retried (idempotent safety)
const NO_RETRY_URLS = ['/api/pigeons', '/api/sightings'];

// HTTP status codes that should trigger a retry
const RETRYABLE_STATUSES = [408, 429, 500, 502, 503, 504];

// ==================== Types ====================

interface RetryState {
  retryCount: number;
}

// ==================== Retry Logic ====================

const getRetryDelay = (attempt: number): number => {
  // Exponential backoff: 1s, 2s, 4s
  return RETRY_DELAY * Math.pow(2, attempt - 1);
};

const shouldRetry = (error: AxiosError, retryCount: number): boolean => {
  // Max retries reached
  if (retryCount >= MAX_RETRIES) {
    return false;
  }

  // Don't retry POST/PUT/DELETE on non-retryable URLs (non-idempotent)
  const method = error.config?.method?.toUpperCase();
  const url = error.config?.url || '';
  
  if (method !== 'GET' && NO_RETRY_URLS.some(u => url.includes(u))) {
    // Only retry POST/PUT/DELETE on network errors
    if (!error.response) {
      return true; // Network error - should retry
    }
    return false;
  }

  // Retry on network errors (no response)
  if (!error.response) {
    return true;
  }

  // Retry on specific HTTP status codes
  const status = error.response.status;
  return RETRYABLE_STATUSES.includes(status);
};

const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// ==================== Error Handling ====================

const parseApiError = (error: AxiosError): ApiError => {
  const response = error.response?.data as { error: string; message: string; field?: string; details?: string[] } | undefined;
  const status = error.response?.status || 0;

  // Network error
  if (!error.response) {
    return {
      code: 'NETWORK_ERROR',
      message: 'Netzwerkfehler - bitte Verbindung prüfen',
      status: 0,
    };
  }

  // Parse API error response
  if (response && typeof response === 'object') {
    return {
      code: response.error || `HTTP_${status}`,
      message: response.message || 'Ein Fehler ist aufgetreten',
      status,
      field: response.field,
      details: response.details,
    };
  }

  // Fallback error
  return {
    code: `HTTP_${status}`,
    message: 'Ein unerwarteter Fehler ist aufgetreten',
    status,
  };
};

// ==================== Storage Helpers ====================

// Get base URL from settings (Capacitor Preferences)
const getBaseUrl = async (): Promise<string> => {
  try {
    // Dynamically import to avoid top-level import issues
    const { Preferences } = await import('@capacitor/preferences');
    const { value } = await Preferences.get({ key: 'app_settings' });
    if (value) {
      const settings = JSON.parse(value);
      return settings.backendUrl || DEFAULT_BASE_URL;
    }
  } catch (e) {
    console.warn('[API] Failed to load settings, using default:', e);
  }
  return DEFAULT_BASE_URL;
};

// ==================== Axios Instance ====================

const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    timeout: DEFAULT_TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });

  // Request interceptor - add base URL and auth headers
  client.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      // Set base URL from settings
      const baseUrl = await getBaseUrl();
      config.baseURL = baseUrl;

      // Log request in development
      if (import.meta.env.DEV) {
        console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
      }

      return config;
    },
    (error) => {
      console.error('[API Request Error]', error);
      return Promise.reject(error);
    }
  );

  // Response interceptor - handle errors and parse response
  client.interceptors.response.use(
    (response) => {
      // Log response in development
      if (import.meta.env.DEV) {
        console.log(`[API Response] ${response.status} ${response.config.url}`);
      }
      return response;
    },
    async (error: AxiosError) => {
      const config = error.config as InternalAxiosRequestConfig & { _retryState?: RetryState };
      
      if (!config) {
        return Promise.reject(error);
      }

      // Initialize retry state
      if (!config._retryState) {
        config._retryState = { retryCount: 0 };
      }

      const retryState = config._retryState;
      
      // Check if we should retry
      if (shouldRetry(error, retryState.retryCount)) {
        retryState.retryCount++;
        const delay = getRetryDelay(retryState.retryCount);
        
        console.log(`[API] Retry ${retryState.retryCount}/${MAX_RETRIES} after ${delay}ms`);
        
        await sleep(delay);
        return client(config);
      }

      // Max retries reached or not retryable - parse error
      const apiError = parseApiError(error);
      
      console.error('[API Response Error]', {
        url: config.url,
        status: apiError.status,
        code: apiError.code,
        message: apiError.message,
        retries: retryState.retryCount,
      });

      // Reject with structured error
      const enhancedError = Object.assign(new Error(apiError.message), {
        apiError,
        isApiError: true,
      });

      return Promise.reject(enhancedError);
    }
  );

  return client;
};

// Create singleton instance
let apiClientInstance: AxiosInstance | null = null;

export const getApiClient = (): AxiosInstance => {
  if (!apiClientInstance) {
    apiClientInstance = createApiClient();
  }
  return apiClientInstance;
};

// Reset client (useful when settings change)
export const resetApiClient = (): void => {
  apiClientInstance = null;
};

// Export the client directly (lazy initialization)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const apiClient: AxiosInstance = new Proxy({} as any, {
  get: (_target, prop: string) => {
    const client = getApiClient();
    return client[prop as keyof AxiosInstance];
  },
});

// ==================== Helper Functions ====================

/**
 * Check if error is an API error with structured data
 */
export const isApiError = (error: unknown): error is Error & { apiError: ApiError } => {
  return error instanceof Error && 'isApiError' in error && (error as { isApiError: boolean }).isApiError === true;
};

/**
 * Extract ApiError from any error type
 */
export const extractApiError = (error: unknown): ApiError | null => {
  if (isApiError(error)) {
    return error.apiError;
  }
  return null;
};

/**
 * Get user-friendly error message
 */
export const getErrorMessage = (error: unknown): string => {
  const apiError = extractApiError(error);
  if (apiError) {
    return apiError.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'Ein unbekannter Fehler ist aufgetreten';
};

export default apiClient;
