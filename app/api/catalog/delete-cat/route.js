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
   
    const total = await prisma.product.count({
      where: { organization_id: organizationId, category_id: id },
    });

    if(total>0) {
      return NextResponse.json(
        { error: "Failed to delete category" },
        { status: 500 }
      );
    }

    await prisma.category.update({
      where: { id,
        organization_id: organizationId 
      },
      data: {
        active: false
      }
    });

    return NextResponse.json({ status: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}
