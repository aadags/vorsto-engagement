import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";


export async function POST(req) {
  try {

    const body = await req.json();
    const { id, categoryId } = body;

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
      take: 32,
      include: {
        inventories: {
          where: { active: true },
        },
      },
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
