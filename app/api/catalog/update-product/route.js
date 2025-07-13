"use server";
import { NextResponse } from "next/server";
import prisma from "@/db/prisma";

export async function POST(req) {
  try {
    const organizationId = Number(req.cookies.get("organizationId")?.value ?? 0);

    const org = await prisma.organization.findFirst({
      where: { id: organizationId },
    });

    if (!org) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    }

    const body = await req.json();

    const {
      id,
      name,
      description,
      sku,
      category,
      isNewCategory,
      newCategoryDescription,
      image,
      tax,
      taxType,
      outofstock,
      varieties,
    } = body;

    let cat = { id: category };

    // Create new category if needed
    if (isNewCategory) {
      cat = await prisma.category.create({
        data: {
          name: category,
          description: newCategoryDescription,
          organization_id: org.id,
        },
      });
    }

    // Update the product
    const product = await prisma.product.update({
      where: {
        id,
        organization_id: org.id,
      },
      data: {
        name,
        description,
        sku,
        category_id: cat.id,
        tax: parseFloat(tax),
        tax_type: taxType,
        outofstock,
      },
    });

    // Handle inventory (varieties)
    for (const variety of varieties) {
      const payload = {
        name: variety.name,
        barcode: variety.barcode || null,
        quantity: parseInt(variety.quantity) || 0,
        price: parseFloat(variety.price) * 100, // cents
        price_unit: variety.price_unit,
        weight_available: parseFloat(variety.weight_available) || null,
        min_weight: parseFloat(variety.min_weight) || null,
        weight_step: parseFloat(variety.weight_step) || null,
      };

      if (!variety.id) {
        // Create new variety
        await prisma.inventory.create({
          data: {
            ...payload,
            product_id: product.id,
          },
        });
      } else {
        // Update existing variety
        await prisma.inventory.update({
          where: {
            id: variety.id,
          },
          data: payload,
        });
      }
    }

    // Save new images (assumes duplicates are handled in the UI or DB constraint)
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
    console.error("Product update error:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
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
