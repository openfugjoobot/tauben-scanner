import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../services/api';
import { pigeonKeys } from './queryKeys';
import type { MatchResponse } from '../../services/api/apiClient.types';

interface MatchRequest {
  image: string; // base64
  threshold?: number;
}

export const useMatchImage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: MatchRequest) =>
      apiClient.post<MatchResponse>('/images/match', {
        photo: data.image,
        threshold: data.threshold
      }),
    onSuccess: (result) => {
      // Prefetch matched pigeon if found
      if (result.pigeon) {
        queryClient.prefetchQuery({
          queryKey: pigeonKeys.detail(result.pigeon.id),
          queryFn: () => result.pigeon,
        });
      }
    },
  });
};
