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
      type,
      comboPrice,
      description,
      sku,
      category,
      isNewCategory,
      newCategoryDescription,
      image,
      tax,
      taxType,
      outofstock,
      display,
      varieties,
      comboOptions
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
        combo_price: Number(comboPrice || 0) * 100,
        sku,
        category_id: cat.id,
        tax: parseFloat(tax),
        tax_type: taxType,
        outofstock,
        display
      },
    });

    // Handle inventory (varieties)
    if(type === "default")
    {
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
        await tx.comboItem.deleteMany({ where: { product_id: product.id } });
        await tx.comboRule.deleteMany({ where: { product_id: product.id } });
    
        if (rulesData.length) {
          await tx.comboRule.createMany({ data: rulesData });
        }
        if (itemsData.length) {
          await tx.comboItem.createMany({ data: itemsData, skipDuplicates: true });
        }
    
        return { ok: true, rules: rulesData.length, items: itemsData.length };
      });
    

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
