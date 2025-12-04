import { Module } from '@nestjs/common';
import { RulesController } from './rules.controller';
import { RulesService } from './rules.service';
import { PrismaService } from '../../../prisma/prisma.service';

@Module({
  controllers: [RulesController],
  providers: [RulesService, PrismaService],
  exports: [RulesService]
})
export class RulesModule {}