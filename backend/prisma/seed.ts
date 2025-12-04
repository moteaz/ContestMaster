import { PrismaClient, UserRole, ContestStepType, RuleType, RuleExecution } from '../generated/prisma';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Create users
  const organizer = await prisma.user.create({
    data: {
      email: 'organizer@contestmaster.com',
      firstName: 'John',
      lastName: 'Organizer',
      role: UserRole.ORGANIZER,
      age: 35,
      institution: 'Contest Organization Inc.',
    },
  });

  const jury1 = await prisma.user.create({
    data: {
      email: 'jury1@contestmaster.com',
      firstName: 'Jane',
      lastName: 'Expert',
      role: UserRole.JURY_MEMBER,
      age: 42,
      institution: 'University of Excellence',
    },
  });

  const candidate1 = await prisma.user.create({
    data: {
      email: 'candidate1@contestmaster.com',
      firstName: 'Alice',
      lastName: 'Participant',
      role: UserRole.CANDIDATE,
      age: 22,
      institution: 'Student University',
    },
  });

  // Create a contest
  const contest = await prisma.contest.create({
    data: {
      title: 'Innovation Challenge 2024',
      description: 'A contest for innovative solutions in technology',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-06-30'),
      maxCandidates: 100,
      organizerId: organizer.id,
    },
  });

  // Create contest steps
  const steps = [
    { type: ContestStepType.DRAFT, name: 'Draft', order: 1 },
    { type: ContestStepType.REGISTRATION, name: 'Registration', order: 2 },
    { type: ContestStepType.PRE_SELECTION, name: 'Pre-selection', order: 3 },
    { type: ContestStepType.JURY_EVALUATION, name: 'Jury Evaluation', order: 4 },
    { type: ContestStepType.RESULT, name: 'Results', order: 5 },
  ];

  for (const step of steps) {
    await prisma.contestStep.create({
      data: {
        ...step,
        contestId: contest.id,
        isActive: step.order === 1,
      },
    });
  }

  // Create dynamic rules
  await prisma.dynamicRule.create({
    data: {
      name: 'Age Limit Rule',
      description: 'Eliminate candidates under 18',
      type: RuleType.AGE_LIMIT,
      execution: RuleExecution.AUTOMATIC,
      isBlocking: true,
      order: 1,
      contestId: contest.id,
      config: {
        minAge: 18,
      },
    },
  });

  await prisma.dynamicRule.create({
    data: {
      name: 'Submission Count Rule',
      description: 'Eliminate candidates with less than 2 submissions',
      type: RuleType.SUBMISSION_COUNT,
      execution: RuleExecution.AUTOMATIC,
      isBlocking: true,
      order: 2,
      contestId: contest.id,
      config: {
        minSubmissions: 2,
      },
    },
  });

  // Create score sheet
  const scoreSheet = await prisma.scoreSheet.create({
    data: {
      name: 'Innovation Evaluation',
      description: 'Criteria for evaluating innovation projects',
      contestId: contest.id,
    },
  });

  // Create score criteria
  const criteria = [
    { name: 'Innovation', weight: 0.3, order: 1 },
    { name: 'Technical Quality', weight: 0.25, order: 2 },
    { name: 'Presentation', weight: 0.2, order: 3 },
    { name: 'Impact', weight: 0.25, order: 4 },
  ];

  for (const criterion of criteria) {
    await prisma.scoreCriteria.create({
      data: {
        ...criterion,
        scoreSheetId: scoreSheet.id,
      },
    });
  }

  // Create jury member
  await prisma.juryMember.create({
    data: {
      userId: jury1.id,
      contestId: contest.id,
      expertise: 'Technology Innovation',
    },
  });

  // Create candidate
  await prisma.candidate.create({
    data: {
      userId: candidate1.id,
      contestId: contest.id,
      termsAccepted: true,
    },
  });

  console.log('✅ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });