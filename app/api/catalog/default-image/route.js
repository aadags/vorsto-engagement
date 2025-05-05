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

    const { id, productId } = await req.json();

    const img = await prisma.image.findFirst({
      where: { id,
        product_id: productId 
      },
    });

    await prisma.product.update({
      where: {
        id: productId
      },
      data: {
        image: img.url
      }
    });

    await prisma.image.updateMany({
      where: {
        product_id: productId,
        id: {
          not: img.id,
        },
      },
      data: {
        default: false,
      },
    });

    await prisma.image.update({
      where: {
        id: img.id
      },
      data: {
        default: true
      }
    });
    
    return NextResponse.json({
      status: true
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to make default" },
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
