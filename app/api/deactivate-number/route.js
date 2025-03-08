"use server";
import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import twilio from "twilio";

export async function POST(req) {
  try {
    const organizationId = Number(req.cookies.get("organizationId").value) ?? 0;

    const body = await req.json();
    const { id, sid, number, voice, sms, locality, organization_id } = body;

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = twilio(accountSid, authToken);

    // await client
    // .incomingPhoneNumbers(sid)
    // .remove();

    await prisma.number.delete({
      where: {
        id
      },
    });

    await prisma.deletedNumber.create({
      data: {
        number,
        voice,
        sms,
        locality,
        sid,
        organization_id
      }
    });

    return NextResponse.json({ status: true, message: "Number Deactivated" });
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
