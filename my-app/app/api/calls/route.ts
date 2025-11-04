import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: (req as any).headers });
    if (!session?.user)
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const url = new URL(req.url);
    const page = Number(url.searchParams.get("page") || 1);
    const pageSize = Math.min(5, Number(url.searchParams.get("pageSize") || 5));
    const search = url.searchParams.get("search") || "";
    const startDate = url.searchParams.get("startDate");
    const endDate = url.searchParams.get("endDate");
    const strategy = url.searchParams.get("strategy");
    const status = url.searchParams.get("status");

    const where: any = { userId: session.user.id };

    if (search) {
      where.targetNumber = { contains: search, mode: "insensitive" };
    }

    if (strategy && strategy !== "ALL") where.strategy = strategy.toUpperCase();
    if (status && status !== "ALL") where.status = status.toUpperCase();

    if (startDate && endDate) {
      where.createdAt = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    const [total, calls] = await Promise.all([
      prisma.call.count({ where }),
      prisma.call.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: { amdResults: true },
      }),
    ]);

    const items = calls.map((call) => {
      const latestAmd = call.amdResults?.[0];
      return {
        id: call.id,
        number: call.targetNumber,
        strategy: call.strategy,
        status: call.status,
        result: latestAmd?.label || "unknown",
        cost: call.cost || null,
        latency: latestAmd?.latencyMs ? `${(latestAmd.latencyMs / 1000).toFixed(2)}s` : "-",
        createdAt: call.createdAt,
      };
    });

    return NextResponse.json({
      success: true,
      data: { total, page, pageSize, items },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
