import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class ScoringService {
  constructor(private prisma: PrismaService) {}

  async calculateScores(contestId: string) {
    const candidates = await this.prisma.candidate.findMany({
      where: { contestId },
      include: {
        scores: {
          include: {
            criteriaScores: { include: { criteria: true } },
            scoreSheet: { include: { criteria: true } }
          }
        }
      }
    });

    const results: Array<{
      candidateId: string;
      finalScore: number;
      medianScore?: number;
      weightedScore?: number;
      anomalies: any[];
      weights?: any;
    }> = [];
    
    for (const candidate of candidates) {
      if (candidate.scores.length === 0) continue;

      const calculation = await this.calculateCandidateScore(candidate);
      results.push(calculation);

      // Store calculation
      await this.prisma.scoreCalculation.create({
        data: {
          candidateId: candidate.id,
          contestId,
          calculationType: 'weighted_average',
          formula: { weights: calculation.weights },
          result: calculation.finalScore
        }
      });
    }

    return results;
  }

  private async calculateCandidateScore(candidate: any) {
    const scores = candidate.scores;
    const allScores = scores.map(s => s.totalScore).filter(s => s !== null);
    
    if (allScores.length === 0) {
      return { candidateId: candidate.id, finalScore: 0, anomalies: [] };
    }

    // Calculate weighted average
    const weightedScore = this.calculateWeightedAverage(scores);
    
    // Calculate median
    const medianScore = this.calculateMedian(allScores);
    
    // Detect anomalies
    const anomalies = this.detectAnomalies(scores);
    
    // Update scores with anomaly detection
    for (const anomaly of anomalies) {
      await this.prisma.score.update({
        where: { id: anomaly.scoreId },
        data: {
          isAnomaly: true,
          anomalyReason: anomaly.reason,
          anomalyThreshold: anomaly.threshold,
          needsReview: true
        }
      });
    }

    return {
      candidateId: candidate.id,
      finalScore: weightedScore,
      medianScore,
      weightedScore,
      anomalies,
      weights: this.extractWeights(scores)
    };
  }

  private calculateWeightedAverage(scores: any[]): number {
    let totalWeightedScore = 0;
    let totalWeight = 0;

    for (const score of scores) {
      if (score.totalScore === null) continue;
      
      const criteriaWeights = score.criteriaScores.reduce((sum, cs) => 
        sum + cs.criteria.weight, 0
      );
      
      totalWeightedScore += score.totalScore * criteriaWeights;
      totalWeight += criteriaWeights;
    }

    return totalWeight > 0 ? totalWeightedScore / totalWeight : 0;
  }

  private calculateMedian(scores: number[]): number {
    const sorted = [...scores].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    
    return sorted.length % 2 === 0
      ? (sorted[mid - 1] + sorted[mid]) / 2
      : sorted[mid];
  }

  private detectAnomalies(scores: any[]): Array<{
    scoreId: string;
    reason: string;
    threshold: number;
    actualScore: number;
    averageScore: number;
  }> {
    const anomalies: Array<{
      scoreId: string;
      reason: string;
      threshold: number;
      actualScore: number;
      averageScore: number;
    }> = [];
    
    const scoreValues = scores.map(s => s.totalScore).filter(s => s !== null);
    
    if (scoreValues.length < 2) return anomalies;

    const mean = scoreValues.reduce((sum, score) => sum + score, 0) / scoreValues.length;
    const threshold = 0.4;

    for (const score of scores) {
      if (score.totalScore === null) continue;
      
      const deviation = Math.abs(score.totalScore - mean) / mean;
      
      if (deviation > threshold) {
        anomalies.push({
          scoreId: score.id,
          reason: `Score deviates ${(deviation * 100).toFixed(1)}% from average`,
          threshold: deviation,
          actualScore: score.totalScore,
          averageScore: mean
        });
      }
    }

    return anomalies;
  }

  private extractWeights(scores: any[]): any {
    const weights = {};
    
    for (const score of scores) {
      for (const criteriaScore of score.criteriaScores) {
        weights[criteriaScore.criteria.name] = criteriaScore.criteria.weight;
      }
    }
    
    return weights;
  }

  async getContestResults(contestId: string) {
    return this.prisma.scoreCalculation.findMany({
      where: { contestId },
      include: {
        candidate: {
          include: { user: true }
        }
      },
      orderBy: { result: 'desc' }
    });
  }
}