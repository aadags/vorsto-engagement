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
        inventories: {
          where: { active: true },
          include: {
            ingredientUsages: {
              include: {
                ingredient: true, // fetch the full ingredient object
              },
            },
          },
        }
      },
    });

    if (product) {
      product.inventories = product.inventories.map(inventory => ({
        inventory_id: inventory.id,
        inventory_name: inventory.name,
        ingredients: inventory.ingredientUsages.map(usage => ({
          ingredient_id: usage.ingredient.id,
          name: usage.ingredient.name,
          unit_type: usage.ingredient.unit_type,
          usage_quantity: usage.usage_quantity,
          usage_weight: usage.usage_weight,
        })),
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
