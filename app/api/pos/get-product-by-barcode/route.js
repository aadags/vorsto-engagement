import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";


export async function POST(req) {
  try {

    const body = await req.json();
    const { barcode, id } = body;

    const inventory = await prisma.inventory.findFirst({
      where: { barcode, active: true },
      include: {
        ingredientUsages: {
          include: {
            ingredient: true
          }
        }
      }
    });

    const product = await prisma.product.findFirst({
      where: { organization_id: id, id: inventory.product_id },
    });

    const possibleCounts = inventory.ingredientUsages.map((usage) => {
      const { ingredient } = usage;
      const unitType = ingredient.unit_type; // "unit", "kg", "lb", "ml", "g", etc.

      // UNIT-BASED: “unit” or “ml”
      if (unitType === 'unit' || unitType === 'ml') {
        const qtyPerPlate = usage.usage_quantity ?? 0;
        return qtyPerPlate > 0
          ? Math.floor(ingredient.quantity / qtyPerPlate)
          : Infinity;
      }

      // WEIGHT-BASED: “kg”, “lb”, “g”, etc.
      const weightPerPlate = usage.usage_weight ?? 0;
      return weightPerPlate > 0
        ? Math.floor(ingredient.weight_available / weightPerPlate)
        : Infinity;
    });

    inventory.quantity = possibleCounts.length
      ? Math.min(...possibleCounts)
      : 0;

    return NextResponse.json({ inventory, product });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch org" },
      { status: 500 }
    );
  }
}
