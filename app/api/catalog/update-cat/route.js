"use server";
import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import Stripe from 'stripe';

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia', // Use the correct API version
});


export async function POST(req) {
  try {
    const organizationId = Number(
      req.cookies.get("organizationId")?.value ?? 0
    );

    const org = await prisma.organization.findFirst({
      where: { id: organizationId },
    });

    const body = await req.json();
    
    const { id, name, description } = body;

    const category = await prisma.category.update({
      where: {
        id, organization_id: org.id
      },
      data: {
        name,
        description
      }
    });
    
    return NextResponse.json({
      category
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to save category" },
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
