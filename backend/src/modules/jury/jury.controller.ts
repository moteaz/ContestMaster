import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { JuryAssignmentService } from './jury-assignment.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('jury')
@UseGuards(JwtAuthGuard, RolesGuard)
export class JuryController {
  constructor(private readonly juryService: JuryAssignmentService) {}

  @Post(':contestId/assign')
  @Roles(UserRole.ORGANIZER)
  assignJury(@Param('contestId') contestId: string) {
    return this.juryService.assignJuryToContestants(contestId);
  }

  @Get(':contestId/assignments')
  getAssignments(@Param('contestId') contestId: string) {
    return this.juryService.getJuryAssignments(contestId);
  }
}