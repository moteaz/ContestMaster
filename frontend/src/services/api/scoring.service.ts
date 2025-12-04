import { api } from '@/lib/api';
import type { ScoringCalculationResponse, ContestResultsResponse } from '@/types';

export const scoringService = {
  calculate: (contestId: string) =>
    api.post<ScoringCalculationResponse>(`/scoring/${contestId}/calculate`),

  getResults: (contestId: string) =>
    api.get<ContestResultsResponse>(`/scoring/${contestId}/results`),
};
