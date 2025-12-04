import { Module } from '@nestjs/common';
import { RulesController } from './rules.controller';
import { RulesService } from './rules.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { AgeLimitRuleStrategy } from './strategies/age-limit-rule.strategy';
import { SubmissionCountRuleStrategy } from './strategies/submission-count-rule.strategy';
import { CandidateLimitRuleStrategy } from './strategies/candidate-limit-rule.strategy';

@Module({
  controllers: [RulesController],
  providers: [
    RulesService,
    AgeLimitRuleStrategy,
    SubmissionCountRuleStrategy,
    CandidateLimitRuleStrategy,
    PrismaService,
  ],
  exports: [RulesService],
})
export class RulesModule {}