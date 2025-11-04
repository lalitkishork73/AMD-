import { NextResponse } from "next/server";

/**
 * Jambonz Calling Webhook: returns a dialplan JSON
 * Jambonz will POST call data to this endpoint when a call is created.
 */
export async function POST(req: Request) {
  try {
      const baseUrl = typeof globalThis.window === "object"
      ? globalThis.window.location.origin
      : process.env.PUBLIC_BETTER_AUTH_URL || "http://localhost:3000";
    const body = await req.json(); // jambonz posts call details
    // body may contain: { to: '+1...', from: '+1...', call_sid: 'CSxxx', ... }
    const to = body.to || body.destination || body.called || body.called_number || body.number || body.phoneNumber;

    // Build dialplan dynamically — include AMD actionHook which Jambonz will call when AMD decision is made.
    const actionHook = `${baseUrl}/api/jambonz/amd-events`;

    const dialplan = [
      {
        verb: "dial",
        callerId: process.env.TWILIO_PHONE_NUMBER || "+12225551234",
        target: [{ type: "phone", number: to }],
        amd: {
          actionHook,
          thresholdWordCount: 5,
          timers: { decisionTimeoutMs: 10000 }
        }
      }
    ];

    return NextResponse.json(dialplan, { status: 200 });
  } catch (err: any) {
    console.error("dialplan error", err);
    return NextResponse.json({ error: "invalid request" }, { status: 400 });
  }
}
