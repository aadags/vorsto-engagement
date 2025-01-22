"use server";
import { NextResponse } from "next/server";
import { twiml } from 'twilio';

const VoiceResponse = twiml.VoiceResponse;
const AGENT_WAIT_URL = 'http://twimlets.com/holdmusic?Bucket=com.twilio.music.classical';

export async function POST(req) {
  try {

    const { conferenceId } = req.query;

    const startConferenceOnEnter = true;
    const endConferenceOnExit = false;

    const voiceResponse = new VoiceResponse();
    voiceResponse.dial().conference(
      conferenceId,
      {
        startConferenceOnEnter,
        endConferenceOnExit,
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
