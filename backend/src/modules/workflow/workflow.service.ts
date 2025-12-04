import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { ContestStepType } from '@prisma/client';

@Injectable()
export class WorkflowService {
  constructor(private prisma: PrismaService) {}

  async transitionStep(contestId: string, toStep: ContestStepType, triggeredBy: string) {
    const contest = await this.prisma.contest.findUnique({
      where: { id: contestId },
      include: { steps: true, candidates: true }
    });

    if (!contest) throw new Error('Contest not found');

    const canTransition = await this.validateTransition(contest, toStep);
    if (!canTransition.valid) throw new Error(canTransition.reason);

    await this.prisma.contest.update({
      where: { id: contestId },
      data: { currentStepType: toStep }
    });

    await this.prisma.stepHistory.create({
      data: {
        fromStep: contest.currentStepType,
        toStep,
        triggeredBy,
        contestId,
        reason: 'Automatic transition'
      }
    });

    return { success: true, newStep: toStep };
  }

  private async validateTransition(contest: any, toStep: ContestStepType) {
    const targetStep = contest.steps.find(s => s.type === toStep);
    if (!targetStep) return { valid: false, reason: 'Target step not found' };
    if (targetStep.minCandidates && contest.candidates.length < targetStep.minCandidates) {
      return { valid: false, reason: 'Insufficient candidates' };
    }
    return { valid: true };
  }
}