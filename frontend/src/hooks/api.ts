/**
 * T4 API Layer - React Query Hooks
 * Custom hooks for data fetching with React Query
 */

import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
  UseQueryOptions,
  UseMutationOptions,
} from '@tanstack/react-query';
import {
  fetchPigeons,
  fetchPigeon,
  createPigeon,
  matchImage,
  uploadImage,
  fetchSightings,
  createSighting,
} from '../services/api';
import {
  PigeonsListResponse,
  PigeonDetail,
  CreatePigeonRequest,
  CreateSightingRequest,
  MatchRequest,
  MatchResponse,
  ImageUploadResponse,
  PigeonsQueryParams,
  SightingsQueryParams,
} from '../types';

// ==================== Query Keys ====================

export const queryKeys = {
  pigeons: {
    all: ['pigeons'] as const,
    list: (params: PigeonsQueryParams) => ['pigeons', 'list', params] as const,
    detail: (id: string) => ['pigeons', 'detail', id] as const,
  },
  sightings: {
    all: ['sightings'] as const,
    list: (params: SightingsQueryParams) => ['sightings', 'list', params] as const,
  },
  match: {
    recent: ['match', 'recent'] as const,
  },
  upload: {
    history: ['upload', 'history'] as const,
  },
};

// ==================== Pigeons Hooks ====================

/**
 * Hook: Get paginated list of pigeons
 * GET /api/pigeons
 */
export const usePigeons = (
  params?: PigeonsQueryParams,
  options?: UseQueryOptions<PigeonsListResponse, Error>
) => {
  const queryParams = {
    page: params?.page || 1,
    limit: params?.limit || 20,
    search: params?.search,
  };

  return useQuery<PigeonsListResponse, Error>({
    queryKey: queryKeys.pigeons.list(queryParams),
    queryFn: () => fetchPigeons(queryParams),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    ...options,
  });
};

/**
 * Hook: Get single pigeon by ID
 * GET /api/pigeons/:id
 */
export const usePigeon = (
  id: string | undefined,
  options?: UseQueryOptions<PigeonDetail, Error>
) => {
  return useQuery<PigeonDetail, Error>({
    queryKey: queryKeys.pigeons.detail(id || ''),
    queryFn: () => fetchPigeon(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    ...options,
  });
};

/**
 * Hook: Create a new pigeon
 * POST /api/pigeons
 */
export const useCreatePigeon = (
  options?: UseMutationOptions<any, Error, CreatePigeonRequest>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPigeon,
    onSuccess: () => {
      // Invalidate and refetch pigeons list
      queryClient.invalidateQueries({ queryKey: queryKeys.pigeons.all });
    },
    ...options,
  });
};

// ==================== Match Hooks ====================

/**
 * Hook: Match pigeon by image
 * POST /api/images/match
 */
export const useMatchImage = (
  options?: UseMutationOptions<MatchResponse, Error, MatchRequest>
) => {
  return useMutation({
    mutationFn: matchImage,
    ...options,
  });
};

// ==================== Upload Hooks ====================

/**
 * Hook: Upload image
 * POST /api/images/upload
 */
export const useUploadImage = (
  options?: UseMutationOptions<
    ImageUploadResponse, 
    Error, 
    { formData: FormData; onProgress?: (progress: number) => void }
  >
) => {
  return useMutation({
    mutationFn: async ({ formData, onProgress }) => {
      return await uploadImage(formData, onProgress);
    },
    ...options,
  });
};

// ==================== Sighting Hooks ====================

/**
 * Hook: Get paginated list of sightings
 * GET /api/sightings
 */
export const useSightings = (
  params?: SightingsQueryParams,
  options?: UseQueryOptions<any, Error>
) => {
  const queryParams = {
    page: params?.page || 1,
    limit: params?.limit || 20,
    pigeon_id: params?.pigeon_id,
  };

  return useQuery<any, Error>({
    queryKey: queryKeys.sightings.list(queryParams),
    queryFn: () => fetchSightings(queryParams),
    staleTime: 2 * 60 * 1000, // 2 minutes (sightings change more frequently)
    gcTime: 5 * 60 * 1000,
    retry: 2,
    ...options,
  });
};

/**
 * Hook: Create a new sighting
 * POST /api/sightings
 */
export const useCreateSighting = (
  options?: UseMutationOptions<any, Error, CreateSightingRequest>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSighting,
    onSuccess: () => {
      // Invalidate sightings and pigeon detail
      queryClient.invalidateQueries({ queryKey: queryKeys.sightings.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.pigeons.all });
    },
    ...options,
  });
};

// ==================== Export QueryClient / Provider ====================

export { QueryClient, QueryClientProvider };

/**
 * Create a configured QueryClient
 */
export const createQueryClient = (): QueryClient => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
        retry: 2,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        refetchOnMount: 'always',
      },
      mutations: {
        retry: 1,
      },
    },
  });
};

export default createQueryClient;
