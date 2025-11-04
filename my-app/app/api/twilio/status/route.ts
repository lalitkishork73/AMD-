/**
 * This TypeScript function handles incoming Twilio status webhooks, normalizes call statuses, and
 * updates the status and duration of calls in a database using Prisma.
 * @param {Request} req - The `req` parameter in the `POST` function is of type `Request`, which
 * represents the incoming HTTP request. It is used to read form data from the request body in this
 * code snippet.
 * @returns The POST request handler function is returning a JSON response with `{ ok: true }` if the
 * operation is successful. If there are any errors such as missing `CallSid` or invalid duration, it
 * returns a JSON response with `{ ok: false }` along with an appropriate status code (400) and error
 * message if applicable.
 */
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { readFormData } from "@/lib/twilioHelpers";

const STATUS_MAP: Record<string, string> = {
  initiated: "INITIATED",
  queued: "QUEUED",
  ringing: "RINGING",
  answered: "ANSWERED",
  in_progress: "ANSWERED", // Twilio means call is connected
  completed: "ANSWERED",   // Call ended normally, treat as answered
  failed: "FAILED",
  busy: "FAILED",
  no_answer: "TIMEOUT",
  canceled: "TIMEOUT",
};

export async function POST(req: Request) {
  const form = await readFormData(req);
  const callSid = form.CallSid;
  const callStatus = form.CallStatus; // e.g. queued, ringing, in-progress
  const duration = form.Duration ? Number.parseInt(form.Duration) : undefined;

  if (!callSid)
    return NextResponse.json({ ok: false }, { status: 400 });

  if (form.Duration && Number.isNaN(duration))
    return NextResponse.json({ ok: false, error: "invalid duration" }, { status: 400 });

  console.debug("Twilio status webhook received", { callSid, callStatus, duration });

  const normalized = callStatus?.toLowerCase()?.replace("-", "_") ?? "unknown";
  const mappedStatus:any = STATUS_MAP[normalized] || "TIMEOUT";

  await prisma.call.updateMany({
    where: { twilioSid: callSid },
    data: {
      status: mappedStatus,
      duration: duration ?? undefined,
    },
  });

  return NextResponse.json({ ok: true });
}
