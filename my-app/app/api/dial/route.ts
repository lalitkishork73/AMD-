
import {  NextResponse } from 'next/server';
import { TwilioService } from '@/services/twilioService';
import prisma from "@/lib/prisma";
import { auth } from '@/lib/auth';
import { z } from "zod";

const BodySchema = z.object({
  targetNumber: z.string().min(4),
  strategy: z.enum(["twilio","jambonz","huggingface","gemini"]).optional(),
});


export async function POST(req: Request) {
  // auth
  const session = await auth.api.getSession({ headers: (req as any).headers });
  if (!session?.user) return NextResponse.json({ success:false, message: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ success:false, message: parsed.error.message }, { status: 400 });

  const { targetNumber, strategy } = parsed.data;
  // create DB call record first, so we have an id to refer to
  const call = await prisma.call.create({
    data: {
      userId: session.user.id,
      targetNumber,
      strategy:"TWILIO_NATIVE",
      status: "QUEUED",
    }
  });

  // initiate Twilio call
  try {
    const twilioRes:any = await TwilioService.makeCall(targetNumber, undefined, strategy || "twilio");

    // store Twilio SID on the call we created
    await prisma.call.update({
      where: { id: call.id },
      data: { twilioSid: twilioRes.sid, status: twilioRes.status?.toUpperCase() ?? "QUEUED" },
    });

    const updated = await prisma.call.findUnique({ where: { id: call.id }});
    return NextResponse.json({ success:true, data: updated });
  } catch (err:any) {
    // optional: mark call as FAILED
    await prisma.call.update({
      where: { id: call.id },
      data: { status: "FAILED" }
    }).catch(()=>{});
    return NextResponse.json({ success:false, message: err.message || "call failed" }, { status: 500 });
  }
}


