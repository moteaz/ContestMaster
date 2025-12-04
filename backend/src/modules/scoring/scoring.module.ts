import { Module } from '@nestjs/common';
import { ScoringController } from './scoring.controller';
import { ScoringService } from './scoring.service';
import { ScoreCalculatorService } from './services/score-calculator.service';
import { AnomalyDetectorService } from './services/anomaly-detector.service';
import { PrismaService } from '../../../prisma/prisma.service';

@Module({
  controllers: [ScoringController],
  providers: [
    ScoringService,
    ScoreCalculatorService,
    AnomalyDetectorService,
    PrismaService,
  ],
  exports: [ScoringService],
})
export class ScoringModule {}