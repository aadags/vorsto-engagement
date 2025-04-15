"use server";
import { NextResponse } from "next/server";
import prisma from "@/db/prisma";

export async function POST(req) {
  try {
    const organizationId = Number(
      req.cookies.get("organizationId")?.value ?? 0
    );

    const { ticketId } = await req.json();

    await prisma.ticket.update({
      where: {
        id: ticketId,
        organization_id: organizationId,
      },
      data: {
        is_closed: false,
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
