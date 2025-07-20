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
    const { id, amount } = await req.json();

    // Fetch the ingredient, scoped to this org
    const ing = await prisma.ingredient.findFirst({
      where: { id, organization_id: organizationId },
      select: {
        unit_type: true,
        quantity: true,
        weight_available: true,
      },
    });

    if (!ing) {
      return NextResponse.json(
        { error: "Ingredient not found" },
        { status: 404 }
      );
    }

    // Prepare update payload
    const data =
      ing.unit_type === "unit" || ing.unit_type === "ml"
        ? { quantity: (ing.quantity || 0) + Number(amount) }
        : { weight_available: (ing.weight_available || 0) + Number(amount) };

    // Perform update
    const updated = await prisma.ingredient.update({
      where: { id },
      data,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("restock-ingredient error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
