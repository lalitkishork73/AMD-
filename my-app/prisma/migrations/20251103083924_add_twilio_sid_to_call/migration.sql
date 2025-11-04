/*
  Warnings:

  - A unique constraint covering the columns `[twilioSid]` on the table `call` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "call" ADD COLUMN     "twilioSid" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "call_twilioSid_key" ON "call"("twilioSid");
