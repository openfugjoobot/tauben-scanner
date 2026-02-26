/**
 * Hooks Barrel Export
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
