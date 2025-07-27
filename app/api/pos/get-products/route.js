import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";


export async function POST(req) {
  try {

    const body = await req.json();
    const { id, categoryId } = body;

    // build base filter
    const where = {
      organization_id: id,
      active: true,
    };
    
    // if we're not in “Recent” mode, add the category filter
    if (categoryId !== 'Recent') {
      where.category_id = categoryId;
    }
    
    const products = await prisma.product.findMany({
      where,
      include: {
        inventories: {
          where: { active: true },
        },
      },
      take: 16
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch org" },
      { status: 500 }
    );
  }
}
