import { api } from '@/lib/api';
import type { RulesExecutionResponse } from '@/types';

export const rulesService = {
  execute: (contestId: string, executedBy?: string) =>
    api.post<RulesExecutionResponse>(`/rules/${contestId}/execute`, { executedBy }),
};
