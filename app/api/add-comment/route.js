"use server";
import { NextResponse } from "next/server";
import prisma from "@/db/prisma";

export async function POST(req) {
  try {
    const organizationId = Number(
      req.cookies.get("organizationId")?.value ?? 0
    );
    const userId = Number(req.cookies.get("userId")?.value ?? 0);

    const body = await req.json();
    const { ticketId, comment } = body;

    const cmt = await prisma.comment.create({
      data: {
        body: comment,
        ticket_id: ticketId,
        organization_id: organizationId,
        user_id: userId,
      },
    });
    return NextResponse.json({ message: "Comment Saved" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to save comment" },
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
