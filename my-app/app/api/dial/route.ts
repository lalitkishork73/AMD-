// import {  NextResponse } from 'next/server';
// import { TwilioService } from '@/services/twilioService';
// import prisma from "@/lib/prisma";
// import { auth } from '@/lib/auth';
// import { z } from "zod";

// const BodySchema = z.object({
//   targetNumber: z.string().min(4),
//   strategy: z.enum(["twilio","jambonz","huggingface","gemini"]).optional(),
// });

// export async function POST(req: Request) {
//   // auth
//   const session = await auth.api.getSession({ headers: (req as any).headers });
//   if (!session?.user) return NextResponse.json({ success:false, message: "Unauthorized" }, { status: 401 });

//   const body = await req.json().catch(() => null);
//   const parsed = BodySchema.safeParse(body);
//   if (!parsed.success) return NextResponse.json({ success:false, message: parsed.error.message }, { status: 400 });

//   const { targetNumber, strategy } = parsed.data;
//   // create DB call record first, so we have an id to refer to
//   const call = await prisma.call.create({
//     data: {
//       userId: session.user.id,
//       targetNumber,
//       strategy:"TWILIO_NATIVE",
//       status: "QUEUED",
//     }
//   });

//   // initiate Twilio call
//   try {
//     const twilioRes:any = await TwilioService.makeCall(targetNumber, undefined, strategy || "twilio");

//     // store Twilio SID on the call we created
//     await prisma.call.update({
//       where: { id: call.id },
//       data: { twilioSid: twilioRes.sid, status: twilioRes.status?.toUpperCase() ?? "QUEUED" },
//     });

//     const updated = await prisma.call.findUnique({ where: { id: call.id }});
//     return NextResponse.json({ success:true, data: updated });
//   } catch (err:any) {
//     // optional: mark call as FAILED
//     await prisma.call.update({
//       where: { id: call.id },
//       data: { status: "FAILED" }
//     }).catch(()=>{});
//     return NextResponse.json({ success:false, message: err.message || "call failed" }, { status: 500 });
//   }
// }

import { NextResponse } from "next/server";
import { TwilioService } from "@/services/twilioService";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";

const BodySchema = z.object({
  targetNumber: z.string().min(4),
  strategy: z
    .enum(["twilio", "jambonz", "huggingface", "gemini"])
    .default("twilio"),
});

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: (req as any).headers });
  if (!session?.user)
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );

  const body = await req.json().catch(() => null);
  const parsed = BodySchema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json(
      { success: false, message: parsed.error.message },
      { status: 400 }
    );

  const { targetNumber, strategy } = parsed.data;


  const AStratagy:any={
    twilio: "TWILIO_NATIVE",
    jambonz: "JAMBONZ",
    huggingface: "HUGGINGFACE",
    gemini: "GEMINI",
  }

  // Step 1: Create call record first
  const call = await prisma.call.create({
    data: {
      userId: session.user.id,
      targetNumber,
      strategy: AStratagy[strategy],
      status: "QUEUED",
    },
  });

  try {
    let providerRes: any = null;
    let providerSid: string | null = null;
    let providerStatus: any = "QUEUED";

    // Step 2: Handle strategy
    if (strategy === "twilio") {
      providerRes = await TwilioService.makeCall(
        targetNumber,
        undefined,
        "twilio"
      );
      providerSid = providerRes.sid;
      providerStatus = providerRes.status?.toUpperCase() ?? "QUEUED";
    } else if (strategy === "jambonz") {
      // Use your Jambonz Cloud setup
      const jambonzUrl = `https://api.jambonz.cloud/v1/Accounts/${process.env.JAMBONZ_ACCOUNT_SID}/Calls`;

      const appSid = process.env.JAMBONZ_APP_SID!;
      const authHeader = `Bearer ${process.env.JAMBONZ_API_KEY}`;
      const fromNumber = process.env.TWILIO_PHONE_NUMBER || "+12298508646";

      const payload = {
        from: fromNumber,
        to: {
          type: "phone",
          number: `+${targetNumber}`,
        },
        application_sid: appSid,
      };

      const res = await fetch(jambonzUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
        body: JSON.stringify(payload),
      });

      console.log("Jambonz call response status:", res);

      if (!res.ok) {
        const errBody = await res.text();
        throw new Error(`Jambonz call failed: ${res.status} ${errBody}`);
      }

      const data = await res.json();
      providerRes = data;
      providerSid = data.sid ?? data.call_sid ?? null;
      providerStatus = "QUEUED";
    }

    // Step 3: Update DB call record
    await prisma.call.update({
      where: { id: call.id },
      data: {
        twilioSid: providerSid,
        status: providerStatus,
      },
    });

    const updated = await prisma.call.findUnique({ where: { id: call.id } });
    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    console.error("Call initiation error:", err);

    await prisma.call
      .update({
        where: { id: call.id },
        data: { status: "FAILED" },
      })
      .catch(() => {});

    return NextResponse.json(
      {
        success: false,
        message: err.message || "Call initiation failed",
      },
      { status: 500 }
    );
  }
}
