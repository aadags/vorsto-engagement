"use server";
import { NextResponse } from "next/server";
import { VoiceResponse } from 'twilio';

export async function POST(req) {
  try {
    
    const voiceResponse = new VoiceResponse();
    voiceResponse.say({}, 'Thank you for calling. Please wait in line for a few seconds. An agent will be with you shortly.');
    voiceResponse.play({}, 'http://com.twilio.music.classical.s3.amazonaws.com/BusyStrings.mp3');


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
