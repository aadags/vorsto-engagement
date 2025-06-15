import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";


export async function GET(req) {
  try {

    const hostname = req.nextUrl.searchParams.get("hostname");
    const limitParam = req.nextUrl.searchParams.get("limit");
    const productId = req.nextUrl.searchParams.get("productId");
    const getAll = req.nextUrl.searchParams.get("all") === "true";

    const org = await prisma.organization.findFirst({
      where: { subdomain: hostname },
    });

    const where = {
      organization_id: org.id,
      ...(productId && { product_id: productId }),
    };

    const reviews = await prisma.review.findMany({
      where,
      include: {
        product: true,
        contact: true,
      },
      ...(getAll ? {} : { take: Number(limitParam) || 10 }),
    });
    
    const total = reviews.reduce((sum, r) => sum + (r.rating || 0), 0);
    const count = reviews.length;
    
    return NextResponse.json({ total, count, reviews });
    
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch org" },
      { status: 500 }
    );
  }
}
