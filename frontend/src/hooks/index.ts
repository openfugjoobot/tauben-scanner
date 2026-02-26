/**
 * Hooks Barrel Export
 * Combined T3 + T4 API Layer
 */

// T4 API Layer - Query Client and Provider
export {
  QueryClient,
  QueryClientProvider,
  createQueryClient,
  queryKeys,
} from './api';

// T4 API Layer - API hooks
export {
  usePigeons as usePigeonsAPI,
  usePigeon as usePigeonAPI,
  useCreatePigeon as useCreatePigeonAPI,
  useMatchImage as useMatchImageAPI,
  useUploadImage as useUploadImageAPI,
  useSightings as useSightingsAPI,
  useCreateSighting as useCreateSightingAPI,
} from './api';

// T3 State Management - React Query Hooks
export {
  usePigeons,
  usePigeon,
  useSightings,
  useSightingsByPigeon,
  useCreatePigeon,
  useUpdatePigeon,
  useDeletePigeon,
  useCreateSighting,
  useMatchImage,
} from './usePigeonQueries';
