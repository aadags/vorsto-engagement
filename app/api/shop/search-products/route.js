import { NextResponse } from 'next/server';
import prisma from '@/db/prisma';

export async function POST(req) {
  const { query = '', organizationId, categoryId, page = 1, limit = 20 } = await req.json();

  const skip = (page - 1) * limit;

  try {

    const org = await prisma.organization.findFirst({
      where: { id: organizationId },
    });

    const filters = {
      organization_id: organizationId,
      active: true,
      display: true,
    };

    if (categoryId) {
      filters.category_id = categoryId;
    }

    if (query.length < 3) {
      return NextResponse.json({
        data: [],
        page,
        limit,
        total: 0,
        totalPages: 0,
      });
    }

    // Prisma doesn't support 'mode' in all setups — removed it
    const where = query.length >= 3
      ? {
          ...filters,
          OR: [
            { name: { contains: query } },
            { description: { contains: query } },
            { sku: { contains: query } },
            { category: { name: { contains: query } } },
            {
              inventories: {
                some: {
                  name: { contains: query },
                },
              },
            }
          ],
        }
      : filters;

    const [data, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        include: {
          category: true,
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
      }),
      prisma.product.count({ where }),
    ]);

    if(org.type === "Food"){
      for (const product of data) {
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
      data,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
