import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { ContestsModule } from './modules/contests/contests.module';
import { JuryModule } from './modules/jury/jury.module';
import { ScoringModule } from './modules/scoring/scoring.module';
import { WorkflowModule } from './modules/workflow/workflow.module';
import { RulesModule } from './modules/rules/rules.module';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    AuthModule,
    ContestsModule,
    JuryModule,
    ScoringModule,
    WorkflowModule,
    RulesModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
