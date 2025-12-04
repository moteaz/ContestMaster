import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { IRuleStrategy } from './interfaces/rule-strategy.interface';
import { AgeLimitRuleStrategy } from './strategies/age-limit-rule.strategy';
import { SubmissionCountRuleStrategy } from './strategies/submission-count-rule.strategy';
import { CandidateLimitRuleStrategy } from './strategies/candidate-limit-rule.strategy';

@Injectable()
export class RulesService {
  private strategies: IRuleStrategy[];

  constructor(
    private readonly prisma: PrismaService,
    ageLimitStrategy: AgeLimitRuleStrategy,
    submissionCountStrategy: SubmissionCountRuleStrategy,
    candidateLimitStrategy: CandidateLimitRuleStrategy,
  ) {
    this.strategies = [ageLimitStrategy, submissionCountStrategy, candidateLimitStrategy];
  }

  async executeRules(contestId: string, executedBy: string = 'SYSTEM') {
    const contest = await this.prisma.contest.findUnique({ where: { id: contestId } });
    
    if (!contest) {
      throw new NotFoundException(`Contest ${contestId} not found`);
    }

    const rules = await this.prisma.dynamicRule.findMany({
      where: { contestId, isActive: true },
      orderBy: { order: 'asc' },
    });

    if (rules.length === 0) {
      return { message: 'No active rules to execute', results: [] };
    }

    const results: any[] = [];

    for (const rule of rules) {
      const result = await this.executeRule(rule, executedBy);
      results.push(result);

      if (rule.isBlocking && !result.success) {
        break;
      }
    }

    return {
      contestId,
      totalRules: rules.length,
      executedRules: results.length,
      results,
    };
  }

  private async executeRule(rule: any, executedBy: string) {
    const strategy = this.strategies.find((s) => s.canHandle(rule.type));

    if (!strategy) {
      const error = `No strategy found for rule type: ${rule.type}`;
      await this.logExecution(rule.id, executedBy, false, 0, error);
      return { ruleId: rule.id, ruleName: rule.name, success: false, error };
    }

    const result = await strategy.execute(rule);

    await this.logExecution(
      rule.id,
      executedBy,
      result.success,
      result.affectedCount,
      result.error,
    );

    return {
      ruleId: rule.id,
      ruleName: rule.name,
      ruleType: rule.type,
      ...result,
    };
  }

  private async logExecution(
    ruleId: string,
    executedBy: string,
    success: boolean,
    affectedCount: number,
    errorMessage?: string,
  ) {
    await this.prisma.ruleExecution_Log.create({
      data: {
        ruleId,
        executedBy,
        success,
        affectedCount,
        errorMessage,
      },
    });
  }

  async getRuleExecutionHistory(contestId: string) {
    const rules = await this.prisma.dynamicRule.findMany({
      where: { contestId },
      include: {
        executions: {
          orderBy: { executedAt: 'desc' },
          take: 10,
        },
      },
    });

    return rules.map((rule) => ({
      ruleId: rule.id,
      ruleName: rule.name,
      ruleType: rule.type,
      isActive: rule.isActive,
      executionHistory: rule.executions,
    }));
  }
}
