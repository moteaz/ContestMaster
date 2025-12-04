import { Injectable } from '@nestjs/common';
import { ScoreCalculatorService } from './score-calculator.service';

export interface AnomalyResult {
  scoreId: string;
  reason: string;
  threshold: number;
  actualScore: number;
  averageScore: number;
}

@Injectable()
export class AnomalyDetectorService {
  constructor(private readonly calculator: ScoreCalculatorService) {}

  detectAnomalies(
    scores: Array<{ id: string; totalScore: number | null }>,
    thresholdPercentage: number = 0.4,
  ): AnomalyResult[] {
    const anomalies: AnomalyResult[] = [];
    const scoreValues = scores.map((s) => s.totalScore).filter((s) => s !== null) as number[];

    if (scoreValues.length < 2) return anomalies;

    const mean = this.calculator.calculateAverage(scoreValues);
    const stdDev = this.calculator.calculateStandardDeviation(scoreValues);

    for (const score of scores) {
      if (score.totalScore === null) continue;

      const deviation = Math.abs(score.totalScore - mean) / mean;

      if (deviation > thresholdPercentage) {
        anomalies.push({
          scoreId: score.id,
          reason: `Score deviates ${(deviation * 100).toFixed(1)}% from average`,
          threshold: deviation,
          actualScore: score.totalScore,
          averageScore: mean,
        });
      }
    }

    return anomalies;
  }

  detectOutliers(scores: number[], zScoreThreshold: number = 2.5): number[] {
    if (scores.length < 3) return [];

    const mean = this.calculator.calculateAverage(scores);
    const stdDev = this.calculator.calculateStandardDeviation(scores);

    if (stdDev === 0) return [];

    return scores.filter((score) => {
      const zScore = Math.abs((score - mean) / stdDev);
      return zScore > zScoreThreshold;
    });
  }
}
