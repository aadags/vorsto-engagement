"use server";
import { NextResponse } from "next/server";
import prisma from "@/db/prisma";

export async function POST(req) {
  try {
    const organizationId = Number(req.cookies.get("organizationId").value) ?? 0;
    const userId = Number(req.cookies.get("userId").value) ?? 0;

    const body = await req.json();
    const { title, category, priority, description, callId, conversationId } = body;

    const ticket = await prisma.ticket.create({
      data: {
        title,
        category,
        priority,
        description,
        call_id: callId || null,
        conversation_id: conversationId || null,
        organization_id: organizationId,
        user_id: userId
      },
    });
    return NextResponse.json({ message: "Ticket Saved" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to save ticket" },
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
