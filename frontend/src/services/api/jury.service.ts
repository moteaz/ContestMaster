import { api } from '@/lib/api';
import type { JuryAssignment } from '@/types';

export const juryService = {
  assign: (contestId: string) =>
    api.post<JuryAssignment[]>(`/jury/${contestId}/assign`),

  getAssignments: (contestId: string) =>
    api.get<JuryAssignment[]>(`/jury/${contestId}/assignments`),
};
