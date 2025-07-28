import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";


export async function GET(req) {
  try {

    const hostname = req.nextUrl.searchParams.get("hostname");
    const limitParam = req.nextUrl.searchParams.get("limit");
    const categoryId = req.nextUrl.searchParams.get("categoryId");
    const getAll = req.nextUrl.searchParams.get("all") === "true";

    const org = await prisma.organization.findFirst({
      where: { subdomain: hostname },
    });

    const where = {
      active: true,
      organization_id: org.id,
      ...(categoryId && { category_id: categoryId }),
    };

    const products = await prisma.product.findMany({
      where,
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
      },
      ...(getAll ? {} : { take: Number(limitParam) || 10 }),
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
