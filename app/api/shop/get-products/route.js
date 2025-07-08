import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";


export async function GET(req) {
  try {

    const hostname = req.nextUrl.searchParams.get("hostname");
    const limitParam = req.nextUrl.searchParams.get("limit");
    const categoryId = req.nextUrl.searchParams.get("categoryId");
    const getAll = req.nextUrl.searchParams.get("all") === "true";

    const org = await prisma.organization.findFirst({
      where: { subdomain: hostname },
    });

    const where = {
      active: true,
      organization_id: org.id,
      ...(categoryId && { category_id: categoryId }),
    };

    const products = await prisma.product.findMany({
      where,
      include: {
        inventories: {
          where: { active: true },
        },
        images: true,
      },
      ...(getAll ? {} : { take: Number(limitParam) || 10 }),
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
