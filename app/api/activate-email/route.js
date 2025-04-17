"use server";
import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import twilio from "twilio";

export async function POST(req) {
  try {
    const userId = Number(req.cookies.get("userId")?.value ?? 0);
    const oscode = Number(req.cookies.get("code")?.value ?? 0);

    const body = await req.json();
    const { code } = body;
    
    if(oscode != Number(code))
    {
      return NextResponse.json( { status: false, error: "Failed to verify code" }
      );
    }

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: { is_validated: true }
    });
    
    return NextResponse.json({ status: true, message: "Account Activated" });
  } catch (error) {
    console.error(error);
    return NextResponse.json( { status: false, error: "Failed to verify code" }
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
