import { NextResponse } from "next/server";

export async function POST() {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <Response>
      <Say voice="alice">Hello dost Lalit! This is your working Twilio call.</Say>
      <Pause length="1"/>
      <Say voice="alice">Your AMD system is being configured successfully.</Say>
    </Response>`;
  return new NextResponse(xml, {
    status: 200,
    headers: { "Content-Type": "text/xml" },
  });
}
