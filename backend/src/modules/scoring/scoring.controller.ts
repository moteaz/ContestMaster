import { Controller, Get, Post, Param, UseGuards } from '@nestjs/common';
import { ScoringService } from './scoring.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('scoring')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ScoringController {
  constructor(private readonly scoringService: ScoringService) {}

  @Post(':contestId/calculate')
  @Roles(UserRole.ORGANIZER, UserRole.JURY_MEMBER)
  calculateScores(@Param('contestId') contestId: string) {
    return this.scoringService.calculateScores(contestId);
  }

  @Get(':contestId/results')
  getResults(@Param('contestId') contestId: string) {
    return this.scoringService.getContestResults(contestId);
  }
}