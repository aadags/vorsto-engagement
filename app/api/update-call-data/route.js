"use server";
import { NextResponse } from "next/server";
import prisma from "@/db/prisma";

export async function POST(req) {
  try {

    const organizationId = Number(req.cookies.get("organizationId").value) ?? 0;
    const userId = Number(req.cookies.get("userId").value) ?? 0;
    const body = await req.json();
    const { conferenceId } = body;

    await prisma.call.update({
      where: {
        conferenceId: conferenceId,
        organization_id: organizationId,
      },
      data: { status: "insession", user_id: userId, agent_joined_at: new Date(), }
    });

    return NextResponse.json({ message: "Call Updated" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to call" },
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
