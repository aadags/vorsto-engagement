"use server";
import { NextResponse } from "next/server";
import prisma from "@/db/prisma";

export async function POST(req) {
  try {
    const organizationId = Number(req.cookies.get("organizationId").value) ?? 0;

    const body = await req.json();
    const { title, checkboxes } = body;

    const user = await prisma.role.create({
      data: {
        title,
        permissions: JSON.stringify(checkboxes),
        organization_id: organizationId,
      },
    });
    return NextResponse.json({ message: "Saved Role" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to save Role" },
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
