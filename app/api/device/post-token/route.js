"use server";
import { NextResponse } from "next/server";
import prisma from "@/db/prisma";

export async function POST(req) {
  try {
    const body = await req.json();
    const { id, token, device } = body;

    if (!token) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: {
        email: id
      }
    });

    const dd = await prisma.device.upsert({
      where: { token, uid: device.id }, // if id is null or undefined, it won't match anything
      update: {
        name: device.name,
        type: device.type,
        organization_id: user.organization_id,
      },
      create: {
        name: device.name,
        token,
        type: device.type,
        uid: device.id,
        organization_id: user.organization_id,
      },
    });

    return NextResponse.json({ message: "Saved token", dd });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to save device" },
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
