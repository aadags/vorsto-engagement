import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";


export async function GET(req) {
  try {

    const hostname = req.nextUrl.searchParams.get("hostname");

    const org = await prisma.organization.findFirst({
      where: { subdomain: hostname }
    });

    const paymentProcessor = await prisma.paymentProcessor.findFirst({
      where: { name: "VorstoPay", organization_id: org.id },
    });

    const categoriesWithProducts = await prisma.category.findMany({
      where: { organization_id: org.id, active: true },
      orderBy: {
        arrangement: 'asc',
      },
      include: {
        products: {
          take: 1, // limit to 1 product
          where: {
            active: true, // only include active products
          },
        },
      },
    });

    const categories = categoriesWithProducts.filter(cat => cat.products.length > 0);

    return NextResponse.json({ org, categories, paymentProcessor });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch org" },
      { status: 500 }
    );
  }
}
