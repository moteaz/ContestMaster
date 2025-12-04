import { api } from '@/lib/api';
import type { Contest, CreateContestDto, UpdateContestDto, PaginatedResponse, ContestStatistics } from '@/types';

export const contestsService = {
  getAll: (params?: { page?: number; limit?: number; isActive?: boolean; organizerId?: string }) =>
    api.get<PaginatedResponse<Contest>>('/contests', { params }),

  getById: (id: string) =>
    api.get<Contest>(`/contests/${id}`),

  getStatistics: (id: string) =>
    api.get<ContestStatistics>(`/contests/${id}/statistics`),

  create: (data: CreateContestDto) =>
    api.post<Contest>('/contests', data),

  update: (id: string, data: UpdateContestDto) =>
    api.put<Contest>(`/contests/${id}`, data),

  delete: (id: string) =>
    api.delete(`/contests/${id}`),
};
