"use server";
import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import Stripe from "stripe";

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY, {
  apiVersion: "2024-12-18.acacia",
});

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

    const body = await req.json();

    const {
      name,
      description,
      sku,
      category,
      isNewCategory,
      newCategoryDescription,
      tax,
      taxType,
      image,
      outofstock,
      varieties,
    } = body;

    let cat = { id: category };

    if (isNewCategory) {
      cat = await prisma.category.create({
        data: {
          name: category,
          description: newCategoryDescription,
          organization_id: org.id,
        },
      });
    }

    const product = await prisma.product.create({
      data: {
        name,
        sku,
        description,
        category_id: cat.id,
        tax: parseFloat(tax),
        tax_type: taxType,
        outofstock,
        image: image.length > 0 ? image[0].secure_url : null,
        organization_id: org.id,
      },
    });

    for (const variety of varieties) {
      await prisma.inventory.create({
        data: {
          product_id: product.id,
          name: variety.name,
          barcode: variety.barcode || null,
          quantity: parseInt(variety.quantity) || 0,
          price: parseFloat(variety.price) * 100,
          price_unit: variety.price_unit,
          weight_available: parseFloat(variety.weight_available) || null,
          min_weight: parseFloat(variety.min_weight) || null,
          weight_step: parseFloat(variety.weight_step) || null,
        },
      });
    }

    for (const img of image) {
      await prisma.image.create({
        data: {
          product_id: product.id,
          url: img.secure_url,
          cloud_id: img.public_id,
        },
      });
    }

    return NextResponse.json({ product });
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
