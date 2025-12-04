import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateContestDto, UpdateContestDto } from './dto';
import { Contest, Prisma } from '@prisma/client';

@Injectable()
export class ContestsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createContestDto: CreateContestDto): Promise<Contest> {
    this.validateDates(new Date(createContestDto.startDate), new Date(createContestDto.endDate));

    return this.prisma.contest.create({
      data: {
        ...createContestDto,
        startDate: new Date(createContestDto.startDate),
        endDate: new Date(createContestDto.endDate),
      },
      include: this.getDefaultIncludes(),
    });
  }

  async findAll(filters?: {
    isActive?: boolean;
    organizerId?: string;
    page?: number;
    limit?: number;
  }) {
    const { isActive, organizerId, page = 1, limit = 10 } = filters || {};
    
    const where: Prisma.ContestWhereInput = {
      ...(isActive !== undefined && { isActive }),
      ...(organizerId && { organizerId }),
    };

    const [contests, total] = await Promise.all([
      this.prisma.contest.findMany({
        where,
        include: {
          organizer: { select: { id: true, firstName: true, lastName: true, email: true } },
          _count: { select: { candidates: true, juryMembers: true } },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.contest.count({ where }),
    ]);

    return {
      data: contests,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<Contest> {
    const contest = await this.prisma.contest.findUnique({
      where: { id },
      include: {
        organizer: { select: { id: true, firstName: true, lastName: true, email: true } },
        steps: { orderBy: { order: 'asc' } },
        candidates: {
          include: {
            user: { select: { id: true, firstName: true, lastName: true, email: true } },
          },
        },
        juryMembers: {
          include: {
            user: { select: { id: true, firstName: true, lastName: true, email: true } },
          },
        },
        _count: {
          select: {
            candidates: true,
            juryMembers: true,
            scoreSheets: true,
            dynamicRules: true,
          },
        },
      },
    });

    if (!contest) {
      throw new NotFoundException(`Contest with ID ${id} not found`);
    }

    return contest;
  }

  async update(id: string, updateContestDto: UpdateContestDto): Promise<Contest> {
    await this.findOne(id); // Verify existence

    if (updateContestDto.startDate && updateContestDto.endDate) {
      this.validateDates(
        new Date(updateContestDto.startDate),
        new Date(updateContestDto.endDate)
      );
    }

    return this.prisma.contest.update({
      where: { id },
      data: {
        ...updateContestDto,
        ...(updateContestDto.startDate && { startDate: new Date(updateContestDto.startDate) }),
        ...(updateContestDto.endDate && { endDate: new Date(updateContestDto.endDate) }),
      },
      include: this.getDefaultIncludes(),
    });
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id); // Verify existence
    await this.prisma.contest.delete({ where: { id } });
  }

  async getContestStatistics(id: string) {
    const contest = await this.findOne(id);

    const [candidatesCount, qualifiedCount, eliminatedCount, juryCount, submissionsCount] =
      await Promise.all([
        this.prisma.candidate.count({ where: { contestId: id } }),
        this.prisma.candidate.count({ where: { contestId: id, status: 'QUALIFIED' } }),
        this.prisma.candidate.count({ where: { contestId: id, status: 'ELIMINATED' } }),
        this.prisma.juryMember.count({ where: { contestId: id, isActive: true } }),
        this.prisma.submission.count({
          where: { candidate: { contestId: id } },
        }),
      ]);

    return {
      contestId: id,
      title: contest.title,
      currentStep: contest.currentStepType,
      statistics: {
        totalCandidates: candidatesCount,
        qualifiedCandidates: qualifiedCount,
        eliminatedCandidates: eliminatedCount,
        activeJuryMembers: juryCount,
        totalSubmissions: submissionsCount,
      },
    };
  }

  private validateDates(startDate: Date, endDate: Date): void {
    if (startDate >= endDate) {
      throw new BadRequestException('Start date must be before end date');
    }

    if (startDate < new Date()) {
      throw new BadRequestException('Start date cannot be in the past');
    }
  }

  private getDefaultIncludes() {
    return {
      organizer: { select: { id: true, firstName: true, lastName: true, email: true } },
      steps: { orderBy: { order: 'asc' as const } },
    };
  }
}