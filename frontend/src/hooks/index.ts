/**
 * T4 API Layer - Hooks
 * Barrel export for all custom hooks
 */

// Export API hooks
export {
  usePigeons,
  usePigeon,
  useCreatePigeon,
  useMatchImage,
  useUploadImage,
  useSightings,
  useCreateSighting,
  QueryClient,
  QueryClientProvider,
  createQueryClient,
  queryKeys,
} from './api';

// Re-export original hooks
export { default } from './api';
