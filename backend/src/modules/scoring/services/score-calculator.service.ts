import { Injectable } from '@nestjs/common';

export interface ScoreData {
  totalScore: number | null;
  criteriaScores: Array<{ value: number; weight: number }>;
}

@Injectable()
export class ScoreCalculatorService {
  calculateWeightedAverage(scores: ScoreData[]): number {
    let totalWeightedScore = 0;
    let totalWeight = 0;

    for (const score of scores) {
      if (score.totalScore === null) continue;

      const criteriaWeight = score.criteriaScores.reduce((sum, cs) => sum + cs.weight, 0);
      totalWeightedScore += score.totalScore * criteriaWeight;
      totalWeight += criteriaWeight;
    }

    return totalWeight > 0 ? totalWeightedScore / totalWeight : 0;
  }

  calculateMedian(scores: number[]): number {
    if (scores.length === 0) return 0;

    const sorted = [...scores].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);

    return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
  }

  calculateAverage(scores: number[]): number {
    if (scores.length === 0) return 0;
    return scores.reduce((sum, score) => sum + score, 0) / scores.length;
  }

  calculateStandardDeviation(scores: number[]): number {
    if (scores.length < 2) return 0;

    const mean = this.calculateAverage(scores);
    const squaredDiffs = scores.map((score) => Math.pow(score - mean, 2));
    const variance = squaredDiffs.reduce((sum, diff) => sum + diff, 0) / scores.length;

    return Math.sqrt(variance);
  }
}
