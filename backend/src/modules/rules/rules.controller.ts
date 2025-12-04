import { Controller, Post, Param, Body, UseGuards } from '@nestjs/common';
import { RulesService } from './rules.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('rules')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RulesController {
  constructor(private readonly rulesService: RulesService) {}

  @Post(':contestId/execute')
  @Roles(UserRole.ORGANIZER)
  executeRules(
    @Param('contestId') contestId: string,
    @Body() body: { executedBy?: string }
  ) {
    return this.rulesService.executeRules(contestId, body.executedBy);
  }
}