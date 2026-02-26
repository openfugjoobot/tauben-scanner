/**
 * Hooks Barrel Export
 * Combined: T3 State Management + T4 API Layer
 */

// Export all API hooks from api.ts (T4) - primary source
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

// Also export from usePigeonQueries.ts (T3) for backward compatibility
export {
  usePigeons as usePigeonsLegacy,
  usePigeon as usePigeonLegacy,
  useCreatePigeon as useCreatePigeonLegacy,
  useUpdatePigeon,
  useDeletePigeon,
  useSightings as useSightingsLegacy,
  useSightingsByPigeon,
  useCreateSighting as useCreateSightingLegacy,
  useMatchImage as useMatchImageLegacy,
} from './usePigeonQueries';

export { default } from './api';
