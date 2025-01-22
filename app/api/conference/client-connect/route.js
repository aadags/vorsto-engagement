"use server";
import { NextResponse } from "next/server";
import { twiml } from 'twilio';
import prisma from "@/db/prisma";

const AGENT_WAIT_URL = 'http://twimlets.com/holdmusic?Bucket=com.twilio.music.classical';
const STATUS_URL = `${process.env.NEXT_PUBLIC_APP_URL}/api/conference/call-status`;
const VoiceResponse = twiml.VoiceResponse;

const VALID_PIN = "1234"; // Replace with dynamic PIN logic if necessary

function connectConferenceUrl(host, conferenceId) {
  return `${host}/api/conference/${conferenceId}/connect`;
}

export async function POST(req) {
  try {
    const formData = await req.formData();
    const entries = Object.fromEntries(formData.entries());

    const conferenceId = entries.CallSid;
    const from = entries.From;
    const to = entries.To;
    const digits = entries.Digits; // User input from Twilio Gather (if any)

    const voiceResponse = new VoiceResponse();

    // Check if this is the first call or a response to a PIN input
    // if (!digits) {
    //   // First interaction: Ask for the PIN
    //   const gather = voiceResponse.gather({
    //     numDigits: 4, // Expecting a 4-digit PIN
    //     action: "https://full-octopus-cool.ngrok-free.app/api/conference/client-connect", // Endpoint to handle PIN input
    //     method: "POST",
    //   });
    //   gather.say("Please enter your 4-digit PIN to continue.");
    //   return new NextResponse(voiceResponse.toString(), {
    //     status: 200,
    //     headers: { 'Content-Type': 'text/xml' },
    //   });
    // }

    // // Handle PIN verification
    // if (digits === VALID_PIN) {
    //   // PIN is correct, proceed to connect the caller to the conference
    //   const callbackUrl = connectConferenceUrl("https://full-octopus-cool.ngrok-free.app", conferenceId);

    //   // await prisma.call.create({
    //   //   data: { userId, conferenceId, from },
    //   // });

    //   voiceResponse.say("Thank you. You have been verified. Connecting you to the next available agent.");
    //   voiceResponse.dial().conference(
    //     conferenceId,
    //     {
    //       startConferenceOnEnter: false,
    //       endConferenceOnExit: true,
    //       waitUrl: AGENT_WAIT_URL,
    //     }
    //   );
    //   // await call(userId, callbackUrl);
    // } else {
    //   // Invalid PIN, retry
    //   voiceResponse.say("The PIN you entered is invalid. Please try again.");
    //   voiceResponse.redirect("https://full-octopus-cool.ngrok-free.app/api/conference/client-connect");
    // }

    const liveAgents = await prisma.liveCallAgent.count();

    if(liveAgents > 0)
    {
      voiceResponse.say("Welcome to Vorsto AI call center. All our agents are currently busy. Stay on the call an agent will connect with you shortly.");
      voiceResponse.dial().conference(
        conferenceId,
        {
          startConferenceOnEnter: false,
          endConferenceOnExit: true,
          waitUrl: AGENT_WAIT_URL,
          statusCallback: STATUS_URL,
          StatusCallbackMethod: "POST"
        }
      );
  
      const org = await prisma.organization.findFirst({
        where: {
          call_center_number: to
        }
      });
  
      await prisma.call.create({
        data: { 
          conferenceId, 
          from,
          status: "inqueue",
          organization_id: org.id
        },
      });
  
      await prisma.callQueue.create({
        data: { 
          conferenceId, 
          from,
          organization_id: org.id
        },
      });

    } else {
      voiceResponse.say("Welcome to Vorsto AI call center. Our agents are not available at this time. Please call back later, Thank you.");
      voiceResponse.hangup();
    }
      
    

    return new NextResponse(voiceResponse.toString(), {
      status: 200,
      headers: { 'Content-Type': 'text/xml' },
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
