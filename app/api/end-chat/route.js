"use server";
import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import faktory from "faktory-worker";

export async function POST(req) {
  try {
    const organizationId = Number(
      req.cookies.get("organizationId")?.value ?? 0
    );

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

    const client = await faktory.connect({
      url: process.env.FAKTORY_URL || "",
    });

    await client.push({
      jobtype: "RunContactSentiment",
      args: [
        {
          type: "conversation",
          id,
          contactId: conv.contact_id,
          orgId: organizationId,
        },
      ],
      queue: "default", // or specify another queue
      at: new Date(Date.now() + 1000),
    });

    await client.close();

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
