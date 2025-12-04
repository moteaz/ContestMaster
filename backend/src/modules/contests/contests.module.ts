import { Module } from '@nestjs/common';
import { ContestsController } from './contests.controller';
import { ContestsService } from './contests.service';
import { PrismaService } from '../../../prisma/prisma.service';

@Module({
  controllers: [ContestsController],
  providers: [ContestsService, PrismaService],
  exports: [ContestsService]
})
export class ContestsModule {}