"use server";
import { NextResponse } from "next/server";
import prisma from "@/db/prisma";

export async function POST(req) {
  try {
    const userId = Number(req.cookies.get("userId").value) ?? 0;

    const body = await req.json();
    const { id } = body;

    const conv = await prisma.conversation.update({
      data: {
        is_end: true,
      },
      where: {
        id: id,
      },
    });

    return NextResponse.json({ message: "Saved Conversation" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update conversation" },
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
