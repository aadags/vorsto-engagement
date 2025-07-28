import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";


export async function POST(req) {
  try {

    const body = await req.json();
    const { id, categoryId } = body;

    const org = await prisma.organization.findFirst({
      where: { id },
    });

    // build dynamic “where”
    const where = {
      organization_id: id,
      active: true,
      // only filter by category when not “Recent”
      ...(categoryId !== 'Recent' && { category_id: categoryId }),
    };
    
    const products = await prisma.product.findMany({
      where,
      // when “Recent”, sort by newest first
      orderBy: { updated_at: 'desc' },
      // when “Recent”, only grab the latest 16
      take: 20,
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
      },
    });

    if(org.type === "Food"){
      for (const product of products) {
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
    

    return NextResponse.json({ products });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch org" },
      { status: 500 }
    );
  }
}
