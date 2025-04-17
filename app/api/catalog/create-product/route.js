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
    
    const { name, description, image, currency, outofstock, varieties } = body;

    // 1. Create the product
    const stripeProduct = await stripe.products.create({
      name,
      description
    },
    {
      stripeAccount: org.stripe_account_id,
    });

    const product = await prisma.product.create({
      data: {
        name,
        description,
        currency,
        outofstock,
        stripeProductId: stripeProduct.id,
        organization_id: org.id
      }
    });

    for (const variety of varieties) {
      const stripePrice = await stripe.prices.create(
        {
          product: stripeProduct.id,
          unit_amount: variety.price,
          currency,
        },
        {
          stripeAccount: org.stripe_account_id,
        }
      );

      await prisma.inventory.create({
        data: {
          product_id: product.id,
          name: variety.name,
          quantity: variety.quantity,
          price: variety.price * 100,
          stripePriceId: stripePrice.id,
        },
      });
    }

    for (const [index, img] of image.entries()) {
      await prisma.image.create({
        data: {
          product_id: product.id,
          url: img,
          default: index === 0, // Set first image as default
        },
      });
    }
    
    return NextResponse.json({
      product
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to save comment" },
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
