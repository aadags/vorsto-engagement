"use server";
import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import twilio from "twilio";

export async function POST(req) {
  try {
    const organizationId = Number(req.cookies.get("organizationId").value) ?? 0;

    const body = await req.json();
    const { numberData } = body;

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = twilio(accountSid, authToken);

    const incomingPhoneNumber = await client.incomingPhoneNumbers.create({
      phoneNumber: numberData.phone_number,
      voiceUrl: "https://voice.vorsto.io/api/conference/client-connect",
      smsUrl: "https://sms.vorsto.io/api/hook",
    });

    const number = await prisma.number.create({
      data: {
        number: incomingPhoneNumber.phone_number,
        sms: incomingPhoneNumber.capabilities.sms,
        voice: incomingPhoneNumber.capabilities.voice,
        locality: numberData.locality,
        sid: incomingPhoneNumber.sid,
        plan: "free",
        organization_id: organizationId,
      },
    });
    return NextResponse.json({ status: true, message: "Number Activated" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to save conversation" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}

export async function PUT() {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}
