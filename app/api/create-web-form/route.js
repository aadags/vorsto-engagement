"use server";
import { NextResponse } from "next/server";
import prisma from "@/db/prisma";

export async function POST(req) {
  try {
    const organizationId = Number(req.cookies.get("organizationId").value) ?? 0;

    const body = await req.json();
    const { formTitle, formDesc, questions } = body;

    const form = await prisma.form.create({
      data: {
        name: formTitle,
        description: formDesc,
        data: JSON.stringify({ questions }),
        organization_id: organizationId,
      },
    });
    return NextResponse.json({ message: "Saved User" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to save conversation" },
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
