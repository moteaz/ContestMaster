import { Module } from '@nestjs/common';
import { JuryController } from './jury.controller';
import { JuryAssignmentService } from './jury-assignment.service';
import { PrismaService } from '../../../prisma/prisma.service';

@Module({
  controllers: [JuryController],
  providers: [JuryAssignmentService, PrismaService],
  exports: [JuryAssignmentService]
})
export class JuryModule {}