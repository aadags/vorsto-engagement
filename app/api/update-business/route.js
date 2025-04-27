"use server";
import { NextResponse } from "next/server";
import prisma from "@/db/prisma";

export async function POST(req) {
  try {
    const organizationId = Number(
      req.cookies.get("organizationId")?.value ?? 0
    );

    const org = await prisma.organization.findFirstOrThrow({
      where: { id: organizationId },
    });

    const body = await req.json();

    const countryToCurrency= {
      US: 'USD',
      CA: 'CAD',
      GB: 'GBP',
      EU: 'EUR',
      NG: 'NGN',
      KE: 'KES',
      // Add more as needed
    };
    
    const { name, country } = body;

    await prisma.organization.update({
      where:{
        id: org.id
      }, 
      data: {
        name,
        country,
        currency: countryToCurrency[country],
        onboarding: true
      }
    })
    
    return NextResponse.json({
      status: true
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to save product" },
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
