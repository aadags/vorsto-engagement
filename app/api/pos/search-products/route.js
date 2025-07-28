import { NextResponse } from 'next/server';
import prisma from '@/db/prisma';

export async function POST(req) {
  const body = await req.json();
    const { id, query } = body;

    const org = await prisma.organization.findFirst({
      where: { id },
    });

  try {
    const filters = {
      organization_id: id,
      active: true,
      display: true,
    };

    if (query.length < 3) {
      return NextResponse.json({
        products: [],
      });
    }

    // Prisma doesn't support 'mode' in all setups — removed it
    const where =
    query.length >= 3
      ? {
          ...filters,
          OR: [
            { name: { contains: query } },             // String
            { description: { contains: query } },      // String
            { sku: { contains: query } },              // String
            {
              category: {
                name: { contains: query },             // String
              },
            },
            {
              inventories: {
                some: {
                  OR: [
                    { name: { contains: query } },     // String
                    { barcode: { contains: query } },  // String
                  ],
                },
              },
            },
          ],
        }
      : filters;  

    const [products] = await Promise.all([
      prisma.product.findMany({
        where,
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
      })
    ]);

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

    return NextResponse.json({
      products
    });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
