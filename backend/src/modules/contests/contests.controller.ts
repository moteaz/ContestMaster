import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ContestsService } from './contests.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('contests')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ContestsController {
  constructor(private readonly contestsService: ContestsService) {}

  @Post()
  @Roles(UserRole.ORGANIZER)
  create(@Body() createContestDto: any) {
    return this.contestsService.create(createContestDto);
  }

  @Get()
  findAll() {
    return this.contestsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contestsService.findOne(id);
  }

  @Put(':id')
  @Roles(UserRole.ORGANIZER)
  update(@Param('id') id: string, @Body() updateContestDto: any) {
    return this.contestsService.update(id, updateContestDto);
  }

  @Delete(':id')
  @Roles(UserRole.ORGANIZER)
  remove(@Param('id') id: string) {
    return this.contestsService.remove(id);
  }
}