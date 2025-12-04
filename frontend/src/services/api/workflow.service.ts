import { api } from '@/lib/api';
import type { TransitionResponse, WorkflowStep } from '@/types';

export const workflowService = {
  transition: (contestId: string, toStep: WorkflowStep, triggeredBy: string) =>
    api.post<TransitionResponse>(`/workflow/${contestId}/transition`, { toStep, triggeredBy }),
};
