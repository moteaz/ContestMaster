import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { IRuleStrategy, RuleExecutionResult } from '../interfaces/rule-strategy.interface';
import { DynamicRule, RuleType, CandidateStatus } from '@prisma/client';

@Injectable()
export class AgeLimitRuleStrategy implements IRuleStrategy {
  constructor(private readonly prisma: PrismaService) {}

  canHandle(ruleType: string): boolean {
    return ruleType === RuleType.AGE_LIMIT;
  }

  async execute(rule: DynamicRule): Promise<RuleExecutionResult> {
    try {
      const { minAge, maxAge } = rule.config as { minAge?: number; maxAge?: number };

      if (!minAge && !maxAge) {
        return { success: false, affectedCount: 0, error: 'No age limits defined' };
      }

      const where: any = {
        contestId: rule.contestId,
        status: CandidateStatus.REGISTERED,
        user: {},
      };

      if (minAge) where.user.age = { lt: minAge };
      if (maxAge) where.user.age = { ...where.user.age, gt: maxAge };

      const result = await this.prisma.candidate.updateMany({
        where,
        data: {
          status: CandidateStatus.ELIMINATED,
          eliminationReason: `Age requirement not met (${minAge ? `min: ${minAge}` : ''} ${maxAge ? `max: ${maxAge}` : ''})`,
        },
      });

      return { success: true, affectedCount: result.count };
    } catch (error) {
      return { success: false, affectedCount: 0, error: error.message };
    }
  }
}
