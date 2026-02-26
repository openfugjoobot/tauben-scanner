/**
 * T4 API Layer - Services
 * Barrel export for all service modules
 */

// Export API client
export { 
  default as apiClient, 
  getApiClient, 
  resetApiClient,
  isApiError, 
  extractApiError,
  getErrorMessage,
} from './apiClient';

// Export API functions
export {
  default,
  fetchPigeons,
  fetchPigeon,
  createPigeon,
  matchImage,
  uploadImage,
  fetchSightings,
  createSighting,
  checkHealth,
  parseError,
} from './api';

export { isAxiosError } from './api';
