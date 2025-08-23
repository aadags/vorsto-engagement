import { NextResponse } from "next/server";
import prisma from "@/db/prisma";

export async function PUT(req) {
  try {
    
    const body = await req.json();
    const {
      id,
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

    // update deal main fields
    const deal = await prisma.deal.update({
      where: { id },
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
      },
    });

    // wipe old relations
    await prisma.dealInventory.deleteMany({ where: { dealId: id } });
    await prisma.dealProduct.deleteMany({ where: { dealId: id } });

    // re-add inventories
    if (inventories?.length > 0) {
      await prisma.dealInventory.createMany({
        data: inventories.map((inv) => ({
          dealId: id,
          inventoryId: inv.inventory_id,
          customPrice: inv.customPrice ? Number(inv.customPrice) : null,
          discountType: inv.discountType || null,
          discountValue: inv.discountValue ? Number(inv.discountValue) : null,
        })),
      });
    }

    // re-add products
    if (products?.length > 0) {
      await prisma.dealProduct.createMany({
        data: products.map((p) => ({
          dealId: id,
          productId: p.product_id,
          customPrice: p.customPrice ? Number(p.customPrice) : null,
          discountType: p.discountType || null,
          discountValue: p.discountValue ? Number(p.discountValue) : null,
        })),
      });
    }

    return NextResponse.json({ success: true, deal });
  } catch (err) {
    console.error("Error updating deal:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
