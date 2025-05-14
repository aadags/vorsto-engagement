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
    
    const { name, tagline, phone, email, country } = body;

    const countryToCurrency = {
      US: "USD",
      CA: "CAD",
      GB: "GBP",
      NG: "NGN",
      IN: "INR",
      JP: "JPY",
      DE: "EUR",
      FR: "EUR",
    };

    const currency = countryToCurrency[country.toUpperCase()] || "USD";

    await prisma.organization.update({
      where:{
        id: org.id
      }, 
      data: {
        name,
        tagline,
        contact_number: phone,
        contact_email: email,
        country,
        currency,
        onboarding: true,
      }
    })
    
    return NextResponse.json({
      status: true
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to save business" },
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
