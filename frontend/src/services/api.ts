import { Preferences } from '@capacitor/preferences';
import type { MatchRequest, MatchResponse, Pigeon } from '../types/api';

const DEFAULT_API_URL = 'https://tauben-scanner.fugjoo.duckdns.org';

async function getApiBaseUrl(): Promise<string> {
  try {
    const { value } = await Preferences.get({ key: 'app_settings' });
    if (value) {
      const settings = JSON.parse(value);
      if (settings.backendUrl && settings.backendUrl !== 'https://api.tauben-scanner.example.com') {
        return settings.backendUrl.replace(/\/$/, ''); // Remove trailing slash
      }
    }
  } catch (error) {
    console.error('Failed to load API URL from settings:', error);
  }
  return DEFAULT_API_URL;
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
    }
    
    throw new ApiError(
      errorData.message || `HTTP ${response.status}: ${response.statusText}`,
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
  const response = await fetch(`${baseUrl}/api/images/match`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

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
  const response = await fetch(`${baseUrl}/api/pigeons`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(pigeon),
  });

  return handleResponse<Pigeon>(response);
}

// Get pigeon details
export async function getPigeon(id: string): Promise<Pigeon> {
  const baseUrl = await getApiBaseUrl();
  const response = await fetch(`${baseUrl}/api/pigeons/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

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
  const response = await fetch(`${baseUrl}/api/pigeons?${query.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

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
  const response = await fetch(`${baseUrl}/api/sightings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(sighting),
  });

  return handleResponse<{ id: string; pigeon_id: string; timestamp: string }>(response);
}

// Health check
export async function healthCheck(): Promise<{ status: string; timestamp: string; services: Record<string, string> }> {
  const baseUrl = await getApiBaseUrl();
  const response = await fetch(`${baseUrl}/health`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<{ status: string; timestamp: string; services: Record<string, string> }>(response);
}

export { ApiError };

export default { matchPigeon, registerPigeon, getPigeon, listPigeons, reportSighting, healthCheck };
