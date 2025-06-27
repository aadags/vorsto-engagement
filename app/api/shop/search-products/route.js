import { NextResponse } from 'next/server';
import prisma from '@/db/prisma';

export async function POST(req) {
  const { query = '', organizationId, categoryId, page = 1, limit = 20 } = await req.json();

  const skip = (page - 1) * limit;

  try {
    const filters = {
      organization_id: organizationId,
      active: true,
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
          inventories: true
        },
      }),
      prisma.product.count({ where }),
    ]);

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
