import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { IRuleStrategy, RuleExecutionResult } from '../interfaces/rule-strategy.interface';
import { DynamicRule, RuleType, CandidateStatus } from '@prisma/client';

@Injectable()
export class SubmissionCountRuleStrategy implements IRuleStrategy {
  constructor(private readonly prisma: PrismaService) {}

  canHandle(ruleType: string): boolean {
    return ruleType === RuleType.SUBMISSION_COUNT;
  }

  async execute(rule: DynamicRule): Promise<RuleExecutionResult> {
    try {
      const { minSubmissions } = rule.config as { minSubmissions: number };

      if (!minSubmissions) {
        return { success: false, affectedCount: 0, error: 'minSubmissions not defined' };
      }

      const candidates = await this.prisma.candidate.findMany({
        where: { contestId: rule.contestId, status: CandidateStatus.REGISTERED },
        include: { submissions: true },
      });

      let count = 0;
      for (const candidate of candidates) {
        if (candidate.submissions.length < minSubmissions) {
          await this.prisma.candidate.update({
            where: { id: candidate.id },
            data: {
              status: CandidateStatus.ELIMINATED,
              eliminationReason: `Insufficient submissions (${candidate.submissions.length}/${minSubmissions})`,
            },
          });
          count++;
        }
      }

      return { success: true, affectedCount: count };
    } catch (error) {
      return { success: false, affectedCount: 0, error: error.message };
    }
  }
}
