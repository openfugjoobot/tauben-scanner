// apiClient.ts - Einfacher fetch-basierter HTTP Client
// KEIN axios mehr

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

class FetchError extends Error {
  constructor(message: string, public status?: number, public data?: unknown) {
    super(message);
    this.name = 'FetchError';
  }
}

const request = async <T>(method: string, endpoint: string, data?: unknown): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);
  
  try {
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: data ? JSON.stringify(data) : undefined,
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new FetchError(`HTTP ${response.status}`, response.status);
    }
    
    return await response.json() as T;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

export const apiClient = {
  get: <T>(endpoint: string) => request<T>('GET', endpoint),
  post: <T>(endpoint: string, data: unknown) => request<T>('POST', endpoint, data),
  put: <T>(endpoint: string, data: unknown) => request<T>('PUT', endpoint, data),
  delete: <T>(endpoint: string) => request<T>('DELETE', endpoint),
};

export class ApiError extends FetchError {}