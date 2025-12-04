import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { IRuleStrategy, RuleExecutionResult } from '../interfaces/rule-strategy.interface';
import { DynamicRule, RuleType, CandidateStatus } from '@prisma/client';

@Injectable()
export class CandidateLimitRuleStrategy implements IRuleStrategy {
  constructor(private readonly prisma: PrismaService) {}

  canHandle(ruleType: string): boolean {
    return ruleType === RuleType.CANDIDATE_LIMIT;
  }

  async execute(rule: DynamicRule): Promise<RuleExecutionResult> {
    try {
      const { maxCandidates } = rule.config as { maxCandidates: number };

      if (!maxCandidates) {
        return { success: false, affectedCount: 0, error: 'maxCandidates not defined' };
      }

      const candidates = await this.prisma.candidate.findMany({
        where: { contestId: rule.contestId, status: CandidateStatus.REGISTERED },
        include: { scores: true },
        orderBy: { registrationDate: 'asc' },
      });

      if (candidates.length <= maxCandidates) {
        return { success: true, affectedCount: 0 };
      }

      const toEliminate = candidates.slice(maxCandidates);
      
      await this.prisma.candidate.updateMany({
        where: { id: { in: toEliminate.map((c) => c.id) } },
        data: {
          status: CandidateStatus.ELIMINATED,
          eliminationReason: `Exceeded candidate limit (${maxCandidates})`,
        },
      });

      return { success: true, affectedCount: toEliminate.length };
    } catch (error) {
      return { success: false, affectedCount: 0, error: error.message };
    }
  }
}
