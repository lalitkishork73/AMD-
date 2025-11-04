import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    console.log("Jambonz AMD event:", data);
    // typical fields: { event: 'amd_human_detected', call_sid: 'CSxxx', amd_duration_ms: 2345, ... }
    const callSid = data.call_sid || data.callSid || data.CallSid;
    if (!callSid) return NextResponse.json({ ok: false, message: "missing call_sid" }, { status: 400 });

    const callRecord = await prisma.call.findFirst({ where: { twilioSid: callSid } });
    if (!callRecord) {
      console.warn("call not found for jambonz event", callSid);
      // optional: create basic call record
    }

    const label = data.event === "amd_human_detected" ? "human" :
                  data.event === "amd_machine_detected" ? "machine" : "unknown";

    const amd = await prisma.aMDResult.create({
      data: {
        callId: callRecord?.id || "", // if null, adjust logic to create call first
        modelName: "Jambonz SIP-AMD",
        label,
        confidence: data.confidence ?? null,
        latencyMs: data.amd_duration_ms ?? null,
        rawResponse: data
      }
    });

    if (callRecord) {
      await prisma.call.update({
        where: { id: callRecord.id },
        data: { status: label === "human" ? "HUMAN" : "MACHINE", confidence: data.confidence ?? null }
      });
    }

    // Respond with the next dialplan steps to jambonz:
    if (label === "human") {
      // Instruct Jambonz to play a greeting then keep the call (or connect)
      return NextResponse.json([
        { verb: "say", text: "Human detected. Connecting you now." },
        // optionally add connect/bridge verbs
      ]);
    } else {
      // Hang up for machine
      return NextResponse.json([{ verb: "hangup", reason: "machine_detected" }]);
    }

  } catch (err: any) {
    console.error("amd-events error", err);
    return NextResponse.json({ ok: false, message: err.message }, { status: 500 });
  }
}
