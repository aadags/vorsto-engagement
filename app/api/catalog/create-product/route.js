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
      type,
      description,
      sku,
      category,
      comboPrice,
      isNewCategory,
      newCategoryDescription,
      tax,
      taxType,
      image,
      outofstock,
      display,
      varieties,
      comboOptions
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
        combo_price: Number(comboPrice || 0) * 100,
        type,
        sku,
        description,
        category_id: cat.id,
        tax: parseFloat(tax),
        tax_type: taxType,
        outofstock,
        display,
        image: image.length > 0 ? image[0].secure_url : null,
        organization_id: org.id,
      },
    });

    if(type === "default")
    {
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
    }

    if(type === "combo")
    {

      const rulesData = comboOptions.map((opt, idx) => {
        const min =
          opt.min === '' || opt.min == null
            ? (opt.required ? 1 : null)
            : Number(opt.min);
        const max =
          opt.max === '' || opt.max == null
            ? null
            : Number(opt.max);
    
        if (min != null && max != null && min > max) {
          throw new Error(`Option ${idx + 1}: min cannot be greater than max`);
        }
    
        return {
          product_id: product.id,
          option_index: idx,
          label: opt.label ?? null,
          required: !!opt.required,
          min, // can be null
          max, // can be null
        };
      });
    
      // Build items
      const itemsData = comboOptions.flatMap((opt, idx) =>
        (opt.items || [])
          .filter((itm) => !!itm.inventory_id)
          .map((itm) => ({
            product_id: product.id,
            inventory_id: itm.inventory_id,
            extra_price: Math.round(Number(itm.extra_price || 0) * 100), // cents
            option_index: idx,
          }))
      );
    
      // Transaction: wipe old, insert new
      prisma.$transaction(async (tx) => {
    
        if (rulesData.length) {
          await tx.comboRule.createMany({ data: rulesData });
        }
        if (itemsData.length) {
          await tx.comboItem.createMany({ data: itemsData, skipDuplicates: true });
        }
    
        return { ok: true, rules: rulesData.length, items: itemsData.length };
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
