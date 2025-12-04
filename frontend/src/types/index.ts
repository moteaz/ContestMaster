// User & Auth Types
export type UserRole = 'ORGANIZER' | 'CANDIDATE' | 'JURY_MEMBER' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  age?: number;
  institution?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface RegisterDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  age?: number;
  institution?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

// Contest Types
export type WorkflowStep = 'DRAFT' | 'REGISTRATION' | 'PRE_SELECTION' | 'JURY_EVALUATION' | 'RESULT';

export interface Contest {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  maxCandidates: number;
  autoTransition: boolean;
  isActive: boolean;
  currentStep: WorkflowStep;
  organizerId: string;
  organizer?: User;
  createdAt: string;
  updatedAt: string;
  _count?: {
    candidates: number;
    juryMembers: number;
    submissions: number;
  };
}

export interface CreateContestDto {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  maxCandidates: number;
  autoTransition?: boolean;
  organizerId: string;
}

export interface UpdateContestDto {
  title?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  maxCandidates?: number;
  autoTransition?: boolean;
  isActive?: boolean;
}

export interface ContestStatistics {
  contestId: string;
  title: string;
  currentStep: WorkflowStep;
  statistics: {
    totalCandidates: number;
    qualifiedCandidates: number;
    eliminatedCandidates: number;
    activeJuryMembers: number;
    totalSubmissions: number;
  };
}

// Pagination
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

// Workflow
export interface TransitionDto {
  toStep: WorkflowStep;
  triggeredBy: string;
}

export interface TransitionResponse {
  success: boolean;
  newStep: WorkflowStep;
}

// Rules
export interface RuleExecutionResult {
  ruleId: string;
  ruleName: string;
  ruleType: string;
  success: boolean;
  affectedCount: number;
}

export interface RulesExecutionResponse {
  contestId: string;
  totalRules: number;
  executedRules: number;
  results: RuleExecutionResult[];
}

// Jury
export interface JuryAssignment {
  id: string;
  juryMemberId: string;
  candidateId: string;
  contestId: string;
  assignedAt: string;
  isActive: boolean;
  workloadScore?: number;
  juryMember?: {
    id: string;
    user: User;
  };
  candidate?: {
    id: string;
    user: User;
  };
}

// Scoring
export interface CandidateScore {
  candidateId: string;
  candidateName?: string;
  finalScore: number;
  medianScore?: number;
  weightedScore?: number;
  anomaliesCount: number;
  anomalies: any[];
}

export interface ScoringCalculationResponse {
  contestId: string;
  totalCandidates: number;
  calculatedScores: number;
  results: CandidateScore[];
}

export interface ContestRanking {
  rank: number;
  candidateId: string;
  candidateName: string;
  finalScore: number;
  calculationType: string;
  calculatedAt: string;
}

export interface ContestResultsResponse {
  contestId: string;
  totalResults: number;
  rankings: ContestRanking[];
}

// API Error
export interface ApiError {
  statusCode: number;
  message: string | string[];
  error?: string;
}
