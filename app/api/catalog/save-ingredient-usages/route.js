import { NextResponse } from "next/server";
import prisma from "@/db/prisma";

export async function POST(request) {
  try {
    const { rows } = await request.json();

    await prisma.$transaction(async (tx) => {
      // 1. Delete existing usages for these inventories
      const inventoryIds = [...new Set(rows.map((r) => r.inventory_id))];
      await tx.ingredientUsage.deleteMany({
        where: { inventory_id: { in: inventoryIds } },
      });

      // 2. Build bulk‑insert payload
      const toCreate = rows.flatMap((row) =>
        row.ingredients.map((u) => ({
          inventory_id:  row.inventory_id,
          ingredient_id: u.ingredient_id,
          usage_quantity: u.usage_quantity != null
            ? Number(u.usage_quantity)
            : null,
          usage_weight:   u.usage_weight   != null
            ? Number(u.usage_weight)
            : null,
        }))
      );

      // 3. Insert all new usages
      if (toCreate.length) {
        await tx.ingredientUsage.createMany({ data: toCreate });
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("save-ingredient-usages error:", error);
    return NextResponse.json(
      { error: "Failed to save ingredient usages" },
      { status: 500 }
    );
  }
}
