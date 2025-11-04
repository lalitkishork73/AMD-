// /app/api/strategy-stats/route.ts
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const stats = await prisma.strategyStats.findMany({
      orderBy: { strategyName: "asc" },
    });

    return NextResponse.json({ stats });
  } catch (err: any) {
    console.error("Error fetching stats:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
