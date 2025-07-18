import { NextResponse } from 'next/server';
import prisma from '@/db/prisma';

export async function POST(req) {
  const body = await req.json();
    const { id, query } = body;

  try {
    const filters = {
      organization_id: id,
      active: true,
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
          inventories: true
        },
      })
    ]);

    return NextResponse.json({
      products
    });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
