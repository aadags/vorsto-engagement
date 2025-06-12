"use server";
import { NextResponse } from "next/server";
import prisma from "@/db/prisma";

export async function POST(req) {
  try {
    const body = await req.json();
    const organizationId = Number(
      req.cookies.get("organizationId")?.value ?? 0
    );

    const {
      humanTakeOver, 
      systemBio, 
      autoEngage, 
      autoFeedBack, 
      autoMarketing
    } = body;

    const bot = await prisma.organization.update({
      where: {
        id: organizationId
      }, 
      data: {
        ai_human_take_over: humanTakeOver,
        ai_system_bio: systemBio,
        ai_auto_engage: autoEngage,
        ai_auto_feedBack: autoFeedBack,
        ai_auto_marketing: autoMarketing
      },
    });

    return NextResponse.json({
      message: "Bot created functions",
      data: bot,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create bot and functions" },
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
