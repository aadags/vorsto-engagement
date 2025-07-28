import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

async function getOrgId() {
  const c = cookies().get("organizationId");
  return c ? Number(c.value) : 0;
}

export async function GET(req) {
  try {
    const orgId = await getOrgId();
    const page     = parseInt(req.nextUrl.searchParams.get("page"))     || 1;
    const per_page = parseInt(req.nextUrl.searchParams.get("per_page")) || 10;

    const inventories = await prisma.inventory.findMany({
      where: { active: true, product: { organization_id: orgId } },
      include: {
        ingredientUsages: {
          include: { ingredient: true },
        },
      },
      skip: (page - 1) * per_page,
      take: per_page,
    });

    const total = await prisma.inventory.count({
      where: { product: { organization_id: orgId } },
    });

    const data = inventories.map((inv) => {
      const costCents = inv.ingredientUsages.reduce((sum, u) => {
        const priceCents = u.ingredient.price; 
        if (u.ingredient.unit_type === "unit" || u.ingredient.unit_type === "ml") {
          return sum + u.usage_quantity * priceCents;
        }
        else {
          return sum + u.usage_weight * priceCents;
        }
      }, 0);

      return {
        id:              inv.id,
        name:            inv.name,
        totalCost:       costCents,
        salePrice:       inv.price,
      };
    });

    return NextResponse.json({ data, count: total });
  } catch (err) {
    console.error("get-cost-analysis-list error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
