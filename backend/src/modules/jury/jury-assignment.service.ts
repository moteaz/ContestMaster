import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CandidateStatus } from '@prisma/client';

@Injectable()
export class JuryAssignmentService {
  constructor(private prisma: PrismaService) {}

  async assignJuryToContestants(contestId: string) {
    const [juryMembers, candidates] = await Promise.all([
      this.prisma.juryMember.findMany({
        where: { contestId, isActive: true },
        include: { user: true, assignments: true }
      }),
      this.prisma.candidate.findMany({
        where: { contestId, status: CandidateStatus.QUALIFIED },
        include: { user: true }
      })
    ]);

    if (juryMembers.length === 0 || candidates.length === 0) {
      throw new Error('No jury members or candidates available');
    }

    const assignments: Array<{
      juryMemberId: string;
      candidateId: string;
      workloadScore: number;
    }> = [];
    
    for (const candidate of candidates) {
      const availableJury = juryMembers.filter(jury => 
        this.canAssign(jury, candidate) && 
        jury.currentLoad < (jury.maxCandidates || 10)
      );

      if (availableJury.length === 0) {
        throw new Error(`No available jury for candidate ${candidate.id}`);
      }

      const selectedJury = availableJury.reduce((min, jury) => 
        jury.currentLoad < min.currentLoad ? jury : min
      );

      assignments.push({
        juryMemberId: selectedJury.id,
        candidateId: candidate.id,
        workloadScore: this.calculateWorkloadScore(selectedJury, candidate)
      });

      selectedJury.currentLoad++;
    }

    await this.prisma.juryAssignment.createMany({
      data: assignments
    });

    for (const jury of juryMembers) {
      await this.prisma.juryMember.update({
        where: { id: jury.id },
        data: { currentLoad: jury.currentLoad }
      });
    }

    return assignments;
  }

  private canAssign(jury: any, candidate: any): boolean {
    // Check conflict of interest - same institution
    if (jury.user.institution && candidate.user.institution) {
      if (jury.conflictInstitutions.includes(candidate.user.institution)) {
        return false;
      }
    }
    
    // Check if already assigned
    const existingAssignment = jury.assignments.find(
      a => a.candidateId === candidate.id && a.isActive
    );
    
    return !existingAssignment;
  }

  private calculateWorkloadScore(jury: any, candidate: any): number {
    // Simple workload calculation - can be enhanced
    return jury.currentLoad + 1;
  }

  async getJuryAssignments(contestId: string) {
    return this.prisma.juryAssignment.findMany({
      where: {
        juryMember: { contestId },
        isActive: true
      },
      include: {
        juryMember: { include: { user: true } },
        candidate: { include: { user: true } }
      }
    });
  }
}