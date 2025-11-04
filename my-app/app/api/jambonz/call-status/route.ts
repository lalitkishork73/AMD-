import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.json();
  console.log("jambonz call status:", body);
  // update call record similarly if needed
  return NextResponse.json({ ok: true });
}
