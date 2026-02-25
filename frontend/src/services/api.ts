import { Preferences } from '@capacitor/preferences';
import type { MatchRequest, MatchResponse, Pigeon } from '../types/api';

const DEFAULT_API_URL = 'https://tauben-scanner.fugjoo.duckdns.org';

async function getApiBaseUrl(): Promise<string> {
  try {
    const { value } = await Preferences.get({ key: 'app_settings' });
    if (value) {
      const settings = JSON.parse(value);
      if (settings.backendUrl && settings.backendUrl !== 'https://api.tauben-scanner.example.com') {
        // Ensure no trailing slash for consistent URL construction
        return settings.backendUrl.replace(/\/+$/, '');
      }
    }
  } catch (error) {
    console.error('Failed to load API URL from settings:', error);
  }
  return DEFAULT_API_URL;
}

// Helper function to add timeout to fetch requests
async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeoutMs: number = 30000
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Network timeout - please check your connection');
    }
    throw error;
  }
}

class ApiError extends Error {
  public readonly code: string;
  public readonly status: number;
  public readonly field?: string;

  constructor(message: string, code: string, status: number, field?: string) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.field = field;
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorData: { error?: string; message?: string; field?: string } = {};
    try {
      errorData = await response.json();
    } catch {
      // If JSON parsing fails, use default error
      console.warn('Failed to parse error response as JSON');
    }

    // Provide more helpful error messages based on status code
    let errorMessage = errorData.message || `HTTP ${response.status}: ${response.statusText}`;
    if (response.status === 0) {
      errorMessage = 'Network error - please check your internet connection';
    } else if (response.status === 404) {
      errorMessage = 'Resource not found - the requested endpoint does not exist';
    } else if (response.status === 500) {
      errorMessage = 'Server error - please try again later';
    } else if (response.status === 503) {
      errorMessage = 'Service temporarily unavailable - please try again later';
    } else if (response.status === 408) {
      errorMessage = 'Request timeout - the server took too long to respond';
    }

    throw new ApiError(
      errorMessage,
      errorData.error || 'UNKNOWN_ERROR',
      response.status,
      errorData.field
    );
  }

  return response.json() as Promise<T>;
}

// Send a match request with photo
export async function matchPigeon(request: MatchRequest): Promise<MatchResponse> {
  const baseUrl = await getApiBaseUrl();
  const response = await fetchWithTimeout(
    `${baseUrl}/api/images/match`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    },
    30000 // 30 second timeout for image matching
  );

  return handleResponse<MatchResponse>(response);
}

// Register a new pigeon
export async function registerPigeon(pigeon: {
  name: string;
  description?: string;
  photo: string;
  location?: { lat: number; lng: number; name?: string };
  is_public?: boolean;
}): Promise<Pigeon> {
  const baseUrl = await getApiBaseUrl();
  const response = await fetchWithTimeout(
    `${baseUrl}/api/pigeons`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pigeon),
    },
    30000 // 30 second timeout for pigeon registration
  );

  return handleResponse<Pigeon>(response);
}

// Get pigeon details
export async function getPigeon(id: string): Promise<Pigeon> {
  const baseUrl = await getApiBaseUrl();
  const response = await fetchWithTimeout(
    `${baseUrl}/api/pigeons/${id}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
    15000 // 15 second timeout for single pigeon fetch
  );

  return handleResponse<Pigeon>(response);
}

// List all pigeons with pagination
export async function listPigeons(params?: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<{ pigeons: Pigeon[]; pagination: { page: number; limit: number; total: number; pages: number } }> {
  const query = new URLSearchParams();
  if (params?.page) query.append('page', params.page.toString());
  if (params?.limit) query.append('limit', params.limit.toString());
  if (params?.search) query.append('search', params.search);

  const baseUrl = await getApiBaseUrl();
  const response = await fetchWithTimeout(
    `${baseUrl}/api/pigeons?${query.toString()}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
    15000 // 15 second timeout for listing pigeons
  );

  return handleResponse<{ pigeons: Pigeon[]; pagination: { page: number; limit: number; total: number; pages: number } }>(response);
}

// Report a sighting
export async function reportSighting(sighting: {
  pigeon_id: string;
  location?: { lat: number; lng: number; name?: string };
  notes?: string;
  photo?: string;
}): Promise<{ id: string; pigeon_id: string; timestamp: string }> {
  const baseUrl = await getApiBaseUrl();
  const response = await fetchWithTimeout(
    `${baseUrl}/api/sightings`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sighting),
    },
    30000 // 30 second timeout for sighting report
  );

  return handleResponse<{ id: string; pigeon_id: string; timestamp: string }>(response);
}

// Health check
export async function healthCheck(): Promise<{ status: string; timestamp: string; services: Record<string, string> }> {
  const baseUrl = await getApiBaseUrl();
  const response = await fetchWithTimeout(
    `${baseUrl}/health`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
    10000 // 10 second timeout for health check
  );

  return handleResponse<{ status: string; timestamp: string; services: Record<string, string> }>(response);
}

export { ApiError };

export default { matchPigeon, registerPigeon, getPigeon, listPigeons, reportSighting, healthCheck };
