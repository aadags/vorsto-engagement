"use server";
import { NextResponse } from "next/server";
import { twiml } from 'twilio';
import { call } from "@/services/twilioCaller";
import prisma from "@/db/prisma";

const AGENT_WAIT_URL = 'http://twimlets.com/holdmusic?Bucket=com.twilio.music.classical';
const VoiceResponse = twiml.VoiceResponse;


function connectConferenceUrl(host, conferenceId) {
  return `${host}/api/conference/${conferenceId}/connect`;
}

export async function POST(req) {
  try {
    const userId = 12;
    const formData = await req.formData();
    const entries = Object.fromEntries(formData.entries());

    //entries.From or .Caller
    //entries.FromState

    const conferenceId = entries.CallSid;
    const from = entries.From;

    const callbackUrl = connectConferenceUrl("https://full-octopus-cool.ngrok-free.app", conferenceId);


    await call(userId, callbackUrl);

    await prisma.call.upsert({
      where: { userId },
      update: { conferenceId, from },
      create: { userId, conferenceId, from },
    });

    const voiceResponse = new VoiceResponse();
    voiceResponse.dial().conference(
      conferenceId,
      {
        startConferenceOnEnter: false,
        endConferenceOnExit: true,
        waitUrl: AGENT_WAIT_URL,
      }
    );

    return new NextResponse(voiceResponse.toString(), {
      status: 200,
      headers: {
        'Content-Type': 'text/xml',
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to attach mail" },
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
