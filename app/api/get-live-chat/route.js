"use server";
import { NextResponse } from "next/server";
import prisma from "@/db/prisma";

export async function POST(req) {
  try {
    const userId = Number(req.cookies.get("userId").value) ?? 0;
    const orgId = Number(req.cookies.get("organizationId").value) ?? 0;

    const chats = await prisma.conversation.findMany({
      where: { user_id: userId, organization_id: orgId, is_end: false },
    });

    return NextResponse.json(chats);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to get chats" }, { status: 500 });
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
