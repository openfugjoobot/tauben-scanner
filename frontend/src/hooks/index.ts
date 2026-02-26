/**
 * Hooks Barrel Export
 * Combined: T3 State Management + T4 API Layer
 */

// Re-export all API hooks from api.ts (T4)
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

// Re-export React Query hooks (T3)
export {
  usePigeon as usePigeonQuery,
  usePigeons as usePigeonsQuery,
  useSightings as useSightingsQuery,
  useSightingsByPigeon,
  useCreatePigeon as useCreatePigeonMutation,
  useUpdatePigeon,
  useDeletePigeon,
  useCreateSighting as useCreateSightingMutation,
  useMatchImage as useMatchImageMutation,
} from './usePigeonQueries';

// Legacy hooks
export {useAddPigeonForm} from './useAddPigeon';
export {useGeolocation} from './useGeolocation';
export {useMultiStepForm} from './useMultiStepForm';
export {usePigeonApi} from './usePigeonApi';
export {useSettingsHook, useAppSettings} from './useSettings';
