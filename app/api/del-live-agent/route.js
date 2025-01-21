"use server";
import { NextResponse } from "next/server";
import prisma from "@/db/prisma";

export async function POST(req) {
  try {

    const body = await req.json();
    const { socketId } = body;

    const agent = await prisma.liveCallAgent.delete({
      where: {
        id: socketId
      },
    });
    return NextResponse.json({ message: "Removed Agent" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to remove agent" },
      { status: 200 }
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
