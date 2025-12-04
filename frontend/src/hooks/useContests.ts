import { useEffect } from 'react';
import { contestsService } from '@/services/api';
import { useApi } from './useApi';
import type { PaginatedResponse, Contest } from '@/types';

export function useContests(params?: { page?: number; limit?: number; isActive?: boolean; organizerId?: string }) {
  const { data, loading, error, execute } = useApi<PaginatedResponse<Contest>, [typeof params?]>(
    (p) => contestsService.getAll(p)
  );

  useEffect(() => {
    execute(params);
  }, [params?.page, params?.limit, params?.isActive, params?.organizerId]);

  return {
    contests: data?.data || [],
    meta: data?.meta,
    loading,
    error,
    refetch: () => execute(params),
  };
}

export function useContest(id: string) {
  const { data, loading, error, execute } = useApi(() => contestsService.getById(id));

  useEffect(() => {
    if (id) execute();
  }, [id]);

  return { contest: data, loading, error, refetch: execute };
}
