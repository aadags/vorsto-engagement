"use server";
import { NextResponse } from "next/server";
import { call } from "@/services/twilioCaller";
import prisma from "@/db/prisma";

function connectConferenceUrl(host, agentId, conferenceId) {
  return `${host}/api/conference/${conferenceId}/connect`;
}

export async function POST(req) {
  try {
    const userId = Number(req.cookies.get("userId")?.value ?? 0);
    const body = await req.json();
    const { agentId } = body;

    const existingCall = await prisma.call.findUniqueOrThrow({
      where: { userId },
      include: {
        organization: true,
      },
    });

    const callbackUrl = connectConferenceUrl(
      process.env.NEXT_PUBLIC_APP_URL,
      agentId,
      existingCall.conferenceId
    );
    await call(
      agentId,
      existingCall.organization.call_center_number,
      callbackUrl
    );

    return NextResponse.json({ message: "call transferred" });
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
