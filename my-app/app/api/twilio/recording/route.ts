import { NextResponse } from "next/server";
import { readFormData } from "@/lib/twilioHelpers";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const form = await readFormData(req);
  const callSid = form.CallSid;
  const recordingUrl = form.RecordingUrl; // Twilio returns public recording URL
  const duration = form.RecordingDuration ? parseInt(form.RecordingDuration) : null;
  // find call
  const callRecord = await prisma.call.findFirst({ where: { twilioSid: callSid }});
  if (!callRecord) return NextResponse.json({ ok:false, message:"call not found" }, { status: 404 });

  await prisma.audioLog.create({
    data: {
      callId: callRecord.id,
      s3Url: recordingUrl,  // you may copy to your S3 via server job for persistence
      duration,
      format: 'wav' // Twilio returns wav or mp3 depending on settings
    }
  });

  return NextResponse.json({ ok: true });
}
