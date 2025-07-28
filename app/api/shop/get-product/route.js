import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";


export async function GET(req) {
  try {

    const id = req.nextUrl.searchParams.get("id");

    const org = await prisma.organization.findFirst({
      where: { id },
    });

    const product = await prisma.product.findFirst({
      where: { id },
      include: {
        inventories: {
          where: { active: true },
          include: {
            ingredientUsages: {
              include: {
                ingredient: true
              }
            }
          }
        },
        images: true,
      }
    });

    const otherProducts = await prisma.product.findMany({
      where: {
        id: { not: id }, // exclude the current product
        organization_id: product.organization_id
      },
      take: 10,
      include: {
        inventories: {
          where: { active: true },
          include: {
            ingredientUsages: {
              include: {
                ingredient: true
              }
            }
          }
        },
        images: true, 
      }
    });

    if(org.type === "Food"){

      for (const inv of product.inventories) {
        const possibleCounts = inv.ingredientUsages.map((usage) => {
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
    
        inv.quantity = possibleCounts.length
          ? Math.min(...possibleCounts)
          : 0;
      }

      for (const product of otherProducts) {
        for (const inv of product.inventories) {
          const possibleCounts = inv.ingredientUsages.map((usage) => {
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
      
          inv.quantity = possibleCounts.length
            ? Math.min(...possibleCounts)
            : 0;
        }
      }
    }

    return NextResponse.json({ product: { ...product, otherProducts } });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch org" },
      { status: 500 }
    );
  }
}
