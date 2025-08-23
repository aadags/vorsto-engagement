import { NextResponse } from "next/server";
import prisma from "@/db/prisma";

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const deal = await prisma.deal.findUnique({
      where: { id },
      include: {
        inventories: {
          include: {
            inventory: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        products: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!deal) {
      return NextResponse.json({ error: "Deal not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: deal.id,
      title: deal.title,
      description: deal.description,
      type: deal.type,
      startDate: deal.startDate,
      endDate: deal.endDate,
      recurrence: deal.recurrenceRule,
      discountType: deal.discountType,
      discountValue: deal.discountValue,
      imageUrl: deal.imageUrl,
      isActive: deal.isActive,
      inventories: deal.inventories.map((di) => ({
        inventoryId: di.inventoryId,
        name: di.inventory.name,
        customPrice: di.customPrice,
        discountType: di.discountType,
        discountValue: di.discountValue,
      })),
      products: deal.products.map((dp) => ({
        productId: dp.productId,
        name: dp.product.name,
        customPrice: dp.customPrice,
        discountType: dp.discountType,
        discountValue: dp.discountValue,
      })),
      createdAt: deal.createdAt,
      updatedAt: deal.updatedAt,
    });
  } catch (err) {
    console.error("Error fetching deal:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
