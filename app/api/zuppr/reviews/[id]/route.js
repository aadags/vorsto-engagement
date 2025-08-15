// app/api/stores/[orgId]/reviews/route.js
"use server";
import { NextResponse } from "next/server";
import prisma from "@/db/prisma";

function cors(res) {
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return res;
}

export async function OPTIONS() { return cors(new NextResponse(null, { status: 204 })); }

export async function GET(req, { params }) {
  try {
    const orgId = Number(params.id);
    const { searchParams } = new URL(req.url);
    const limit  = Math.min(Number(searchParams.get("limit") || 10), 50);
    const offset = Number(searchParams.get("offset") || 0);

    const items = await prisma.review.findMany({
      where: { organization_id: orgId },
      orderBy: { created_at: "desc" },
      take: limit,
      skip: offset,
      select: {
        id: true, rating: true, message: true, created_at: true,
        contact: { select: { name: true } },
        product: { select: { name: true } },
      },
    });

    return cors(NextResponse.json({ success: true, items }));
  } catch (e) {
    console.error(e);
    return cors(NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 }));
  }
}
