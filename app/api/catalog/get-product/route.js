import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

async function getCookieData() {
  const cookieData = cookies().get("organizationId");
  return cookieData ? cookieData.value : null;
}

export async function GET(req) {
  try {

    const cookieData = await getCookieData();
    const organizationId = Number(cookieData) ?? 0;

    const id = req.nextUrl.searchParams.get("id");

    const product = await prisma.product.findFirst({
      where: {
        id,
        organization_id: organizationId,
      },
      include: {
        inventories: {
          where: { active: true },
        },
        comboItems: {
          include: { inventory: true },
          orderBy: { option_index: 'asc' },
        },
        images: true,
        category: true,
      },
    });
    
    if (product) {
      // 1. convert inventory prices to dollars
      product.inventories = product.inventories.map(inv => ({
        ...inv,
        price: inv.price / 100,
      }));
    
      // 2. build nested comboOptions
      const comboOptions = [];
    
      product.comboItems.forEach(combo => {
        const idx = combo.option_index;
        if (!comboOptions[idx]) {
          comboOptions[idx] = { items: [] };
        }
        comboOptions[idx].items.push({
          ...combo,
          // 3. convert extra_price to dollars for the UI
          extra_price: combo.extra_price != null
            ? combo.extra_price / 100
            : 0,
        });
      });

      product.comboOptions = comboOptions;
    
    }
    

    return NextResponse.json({ ...product });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}
