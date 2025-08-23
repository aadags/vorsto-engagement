import { NextResponse } from "next/server";
import prisma from "@/db/prisma";

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
      title,
      description,
      type,
      startDate,
      endDate,
      recurrence,
      discountType,
      discountValue,
      inventories,
      products,
      image,
      isActive,
    } = body;

    // Basic validation
    if (!title || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Create deal
    const deal = await prisma.deal.create({
      data: {
        title,
        description,
        type,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        recurrenceRule: type === "RECURRING" ? recurrence : undefined,
        discountType,
        discountValue: discountValue ? Number(discountValue) : null,
        isActive: isActive ?? true,
        imageUrl: image?.[0] ?? null,
        organization_id: organizationId,
        inventories: {
          create: inventories.map((inv) => ({
            inventoryId: inv.inventory_id,
            customPrice: inv.customPrice ? Number(inv.customPrice) : null,
            discountType: inv.discountType || null,
            discountValue: inv.discountValue ? Number(inv.discountValue) : null,
          })),
        },
        products: {
          create: products.map((p) => ({
            productId: p.product_id,
            customPrice: p.customPrice ? Number(p.customPrice) : null,
            discountType: p.discountType || null,
            discountValue: p.discountValue ? Number(p.discountValue) : null,
          })),
        },
      },
    });

    return NextResponse.json({ success: true, deal });
  } catch (err) {
    console.error("Error creating deal:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
