// app/api/send-code/route.ts
"use server";

import { NextResponse } from "next/server";
import Redis from "ioredis";
import { Twilio } from "twilio";

const redis = new Redis(process.env.REDIS);
const twilio = new Twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);
const SMS_FROM = process.env.TWILIO_NUMBER;

function genCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function OPTIONS() {
  // Preflight handler
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",                   
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

export async function POST(req) {
  try {
    const { phone } = await req.json();
    if (!phone) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
      );
    }

    const code = genCode();
    // store in Redis for 5 minutes
    await redis.set(`otp:${phone}`, code, "EX", 300);

    // send via Twilio
    await twilio.messages.create({
      from: SMS_FROM,
      to: phone,
      body: `Your Zuppr login code is ${code}`,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("SEND-CODE ERROR:", err);
    return NextResponse.json(
      { error: "Failed to send code" },
      { status: 500 }
    );
  }
}
