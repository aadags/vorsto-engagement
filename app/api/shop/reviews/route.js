import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    const hostname = req.nextUrl.searchParams.get("hostname");
    const limitParam = req.nextUrl.searchParams.get("limit");
    const offsetParam = req.nextUrl.searchParams.get("offset");
    const productId = req.nextUrl.searchParams.get("productId");
    const getAll = req.nextUrl.searchParams.get("all") === "true";

    const limit = Number(limitParam) || 10;
    const offset = Number(offsetParam) || 0;

    const org = await prisma.organization.findFirstOrThrow({
      where: { subdomain: hostname },
    });

    const where = {
      organization_id: org.id,
      ...(productId && { product_id: productId }),
    };

    const [reviews, totalCount] = await Promise.all([
      prisma.review.findMany({
        where,
        include: {
          product: true,
          contact: true,
        },
        ...(getAll ? {} : { take: limit, skip: offset }),
        orderBy: { created_at: "desc" },
      }),
      prisma.review.count({ where }),
    ]);

    const total = await prisma.review.aggregate({
      where,
      _sum: { rating: true },
    });

    return NextResponse.json({
      total: total._sum.rating || 0,
      count: totalCount,
      reviews,
    });

  } catch (error) {
    console.error("Review API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}
