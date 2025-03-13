"use server";
import { NextResponse } from "next/server";
import prisma from "@/db/prisma";

export async function POST(req) {
  try {
    const { id } = await req.json();

    await prisma.tool.deleteMany({
      where: {
        bot_id: id,
      },
    });

    await prisma.bot.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json({
      status: true,
      message: "Bot deleted",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update bot and functions" },
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
