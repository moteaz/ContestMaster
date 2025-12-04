import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { RuleType, CandidateStatus } from '@prisma/client';

@Injectable()
export class RulesService {
  constructor(private prisma: PrismaService) {}

  async executeRules(contestId: string, executedBy: string = 'SYSTEM') {
    const rules = await this.prisma.dynamicRule.findMany({
      where: { contestId, isActive: true },
      orderBy: { order: 'asc' }
    });

    const results: Array<{
      success: boolean;
      affectedCount?: number;
      ruleId?: string;
      error?: string;
    }> = [];
    
    for (const rule of rules) {
      const result = await this.executeRule(rule, executedBy);
      results.push(result);
      
      if (rule.isBlocking && !result.success) break;
    }

    return results;
  }

  private async executeRule(rule: any, executedBy: string) {
    try {
      let affectedCount = 0;
      
      switch (rule.type) {
        case RuleType.AGE_LIMIT:
          affectedCount = await this.executeAgeRule(rule);
          break;
        case RuleType.SUBMISSION_COUNT:
          affectedCount = await this.executeSubmissionRule(rule);
          break;
        case RuleType.CANDIDATE_LIMIT:
          affectedCount = await this.executeCandidateLimitRule(rule);
          break;
      }

      await this.prisma.ruleExecution_Log.create({
        data: {
          ruleId: rule.id,
          executedBy,
          affectedCount,
          success: true
        }
      });

      return { success: true, affectedCount, ruleId: rule.id };
    } catch (error) {
      await this.prisma.ruleExecution_Log.create({
        data: {
          ruleId: rule.id,
          executedBy,
          success: false,
          errorMessage: error.message
        }
      });
      return { success: false, error: error.message };
    }
  }

  private async executeAgeRule(rule: any) {
    const { minAge } = rule.config;
    const result = await this.prisma.candidate.updateMany({
      where: {
        contestId: rule.contestId,
        status: CandidateStatus.REGISTERED,
        user: { age: { lt: minAge } }
      },
      data: {
        status: CandidateStatus.ELIMINATED,
        eliminationReason: `Age below minimum requirement (${minAge})`
      }
    });
    return result.count;
  }

  private async executeSubmissionRule(rule: any) {
    const { minSubmissions } = rule.config;
    const candidates = await this.prisma.candidate.findMany({
      where: { contestId: rule.contestId, status: CandidateStatus.REGISTERED },
      include: { submissions: true }
    });

    let count = 0;
    for (const candidate of candidates) {
      if (candidate.submissions.length < minSubmissions) {
        await this.prisma.candidate.update({
          where: { id: candidate.id },
          data: {
            status: CandidateStatus.ELIMINATED,
            eliminationReason: `Insufficient submissions (${candidate.submissions.length}/${minSubmissions})`
          }
        });
        count++;
      }
    }
    return count;
  }

  private async executeCandidateLimitRule(rule: any) {
    const { maxCandidates } = rule.config;
    const candidates = await this.prisma.candidate.findMany({
      where: { contestId: rule.contestId, status: CandidateStatus.REGISTERED },
      include: { scores: true },
      orderBy: { registrationDate: 'asc' }
    });

    if (candidates.length <= maxCandidates) return 0;

    const toEliminate = candidates.slice(maxCandidates);
    await this.prisma.candidate.updateMany({
      where: { id: { in: toEliminate.map(c => c.id) } },
      data: {
        status: CandidateStatus.ELIMINATED,
        eliminationReason: `Exceeded candidate limit (${maxCandidates})`
      }
    });

    return toEliminate.length;
  }
}