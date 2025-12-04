import { DynamicRule } from '@prisma/client';

export interface RuleExecutionResult {
  success: boolean;
  affectedCount: number;
  error?: string;
}

export interface IRuleStrategy {
  execute(rule: DynamicRule): Promise<RuleExecutionResult>;
  canHandle(ruleType: string): boolean;
}
