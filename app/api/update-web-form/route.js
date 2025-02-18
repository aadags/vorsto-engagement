"use server";
import { NextResponse } from "next/server";
import prisma from "@/db/prisma";

export async function POST(req) {
  try {
    const organizationId = Number(req.cookies.get("organizationId").value) ?? 0;

    const body = await req.json();
    const { formId, formTitle, formDesc, questions } = body;

    const form = await prisma.form.update({
      where: {
        id: formId,
        organization_id: organizationId
      },
      data: {
        name: formTitle,
        description: formDesc,
        data: JSON.stringify({ questions }),
      },
    });
    return NextResponse.json({ message: "Saved web form" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to save web form" },
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
