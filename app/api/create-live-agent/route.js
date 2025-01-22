"use server";
import { NextResponse } from "next/server";
import prisma from "@/db/prisma";

export async function POST(req) {
  try {

    const body = await req.json();
    const { socketId, userId } = body;

    const user = await prisma.user.findFirst({
      where: { id: userId },
    });

    const agent = await prisma.liveCallAgent.create({
      data: {
        id: socketId,
        user_id: userId,
        organization_id: user.organization_id
      },
    });
    return NextResponse.json({ message: "Saved Agent" });
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
