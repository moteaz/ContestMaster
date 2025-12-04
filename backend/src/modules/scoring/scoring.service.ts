import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { ScoreCalculatorService } from './services/score-calculator.service';
import { AnomalyDetectorService } from './services/anomaly-detector.service';

@Injectable()
export class ScoringService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly calculator: ScoreCalculatorService,
    private readonly anomalyDetector: AnomalyDetectorService,
  ) {}

  async calculateScores(contestId: string) {
    const candidates = await this.getCandidatesWithScores(contestId);

    if (candidates.length === 0) {
      throw new NotFoundException(`No candidates found for contest ${contestId}`);
    }

    const results: any[] = [];

    for (const candidate of candidates) {
      if (candidate.scores.length === 0) continue;

      const calculation = await this.calculateCandidateScore(candidate, contestId);
      results.push(calculation);
    }

    return {
      contestId,
      totalCandidates: candidates.length,
      calculatedScores: results.length,
      results,
    };
  }

  async getContestResults(contestId: string) {
    const calculations = await this.prisma.scoreCalculation.findMany({
      where: { contestId },
      include: {
        candidate: {
          include: {
            user: {
              select: { id: true, firstName: true, lastName: true, email: true },
            },
          },
        },
      },
      orderBy: { result: 'desc' },
    });

    return {
      contestId,
      totalResults: calculations.length,
      rankings: calculations.map((calc, index) => ({
        rank: index + 1,
        candidateId: calc.candidateId,
        candidateName: `${calc.candidate.user.firstName} ${calc.candidate.user.lastName}`,
        finalScore: calc.result,
        calculationType: calc.calculationType,
        calculatedAt: calc.calculatedAt,
      })),
    };
  }

  private async getCandidatesWithScores(contestId: string) {
    return this.prisma.candidate.findMany({
      where: { contestId },
      include: {
        scores: {
          include: {
            criteriaScores: { include: { criteria: true } },
            scoreSheet: { include: { criteria: true } },
          },
        },
      },
    });
  }

  private async calculateCandidateScore(candidate: any, contestId: string) {
    const scores = candidate.scores;
    const allScores = scores.map((s) => s.totalScore).filter((s) => s !== null);

    if (allScores.length === 0) {
      return { candidateId: candidate.id, finalScore: 0, anomalies: [] };
    }

    const scoreData = scores.map((s) => ({
      totalScore: s.totalScore,
      criteriaScores: s.criteriaScores.map((cs) => ({
        value: cs.value,
        weight: cs.criteria.weight,
      })),
    }));

    const weightedScore = this.calculator.calculateWeightedAverage(scoreData);
    const medianScore = this.calculator.calculateMedian(allScores);

    const anomalies = this.anomalyDetector.detectAnomalies(
      scores.map((s) => ({ id: s.id, totalScore: s.totalScore })),
    );

    await this.updateScoresWithAnomalies(anomalies);

    await this.prisma.scoreCalculation.create({
      data: {
        candidateId: candidate.id,
        contestId,
        calculationType: 'weighted_average',
        formula: { weights: this.extractWeights(scores) },
        result: weightedScore,
      },
    });

    return {
      candidateId: candidate.id,
      finalScore: weightedScore,
      medianScore,
      weightedScore,
      anomaliesCount: anomalies.length,
      anomalies,
    };
  }

  private async updateScoresWithAnomalies(anomalies: any[]) {
    for (const anomaly of anomalies) {
      await this.prisma.score.update({
        where: { id: anomaly.scoreId },
        data: {
          isAnomaly: true,
          anomalyReason: anomaly.reason,
          anomalyThreshold: anomaly.threshold,
          needsReview: true,
        },
      });
    }
  }

  private extractWeights(scores: any[]): Record<string, number> {
    const weights: Record<string, number> = {};

    for (const score of scores) {
      for (const criteriaScore of score.criteriaScores) {
        weights[criteriaScore.criteria.name] = criteriaScore.criteria.weight;
      }
    }

    return weights;
  }
}
