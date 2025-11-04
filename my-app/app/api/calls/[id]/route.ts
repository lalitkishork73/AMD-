import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const session = await auth.api.getSession({ headers: (req as any).headers });
  if (!session?.user) return NextResponse.json({ success:false, message:"Unauthorized" }, { status:401 });

  const id = params.id;
  const call = await prisma.call.findUnique({
    where: { id },
    include: { amdResults: true, audioLogs: true }
  });
  if (!call) return NextResponse.json({ success:false, message:"Not found" }, { status:404 });
  if (call.userId !== session.user.id) return NextResponse.json({ success:false, message:"Forbidden" }, { status:403 });

  return NextResponse.json({ success:true, data: call });
}
