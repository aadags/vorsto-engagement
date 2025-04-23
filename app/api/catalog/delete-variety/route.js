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
    
    const { id } = body;

    const existing = await prisma.inventory.findFirst({
      where: {
        id: id
      }
    });

    await stripe.prices.update(existing.stripePriceId, {
      active: false,
    },
    {
      stripeAccount: org.stripe_account_id,
    });

    await prisma.inventory.update({
      where: {
        id: id
      },
      data: {
        active: false
      }
    });

    return NextResponse.json({
      status: true
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete inventory" },
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
