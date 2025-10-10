"use server";
import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import twilio from "twilio";

export async function POST(req) {
  try {
    const orgId = Number(req.cookies.get("organizationId")?.value ?? 0);

    await prisma.activateZuppr.create({
      data: {
        org_id: orgId
      }
    })
    
    return NextResponse.json({ status: true, message: "Account Activated" });
  } catch (error) {
    console.error(error);
    return NextResponse.json( { status: false, error: "Failed to activate account" }
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
