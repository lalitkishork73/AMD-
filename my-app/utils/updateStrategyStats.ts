// utils/updateStrategyStats.ts
import prisma from "@/lib/prisma";

function calculateAverage(existingValue: number | null | undefined, newValue: number | undefined): number | undefined {
  if (typeof newValue === "number" && typeof existingValue === "number") {
    return (existingValue + newValue) / 2;
  }
  return newValue ?? existingValue ?? undefined;
}

export async function updateStrategyStats(
  strategy: any,
  label: string,
  confidence?: number,
  latencyMs?: number,
  cost?: number
) {
  const existing = await prisma.strategyStats.findUnique({
    where: { strategyName: strategy },
  });

  const isHuman = label === "human";
  const isMachine = label === "machine";

  if (existing) {
    const updatedData = {
      totalCalls: { increment: 1 },
      humanDetected: { increment: isHuman ? 1 : 0 },
      machineDetected: { increment: isMachine ? 1 : 0 },
      avgConfidence: calculateAverage(existing.avgConfidence, confidence),
      avgLatencyMs: calculateAverage(existing.avgLatencyMs, latencyMs),
      avgCost: calculateAverage(existing.avgCost, cost),
    };

    await prisma.strategyStats.update({
      where: { strategyName: strategy },
      data: updatedData,
    });
  } else {
    await prisma.strategyStats.create({
      data: {
        strategyName: strategy,
        totalCalls: 1,
        humanDetected: isHuman ? 1 : 0,
        machineDetected: isMachine ? 1 : 0,
        avgConfidence: confidence ?? null,
        avgLatencyMs: latencyMs ?? null,
        avgCost: cost ?? null,
      },
    });
  }
}
