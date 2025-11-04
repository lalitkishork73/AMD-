# 📞 Advanced AMD (Answering Machine Detection) Telephony System  

### Built with Next.js + Twilio + Prisma + Better Auth

---

## 🚀 Project Overview

This project is a **full-stack telephony system** built using **Next.js 14**, **Twilio**, and **Better Auth**, designed to explore multiple AMD (Answering Machine Detection) strategies to identify whether a human or a voicemail answers an outbound call.

The main goal is to:

- Detect if a call is answered by a **human** or a **machine** in real-time.
- Handle each scenario appropriately (connect for human, hang up for machine).
- Log and compare results across different AMD strategies.

Currently, the **Twilio native AMD strategy** is fully functional, **Jambonz strategy** is partially working (95%), and other strategies (Hugging Face and Gemini) are under development.

---

## 🧠 AMD Strategies and Current Progress

| Strategy | Description | Status | Notes |
|-----------|-------------|--------|-------|
| **1. Twilio Native AMD** | Uses Twilio’s built-in `machineDetection: "Enable"` feature to detect human vs machine and trigger callbacks for result logging. | ✅ **Completed (100%)** | Works end-to-end including async AMD status handling. |
| **2. Twilio + Jambonz SIP AMD** | Integrates Twilio with **Jambonz** (SIP-based AMD) for enhanced control and custom thresholds. | ⚠️ **Working (95%)** | Call flow established but currently user **not receiving the call** (under debugging). |
| **3. Hugging Face Wav2Vec AMD** | Planned integration of AI-powered audio classifier (via FastAPI) for high-accuracy detection using real-time audio streams. | ❌ **Not started** | Future enhancement — to process real-time Twilio audio streams. |
| **4. Google Gemini Flash Real-Time** | Future integration using Google Gemini 2.5 Flash API for multimodal audio analysis to detect human speech patterns. | ❌ **Not started** | Will serve as experimental high-speed, low-latency strategy. |

---

## ⚙️ Tech Stack

| Layer | Technology Used |
|-------|----------------|
| **Frontend / Backend** | Next.js 14 (App Router, TypeScript) |
| **Database** | PostgreSQL with Prisma ORM |
| **Authentication** | Better Auth |
| **Telephony / AMD** | Twilio SDK, Jambonz Cloud |
| **Future AI Integration** | Python (FastAPI for Hugging Face / Gemini inference) |
| **Environment Management** | .env (dotenv) |
| **Deployment** | Vercel / Localhost / ngrok for webhook tunneling |

---

## 🧩 System Architecture (Overview)

```mermaid
graph TD
  A[User (Next.js UI)] -->|Dial Request| B[API Route: /api/twilio/makeCall]
  B -->|Outbound Call| C[Twilio SDK]
  C -->|Status + AMD Callbacks| D[Next.js API: /api/twilio/status, /api/twilio/amd]
  D -->|Save Logs| E[(PostgreSQL via Prisma)]
  C -->|If SIP Strategy| F[Jambonz Cloud]
  F -->|AMD Detection| D
  D -->|UI Update| A


# Better Auth Configuration
BETTER_AUTH_SECRET=your_secret_key_here
BETTER_AUTH_URL=http://localhost:3000
PUBLIC_BETTER_AUTH_URL=https://your-ngrok-url.ngrok-free.app

# Twilio Configuration
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
TWILIO_VOICE_URL=https://handler.twilio.com/twiml/EHxxxxxxxxxxxxxxxxxxxxxxxxx

# Jambonz Configuration
JAMBONZ_API_KEY=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
JAMBONZ_APP_SID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
JAMBONZ_BASE_URL=https://api.jambonz.cloud
JAMBONZ_ACCOUNT_SID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

# Database Connection
DATABASE_URL="postgresql://user:password@localhost:5432/amd_db"


This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
