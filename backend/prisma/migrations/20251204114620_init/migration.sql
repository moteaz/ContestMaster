-- CreateEnum
CREATE TYPE "ContestStepType" AS ENUM ('DRAFT', 'REGISTRATION', 'PRE_SELECTION', 'JURY_EVALUATION', 'RESULT');

-- CreateEnum
CREATE TYPE "RuleType" AS ENUM ('AGE_LIMIT', 'SUBMISSION_COUNT', 'CANDIDATE_LIMIT', 'FILE_VALIDATION', 'TERMS_VALIDATION', 'CUSTOM');

-- CreateEnum
CREATE TYPE "RuleExecution" AS ENUM ('AUTOMATIC', 'MANUAL');

-- CreateEnum
CREATE TYPE "SubmissionType" AS ENUM ('DOCUMENT', 'VIDEO', 'LINK');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ORGANIZER', 'CANDIDATE', 'JURY_MEMBER', 'ADMIN');

-- CreateEnum
CREATE TYPE "CandidateStatus" AS ENUM ('REGISTERED', 'QUALIFIED', 'ELIMINATED', 'PENDING');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "age" INTEGER,
    "institution" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contests" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "maxCandidates" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "organizerId" TEXT NOT NULL,

    CONSTRAINT "contests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contest_steps" (
    "id" TEXT NOT NULL,
    "type" "ContestStepType" NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "minCandidates" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "contestId" TEXT NOT NULL,

    CONSTRAINT "contest_steps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "step_history" (
    "id" TEXT NOT NULL,
    "fromStep" "ContestStepType",
    "toStep" "ContestStepType" NOT NULL,
    "triggeredBy" TEXT NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "contestId" TEXT NOT NULL,
    "stepId" TEXT,

    CONSTRAINT "step_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "candidates" (
    "id" TEXT NOT NULL,
    "status" "CandidateStatus" NOT NULL DEFAULT 'REGISTERED',
    "registrationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "eliminationReason" TEXT,
    "termsAccepted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "contestId" TEXT NOT NULL,

    CONSTRAINT "candidates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jury_members" (
    "id" TEXT NOT NULL,
    "expertise" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "maxCandidates" INTEGER DEFAULT 10,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "contestId" TEXT NOT NULL,

    CONSTRAINT "jury_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "submissions" (
    "id" TEXT NOT NULL,
    "type" "SubmissionType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "fileUrl" TEXT,
    "fileName" TEXT,
    "fileSize" INTEGER,
    "mimeType" TEXT,
    "linkUrl" TEXT,
    "isValid" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "candidateId" TEXT NOT NULL,

    CONSTRAINT "submissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "score_sheets" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "minScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "maxScore" DOUBLE PRECISION NOT NULL DEFAULT 20,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "contestId" TEXT NOT NULL,

    CONSTRAINT "score_sheets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "score_criteria" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "weight" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "minValue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "maxValue" DOUBLE PRECISION NOT NULL DEFAULT 20,
    "order" INTEGER NOT NULL,
    "isRequired" BOOLEAN NOT NULL DEFAULT true,
    "scoreSheetId" TEXT NOT NULL,

    CONSTRAINT "score_criteria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scores" (
    "id" TEXT NOT NULL,
    "totalScore" DOUBLE PRECISION,
    "finalScore" DOUBLE PRECISION,
    "comment" TEXT,
    "isAnomaly" BOOLEAN NOT NULL DEFAULT false,
    "anomalyReason" TEXT,
    "isValidated" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "candidateId" TEXT NOT NULL,
    "juryMemberId" TEXT NOT NULL,
    "scoreSheetId" TEXT NOT NULL,

    CONSTRAINT "scores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "criteria_scores" (
    "id" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "comment" TEXT,
    "scoreId" TEXT NOT NULL,
    "criteriaId" TEXT NOT NULL,

    CONSTRAINT "criteria_scores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dynamic_rules" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "RuleType" NOT NULL,
    "execution" "RuleExecution" NOT NULL DEFAULT 'AUTOMATIC',
    "isBlocking" BOOLEAN NOT NULL DEFAULT true,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL,
    "config" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "contestId" TEXT NOT NULL,

    CONSTRAINT "dynamic_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rule_execution_logs" (
    "id" TEXT NOT NULL,
    "executedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "affectedCount" INTEGER NOT NULL DEFAULT 0,
    "success" BOOLEAN NOT NULL DEFAULT true,
    "errorMessage" TEXT,
    "executedBy" TEXT NOT NULL,
    "ruleId" TEXT NOT NULL,

    CONSTRAINT "rule_execution_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "contest_steps_contestId_type_key" ON "contest_steps"("contestId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "contest_steps_contestId_order_key" ON "contest_steps"("contestId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "candidates_userId_contestId_key" ON "candidates"("userId", "contestId");

-- CreateIndex
CREATE UNIQUE INDEX "jury_members_userId_contestId_key" ON "jury_members"("userId", "contestId");

-- CreateIndex
CREATE UNIQUE INDEX "score_criteria_scoreSheetId_order_key" ON "score_criteria"("scoreSheetId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "scores_candidateId_juryMemberId_scoreSheetId_key" ON "scores"("candidateId", "juryMemberId", "scoreSheetId");

-- CreateIndex
CREATE UNIQUE INDEX "criteria_scores_scoreId_criteriaId_key" ON "criteria_scores"("scoreId", "criteriaId");

-- CreateIndex
CREATE UNIQUE INDEX "dynamic_rules_contestId_order_key" ON "dynamic_rules"("contestId", "order");

-- AddForeignKey
ALTER TABLE "contests" ADD CONSTRAINT "contests_organizerId_fkey" FOREIGN KEY ("organizerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contest_steps" ADD CONSTRAINT "contest_steps_contestId_fkey" FOREIGN KEY ("contestId") REFERENCES "contests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "step_history" ADD CONSTRAINT "step_history_contestId_fkey" FOREIGN KEY ("contestId") REFERENCES "contests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "step_history" ADD CONSTRAINT "step_history_stepId_fkey" FOREIGN KEY ("stepId") REFERENCES "contest_steps"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "candidates" ADD CONSTRAINT "candidates_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "candidates" ADD CONSTRAINT "candidates_contestId_fkey" FOREIGN KEY ("contestId") REFERENCES "contests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jury_members" ADD CONSTRAINT "jury_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jury_members" ADD CONSTRAINT "jury_members_contestId_fkey" FOREIGN KEY ("contestId") REFERENCES "contests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "candidates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "score_sheets" ADD CONSTRAINT "score_sheets_contestId_fkey" FOREIGN KEY ("contestId") REFERENCES "contests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "score_criteria" ADD CONSTRAINT "score_criteria_scoreSheetId_fkey" FOREIGN KEY ("scoreSheetId") REFERENCES "score_sheets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scores" ADD CONSTRAINT "scores_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "candidates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scores" ADD CONSTRAINT "scores_juryMemberId_fkey" FOREIGN KEY ("juryMemberId") REFERENCES "jury_members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scores" ADD CONSTRAINT "scores_scoreSheetId_fkey" FOREIGN KEY ("scoreSheetId") REFERENCES "score_sheets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "criteria_scores" ADD CONSTRAINT "criteria_scores_scoreId_fkey" FOREIGN KEY ("scoreId") REFERENCES "scores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "criteria_scores" ADD CONSTRAINT "criteria_scores_criteriaId_fkey" FOREIGN KEY ("criteriaId") REFERENCES "score_criteria"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dynamic_rules" ADD CONSTRAINT "dynamic_rules_contestId_fkey" FOREIGN KEY ("contestId") REFERENCES "contests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rule_execution_logs" ADD CONSTRAINT "rule_execution_logs_ruleId_fkey" FOREIGN KEY ("ruleId") REFERENCES "dynamic_rules"("id") ON DELETE CASCADE ON UPDATE CASCADE;
