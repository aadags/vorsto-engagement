"use server";

import { NextResponse } from "next/server";
import prisma from "@/db/prisma";

function cors(res) {
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return res;
}

export async function OPTIONS() {
  return cors(new NextResponse(null, { status: 204 }));
}

export async function GET(req, { params }) {
  try {
    const orgId = Number(params.id); // org ids are numeric (Review.organization_id Int?)
    if (!Number.isFinite(orgId)) {
      return cors(NextResponse.json({ error: "Invalid id" }, { status: 400 }));
    }

    // 1) Store + active/display products
    const org = await prisma.organization.findUnique({
      where: { id: orgId },
      include: {
        products: {
          where: { active: true, display: true },
          include: { category: true, comboRules: true, 
            comboItems: {
              include: {
                inventory: true
              }
            },
            inventories: {
              where: { active: true }
            } 
          },
        },
      },
    });

    if (!org) {
      return cors(NextResponse.json({ error: "Store not found" }, { status: 404 }));
    }

    // 2) Org-level average rating & review count
    const orgAgg = await prisma.review.aggregate({
      where: { organization_id: orgId },
      _avg: { rating: true },
      _count: { _all: true },
    });

    const orgAverageRating =
      orgAgg._avg.rating != null ? Number(orgAgg._avg.rating.toFixed(2)) : null;
    const orgReviewCount = orgAgg._count._all || 0;

    // 3) Product-level averages (only for this store’s products)
    const productIds = org.products.map((p) => p.id);
    let perProduct = {};
    if (productIds.length) {
      const groups = await prisma.review.groupBy({
        by: ["product_id"],
        where: { product_id: { in: productIds } },
        _avg: { rating: true },
        _count: { _all: true },
      });
      perProduct = groups.reduce((acc, g) => {
        acc[g.product_id] = {
          avgRating:
            g._avg.rating != null ? Number(g._avg.rating.toFixed(2)) : null,
          reviewCount: g._count._all || 0,
        };
        return acc;
      }, {});
    }

    // 4) Attach per-product stats
    const products = org.products.map((p) => ({
      ...p,
      avgRating: perProduct[p.id]?.avgRating ?? null,
      reviewCount: perProduct[p.id]?.reviewCount ?? 0,
    }));

    const payload = {
      ...org,
      products,
      avgRating: orgAverageRating,
      reviewCount: orgReviewCount,
    };

    return cors(NextResponse.json({ success: true, data: payload }));
  } catch (err) {
    console.error("GET STORE ERROR:", err);
    return cors(
      NextResponse.json({ error: "Failed to fetch store" }, { status: 500 })
    );
  }
}
