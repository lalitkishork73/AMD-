-- CreateEnum
CREATE TYPE "StrategyType" AS ENUM ('TWILIO_NATIVE', 'JAMBONZ', 'HUGGINGFACE', 'GEMINI');

-- CreateEnum
CREATE TYPE "CallStatus" AS ENUM ('INITIATED', 'RINGING', 'ANSWERED', 'HUMAN', 'MACHINE', 'FAILED', 'TIMEOUT', 'UNKNOWN');

-- CreateTable
CREATE TABLE "call" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "targetNumber" TEXT NOT NULL,
    "strategy" "StrategyType" NOT NULL,
    "status" "CallStatus" NOT NULL,
    "confidence" DOUBLE PRECISION,
    "duration" INTEGER,
    "cost" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "call_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audio_log" (
    "id" TEXT NOT NULL,
    "callId" TEXT NOT NULL,
    "s3Url" TEXT,
    "duration" INTEGER,
    "sizeKB" INTEGER,
    "format" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "audio_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "amd_result" (
    "id" TEXT NOT NULL,
    "callId" TEXT NOT NULL,
    "modelName" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "confidence" DOUBLE PRECISION,
    "latencyMs" INTEGER,
    "rawResponse" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "amd_result_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "strategy_stats" (
    "id" TEXT NOT NULL,
    "strategyName" "StrategyType" NOT NULL,
    "totalCalls" INTEGER NOT NULL DEFAULT 0,
    "humanDetected" INTEGER NOT NULL DEFAULT 0,
    "machineDetected" INTEGER NOT NULL DEFAULT 0,
    "falsePositive" INTEGER NOT NULL DEFAULT 0,
    "falseNegative" INTEGER NOT NULL DEFAULT 0,
    "avgLatencyMs" DOUBLE PRECISION,
    "avgConfidence" DOUBLE PRECISION,
    "avgCost" DOUBLE PRECISION,
    "lastUpdated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "strategy_stats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "call_strategy_idx" ON "call"("strategy");

-- CreateIndex
CREATE INDEX "call_status_idx" ON "call"("status");

-- CreateIndex
CREATE INDEX "amd_result_modelName_idx" ON "amd_result"("modelName");

-- CreateIndex
CREATE UNIQUE INDEX "strategy_stats_strategyName_key" ON "strategy_stats"("strategyName");

-- AddForeignKey
ALTER TABLE "call" ADD CONSTRAINT "call_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audio_log" ADD CONSTRAINT "audio_log_callId_fkey" FOREIGN KEY ("callId") REFERENCES "call"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "amd_result" ADD CONSTRAINT "amd_result_callId_fkey" FOREIGN KEY ("callId") REFERENCES "call"("id") ON DELETE CASCADE ON UPDATE CASCADE;
