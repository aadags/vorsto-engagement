"use server";
import { NextResponse } from "next/server";
import prisma from "@/db/prisma";

export async function POST(req) {
  try {
    const organizationId = Number(
      req.cookies.get("organizationId")?.value ?? 0
    );

    const pp = await prisma.paymentProcessor.findFirstOrThrow({
      where: { name: "Square", organization_id: organizationId },
    });

    const body = await req.json();
    const { defaultLocation } = body;

    await prisma.paymentProcessor.update({
      where:{
        id: pp.id
      }, 
      data: {
        location: defaultLocation
      }
    })
    
    return NextResponse.json({
      status: true
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to save loc" },
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
