import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  console.log("📞 Incoming Jambonz call:", body);

  return NextResponse.json([
    {
      verb: "say",
      text: "Hello dost Lalit, this is a Jambonz test call. Everything is working fine!",
    },
  ]);
}
