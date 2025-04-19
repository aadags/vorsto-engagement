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
      where: { id,
        organization_id: organizationId 
      },
      include: {
        inventories: true,
        images: true
      }
    });

    if (product) {
      product.inventories = product.inventories.map(inventory => ({
        ...inventory,
        price: inventory.price / 100,
      }));
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
