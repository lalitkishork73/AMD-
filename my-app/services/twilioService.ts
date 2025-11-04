import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const twilioClient = twilio(accountSid, authToken);

export class TwilioService {
  static async makeCall(to: string, from?: string, strategyName?: string) {
    try {
       const baseUrl = typeof globalThis.window === "object"
      ? globalThis.window.location.origin
      : process.env.PUBLIC_BETTER_AUTH_URL || "http://localhost:3000";
      

      const call = await twilioClient.calls.create({
        to,
        from: from || process.env.TWILIO_PHONE_NUMBER!,
        url: `${baseUrl}/api/twilio/voice`, // TwiML endpoint (we’ll discuss next)
        machineDetection: "Enable",
        statusCallbackEvent: ["initiated", "ringing", "answered", "completed"],
        asyncAmd: "true",
        asyncAmdStatusCallback: `${baseUrl}/api/twilio/amd`,
        statusCallback: `${baseUrl}/api/twilio/status`,
        // recordingStatusCallback: `https://29170149eb6a.ngrok-free.app/api/twilio/recording`,

        // url: `${process.env.TWILIO_VOICE_URL}/api/twilio/voice` ,// TwiML endpoint (we’ll discuss next)
        // twiml: twimlResponse,
        // asyncAmdStatusCallbackMethod: "POST",
        // statusCallback: statusCallback,
        // record: false,
        // recordingStatusCallback: recordingCallback
      });


      return {
        sid: call.sid,
        status: call.status,
        to: call.to,
        from: call.from,
        strategy: strategyName || "default",
        createdAt: new Date(),
      };
    } catch (error: any) {
      console.error("Twilio call error:", error.message);
      throw new Error("Call initiation failed");
    }
  }

  static async getCallStatus(callSid: string) {
    try {
      const call = await twilioClient.calls(callSid).fetch();
      return {
        sid: call.sid,
        status: call.status,
        duration: call.duration,
        startTime: call.startTime,
        endTime: call.endTime,
      };
    } catch (error) {
      console.error("Error fetching call status:", error);
      throw new Error("Unable to fetch call status");
    }
  }
}
