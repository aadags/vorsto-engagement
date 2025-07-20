"use server";
import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import Stripe from "stripe";

export async function POST(req) {
  try {
    const organizationId = Number(
      req.cookies.get("organizationId")?.value ?? 0
    );

    const org = await prisma.organization.findFirst({
      where: { id: organizationId },
    });

    if (!org) {
      return NextResponse.json(
        { error: "Organization not found" },
        { status: 404 }
      );
    }

    const { name, unit_type, available_quantity, available_weight } = await req.json();

    // Upsert by unique “name”
    const ingredient = await prisma.ingredient.create({
      data: {
        name: name.trim(),
        unit_type,
        quantity: Number(available_quantity || 0),
        weight_available: Number(available_weight || 0),
        organization_id: organizationId
      },
    });

    return NextResponse.json({ id: ingredient.id });


  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create product" },
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
