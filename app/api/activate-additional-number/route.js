"use server";
import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import twilio from "twilio";
import Stripe from 'stripe';

export async function POST(req) {
  try {

    const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY, {
      apiVersion: '2024-12-18.acacia', // Use the correct API version
    });

    const organizationId = Number(req.cookies.get("organizationId").value) ?? 0;

    const body = await req.json();
    const { numberData } = body;

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = twilio(accountSid, authToken);

    const org = await prisma.organization.findFirst({
      where: { id: organizationId },
    });

    const subscription = await stripe.subscriptions.retrieve(
      org.number_plan_id
    );

    await stripe.subscriptions.update(
      org.number_plan_id,
      {
        items: [
          {
            id: subscription.items.data[0].id,
            quantity: subscription.items.data[0].quantity + 1
          }
        ]
      }
    );

    const incomingPhoneNumber = await client.incomingPhoneNumbers.create({
      phoneNumber: numberData.phoneNumber,
      voiceUrl: "https://voice.vorsto.io/api/conference/client-connect",
      smsUrl: "https://sms.vorsto.io/api/hook",
    });

    const number = await prisma.number.create({
      data: {
        number: numberData.phoneNumber,
        sms: numberData.capabilities.SMS,
        voice: numberData.capabilities.voice,
        locality: numberData.locality,
        sid: incomingPhoneNumber.sid,
        plan: "paid",
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
