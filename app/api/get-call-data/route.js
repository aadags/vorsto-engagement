"use server";
import { NextResponse } from "next/server";
import prisma from "@/db/prisma";

export async function POST(req) {
  try {

    const organizationId = Number(req.cookies.get("organizationId").value) ?? 0;
    const userId = Number(req.cookies.get("userId").value) ?? 0;
    const body = await req.json();
    const { conferenceId } = body;

    const call = await prisma.callQueue.findFirst({
      where: { user_id: userId, organization_id: organizationId },
    });

    await prisma.callQueue.update({
      where: {
        user_id: userId,
        organization_id: organizationId,
      },
      data: { status: "insession" }
    });

    return NextResponse.json({ call });
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
