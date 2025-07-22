import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

async function getCookieData() {
  const cookieData = cookies().get("organizationId");
  return cookieData ? cookieData.value : null;
}

export async function POST(req) {
  try {
    const organizationId = Number(await getCookieData()) || 0;
    const { id } = await req.json();

    await prisma.ingredientUsage.deleteMany({
      where: {
        ingredient_id: id
      }
    })

    await prisma.ingredient.delete({
      where: {
        id,
        organization_id: organizationId
      }
    })

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("restock-ingredient error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
