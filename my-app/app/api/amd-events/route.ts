import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // example body: { event: "amd_human_detected", call_sid: "CA...", amd_duration_ms: 2300, ... }
    console.log("Jambonz AMD event:", body);

    const callSid = body.call_sid || body.CallSid || body.callSid;
    if (!callSid) return NextResponse.json({ ok: false, message: "missing call_sid" }, { status: 400 });

    const call = await prisma.call.findFirst({ where: { twilioSid: callSid } });
    if (!call) return NextResponse.json({ ok:false, message: "call not found" }, { status: 404 });

    const label = body.event === "amd_human_detected" ? "human" :
                  body.event === "amd_machine_detected" ? "machine" : "unknown";

    await prisma.aMDResult.create({
      data: {
        callId: call.id,
        modelName: "Jambonz SIP-AMD",
        label,
        confidence: body.confidence ?? null,
        latencyMs: body.amd_duration_ms ?? null,
        rawResponse: body
      }
    });

    await prisma.call.update({
      where: { id: call.id },
      data: { status: label === "human" ? "HUMAN" : "MACHINE" }
    });

    // instruct jambonz what to do next (webhook response can be an array of verbs)
    if (label === "human") {
      return NextResponse.json([
        { verb: "say", text: "Human detected. Connecting now." },
        // optionally return a command to bridge/connect to another endpoint
      ]);
    } else {
      return NextResponse.json([{ verb: "hangup", reason: "machine_detected" }]);
    }

  } catch (err:any) {
    console.error("amd webhook error:", err);
    return NextResponse.json({ ok:false, message: err.message || "server error" }, { status: 500 });
  }
}
