import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import { ContestsService } from './contests.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { CreateContestDto, UpdateContestDto } from './dto';

@Controller('contests')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ContestsController {
  constructor(private readonly contestsService: ContestsService) {}

  @Post()
  @Roles(UserRole.ORGANIZER, UserRole.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  create(@Body(ValidationPipe) createContestDto: CreateContestDto) {
    return this.contestsService.create(createContestDto);
  }

  @Get()
  findAll(
    @Query('isActive') isActive?: string,
    @Query('organizerId') organizerId?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.contestsService.findAll({
      isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
      organizerId,
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contestsService.findOne(id);
  }

  @Get(':id/statistics')
  getStatistics(@Param('id') id: string) {
    return this.contestsService.getContestStatistics(id);
  }

  @Put(':id')
  @Roles(UserRole.ORGANIZER, UserRole.ADMIN)
  update(@Param('id') id: string, @Body(ValidationPipe) updateContestDto: UpdateContestDto) {
    return this.contestsService.update(id, updateContestDto);
  }

  @Delete(':id')
  @Roles(UserRole.ORGANIZER, UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.contestsService.remove(id);
  }
}
