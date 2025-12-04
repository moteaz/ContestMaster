import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class ContestsService {
  constructor(private prisma: PrismaService) {}

  async create(createContestDto: any) {
    return this.prisma.contest.create({
      data: createContestDto,
      include: { organizer: true, steps: true }
    });
  }

  async findOne(id: string) {
    return this.prisma.contest.findUnique({
      where: { id },
      include: { 
        organizer: true, 
        steps: true, 
        candidates: { include: { user: true } },
        juryMembers: { include: { user: true } }
      }
    });
  }

  async update(id: string, updateContestDto: any) {
    return this.prisma.contest.update({
      where: { id },
      data: updateContestDto
    });
  }

  async remove(id: string) {
    return this.prisma.contest.delete({ where: { id } });
  }

  async findAll(filters?: {
    isActive?: boolean;
    organizerId?: string;
    page?: number;
    limit?: number;
  }) {
    const { isActive, organizerId, page = 1, limit = 10 } = filters || {};
    const where: any = {};
    if (isActive !== undefined) where.isActive = isActive;
    if (organizerId) where.organizerId = organizerId;

    const [data, total] = await Promise.all([
      this.prisma.contest.findMany({
        where,
        include: { organizer: true, _count: { select: { candidates: true } } },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.contest.count({ where }),
    ]);

    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async getContestStatistics(id: string) {
    const contest = await this.findOne(id);
    if (!contest) throw new Error('Contest not found');
    
    const [candidatesCount, qualifiedCount, eliminatedCount, juryCount, submissionsCount] =
      await Promise.all([
        this.prisma.candidate.count({ where: { contestId: id } }),
        this.prisma.candidate.count({ where: { contestId: id, status: 'QUALIFIED' } }),
        this.prisma.candidate.count({ where: { contestId: id, status: 'ELIMINATED' } }),
        this.prisma.juryMember.count({ where: { contestId: id, isActive: true } }),
        this.prisma.submission.count({ where: { candidate: { contestId: id } } }),
      ]);

    return {
      contestId: id,
      title: contest.title,
      statistics: {
        totalCandidates: candidatesCount,
        qualifiedCandidates: qualifiedCount,
        eliminatedCandidates: eliminatedCount,
        activeJuryMembers: juryCount,
        totalSubmissions: submissionsCount,
      },
    };
  }
}