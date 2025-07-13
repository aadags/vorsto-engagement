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

    const products = await prisma.inventory.findMany({
      where: {
        active: true,
        product: {
          organization_id: organizationId,
          active: true
        },
      },
      orderBy: { created_at: 'desc' },
      include: { product: true }, // Optional: include product info in the result
    });
    

    return NextResponse.json({ data: products });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch convos" },
      { status: 500 }
    );
  }
}
