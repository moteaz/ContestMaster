-- AlterTable
ALTER TABLE "contest_steps" ADD COLUMN     "canRollback" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "maxCandidates" INTEGER,
ADD COLUMN     "requiredSubmissions" INTEGER DEFAULT 0;

-- AlterTable
ALTER TABLE "contests" ADD COLUMN     "autoTransition" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "currentStepType" "ContestStepType" NOT NULL DEFAULT 'DRAFT';

-- AlterTable
ALTER TABLE "jury_members" ADD COLUMN     "conflictInstitutions" TEXT[],
ADD COLUMN     "currentLoad" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "scores" ADD COLUMN     "anomalyThreshold" DOUBLE PRECISION,
ADD COLUMN     "medianScore" DOUBLE PRECISION,
ADD COLUMN     "needsReview" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "weightedScore" DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "jury_assignments" (
    "id" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "workloadScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "juryMemberId" TEXT NOT NULL,
    "candidateId" TEXT NOT NULL,

    CONSTRAINT "jury_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workflow_transitions" (
    "id" TEXT NOT NULL,
    "fromStep" "ContestStepType",
    "toStep" "ContestStepType" NOT NULL,
    "condition" JSONB NOT NULL,
    "isAutomatic" BOOLEAN NOT NULL DEFAULT true,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "contestId" TEXT NOT NULL,

    CONSTRAINT "workflow_transitions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "score_calculations" (
    "id" TEXT NOT NULL,
    "calculationType" TEXT NOT NULL,
    "formula" JSONB NOT NULL,
    "result" DOUBLE PRECISION NOT NULL,
    "calculatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "candidateId" TEXT NOT NULL,
    "contestId" TEXT NOT NULL,

    CONSTRAINT "score_calculations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "jury_assignments_juryMemberId_candidateId_key" ON "jury_assignments"("juryMemberId", "candidateId");

-- AddForeignKey
ALTER TABLE "jury_assignments" ADD CONSTRAINT "jury_assignments_juryMemberId_fkey" FOREIGN KEY ("juryMemberId") REFERENCES "jury_members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jury_assignments" ADD CONSTRAINT "jury_assignments_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "candidates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflow_transitions" ADD CONSTRAINT "workflow_transitions_contestId_fkey" FOREIGN KEY ("contestId") REFERENCES "contests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "score_calculations" ADD CONSTRAINT "score_calculations_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "candidates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "score_calculations" ADD CONSTRAINT "score_calculations_contestId_fkey" FOREIGN KEY ("contestId") REFERENCES "contests"("id") ON DELETE CASCADE ON UPDATE CASCADE;
