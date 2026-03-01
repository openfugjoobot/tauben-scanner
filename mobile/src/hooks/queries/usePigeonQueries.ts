import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../services/api';
import { pigeonKeys } from './queryKeys';
import type { Pigeon, CreatePigeonRequest } from '../../services/api/apiClient.types';

interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
}

interface PigeonsResponse {
  pigeons: Pigeon[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Fetch all pigeons (paginated)
export const usePigeons = (params: PaginationParams = {}) => {
  const { page = 1, limit = 20, search } = params;
  
  return useQuery({
    queryKey: pigeonKeys.list({ page, limit, search }),
    queryFn: async () => {
      const searchParams = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        ...(search && { search }),
      });
      return apiClient.get<PigeonsResponse>(`/api/pigeons?${searchParams}`);
    },
  });
};

// Fetch single pigeon
export const usePigeon = (id: string) => {
  return useQuery({
    queryKey: pigeonKeys.detail(id),
    queryFn: () => apiClient.get<Pigeon>(`/api/pigeons/${id}`),
    enabled: !!id,
  });
};

// Create pigeon
export const useCreatePigeon = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreatePigeonRequest) =>
      apiClient.post<Pigeon>('/api/pigeons', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pigeonKeys.lists() });
    },
  });
};

// Update pigeon
export const useUpdatePigeon = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreatePigeonRequest> }) =>
      apiClient.put<Pigeon>(`/api/pigeons/${id}`, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: pigeonKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: pigeonKeys.lists() });
    },
  });
};

// Delete pigeon
export const useDeletePigeon = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`/api/pigeons/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pigeonKeys.lists() });
    },
  });
};
