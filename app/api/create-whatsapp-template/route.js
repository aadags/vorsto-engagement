"use server";
import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import { createTemplate, createTemplateWithHeader } from "@/services/whatsapp";

export async function POST(req) {
  try {
    const organizationId = Number(req.cookies.get("organizationId").value) ?? 0;

    const body = await req.json();
    const { waba_id } = body;

    await createTemplateWithHeader("vorsto_support_enquiry", "{{1}} has joined this conversation and will be assisting you with your enquiry.", ["Daniel"], "Support Representative Connected", waba_id);
    // await createTemplate("vorsto_support_check_in", "Hello, Thank you for your patience on your enquiry. {{1}}", ["Your enquiry has been resolved"], waba_id);

    
    return NextResponse.json({ message: "template created" });
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
