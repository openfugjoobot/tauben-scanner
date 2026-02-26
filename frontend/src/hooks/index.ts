/**
 * Hooks Barrel Export
<<<<<<< HEAD
 * T3: State Management
 */

// New React Query Hooks
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

// Re-export legacy hooks (kompatibel mit bestehendem Code)
export {useAddPigeonForm} from './useAddPigeon';
export {useGeolocation} from './useGeolocation';
export {useMultiStepForm} from './useMultiStepForm';
export {usePigeonApi} from './usePigeonApi';
export {useSettingsHook, useAppSettings} from './useSettings';
=======
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
>>>>>>> main
