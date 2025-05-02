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
    
    const { name, description, category, isNewCategory, tax, taxType, image, outofstock, varieties } = body;

    let cat = { id: category };

    if(isNewCategory) {

      cat = await prisma.category.create({
        data: {
          name: category,
          organization_id: org.id
        }
      });

    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        category_id: cat.id,
        tax,
        tax_type: taxType,
        outofstock,
        organization_id: org.id
      }
    });

    for (const variety of varieties) {

      await prisma.inventory.create({
        data: {
          product_id: product.id,
          name: variety.name,
          quantity: variety.quantity,
          price: variety.price * 100,
        },
      });
    }

    for (const [index, img] of image.entries()) {
      await prisma.image.create({
        data: {
          product_id: product.id,
          url: img.secure_url,
          cloud_id: img.public_id,
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
