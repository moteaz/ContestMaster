import { Controller, Post, Body, Param, UseGuards } from '@nestjs/common';
import { WorkflowService } from './workflow.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole, ContestStepType } from '@prisma/client';

@Controller('workflow')
@UseGuards(JwtAuthGuard, RolesGuard)
export class WorkflowController {
  constructor(private readonly workflowService: WorkflowService) {}

  @Post(':contestId/transition')
  @Roles(UserRole.ORGANIZER)
  transitionStep(
    @Param('contestId') contestId: string,
    @Body() body: { toStep: ContestStepType; triggeredBy: string }
  ) {
    return this.workflowService.transitionStep(contestId, body.toStep, body.triggeredBy);
  }
}