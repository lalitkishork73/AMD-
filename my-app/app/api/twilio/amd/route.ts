import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { readFormData } from "@/lib/twilioHelpers";
import { updateStrategyStats } from "@/utils/updateStrategyStats";

export async function POST(req: Request) {
  const form = await readFormData(req);
  const callSid = form.CallSid;
  const answeredBy = form.AnsweredBy; // e.g. "human", "machine_start", "machine_end_beep", "unknown"
  const machineDetectionDuration = form.MachineDetectionDuration ?? null;


  if (!callSid)
    return NextResponse.json({ ok: false, message: "Missing CallSid" }, { status: 400 });

  // find the related call
  const callRecord = await prisma.call.findFirst({ where: { twilioSid: callSid } });
  if (!callRecord)
    return NextResponse.json({ ok: false, message: "Call not found" }, { status: 404 });

  // map Twilio result → human/machine/unknown
  const label =
    answeredBy === "human"
      ? "human"
      : answeredBy?.startsWith("machine")
      ? "machine"
      : "unknown";

  // create AMDResult record
  const amdResult = await prisma.aMDResult.create({
    data: {
      callId: callRecord.id,
      modelName: "Twilio Native",
      label,
      confidence: null, // Twilio doesn’t send confidence
      latencyMs: machineDetectionDuration ? parseInt(machineDetectionDuration) : null,
      rawResponse: form,
    },
  });

  // update Call table
  await prisma.call.update({
    where: { id: callRecord.id },
    data: {
      status: label === "human" ? "HUMAN" : "MACHINE",
      confidence: null,
    },
  });


  await updateStrategyStats(
    callRecord.strategy, // e.g., "TWILIO_NATIVE"
    amdResult.label,     // "human" | "machine" | "unknown"
    amdResult.confidence ?? undefined,
    amdResult.latencyMs ?? undefined,
    callRecord.cost ?? undefined
  );

  // Optional: Business logic after AMD detection
  if (label === "machine") {
    importTwilioAndHangup(callSid).catch((e) =>
      console.error("Failed to hang up:", e)
    );
  } else if (label === "human") {
    // Optionally: notify frontend (SSE/WebSocket) that a human answered
  }

  return NextResponse.json({ ok: true });
}

// helper to hang up Twilio call
async function importTwilioAndHangup(callSid: string) {
  const twilio = (await import("twilio")).default;
  const client = twilio(process.env.TWILIO_ACCOUNT_SID!, process.env.TWILIO_AUTH_TOKEN!);
  await client.calls(callSid).update({ status: "completed" });
}
