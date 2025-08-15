// app/api/verify-code/route.js
"use server";

import { NextResponse } from "next/server";
import Redis from "ioredis";
import prisma from "@/db/prisma";

const redis = new Redis(process.env.REDIS);

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

export async function POST(req) {
  try {
    const { lat, lng } = await req.json();
    if (lat == null || lng == null) {
      return NextResponse.json({ error: "Lat and Lng are required" }, { status: 400 });
    }

    // 1) Nearby orgs with distance
    const orgs = await getNearbyStores(lat, lng, 15);

    // 2) Collect tags and fetch a few products
    const merged = orgs.flatMap((p) => (Array.isArray(p.tags) ? p.tags : []));
    const uniqueTags = Array.from(new Set(merged));

    const orgIds = orgs.map((o) => o.id);

    const topProducts = await prisma.review.groupBy({
      by: ['product_id'],
      where: { product: { organization_id: { in: orgIds } } },
      _avg: { rating: true },
      _count: { rating: true },
      orderBy: [
        { _avg: { rating: 'desc' } },
        { _count: { rating: 'desc' } },
      ],
      take: 5,
    });
    
    // Then fetch product details
    let products = await prisma.product.findMany({
      where: { id: { in: topProducts.map((p) => p.product_id) }, active: true, display: true },
    });

    if(products.length < 5){
      const count = 5 - products.length; 
      const otherProducts = await prisma.product.findMany({
        where: { id: { notIn: topProducts.map((p) => p.product_id) }, organization_id: { in: orgIds}, active: true, display: true },
        take: count
      });
      products = [...products, ...otherProducts]
    }
    // 3) Ratings per org
    const orgRatings = await prisma.review.groupBy({
      by: ["organization_id"],
      where: { organization_id: { in: orgIds } },
      _avg: { rating: true },
      _count: { rating: true },
    });

    const ratingsMap = {};
    orgRatings.forEach((r) => {
      ratingsMap[r.organization_id] = {
        avg: r._avg.rating ?? 0,
        count: r._count.rating,
      };
    });

    // 3b) Ratings per product
    const productIds = products.map((p) => p.id);
    const productRatings = productIds.length
      ? await prisma.review.groupBy({
          by: ["product_id"],
          where: { product_id: { in: productIds } },
          _avg: { rating: true },
          _count: { rating: true },
        })
      : [];

    const productRatingsMap = {};
    productRatings.forEach((r) => {
      productRatingsMap[r.product_id] = {
        avg: r._avg.rating ?? 0,
        count: r._count.rating,
      };
    });

    // 4) Build org lookup: id -> { distance_km, baseFare, perKmRate, currency }
    const orgMetaMap = new Map();
    orgs.forEach((org) => {
      const distance_km = Number(org.distance_km);
      const ship = org.ship_org_info;
      const baseFare = Number(ship.baseFare);      // cents
      const perKmRate = Number(ship.perKmRate);    // cents/km
      const currency = org.currency || ship.currency || "CAD"; // include org currency
      orgMetaMap.set(org.id, { distance_km, baseFare, perKmRate, currency });
    });

    // 5) Merge ratings + compute delivery for orgs (include currency)
    const orgsWithRatings = orgs.map((org) => {
      const stats = ratingsMap[org.id];
      const meta = orgMetaMap.get(org.id);
      const estCents = Math.round(meta.baseFare + meta.perKmRate * meta.distance_km);
      return {
        ...org,
        delivery_fee: estCents, // cents
        currency: meta.currency,
        avgRating: stats ? Number((stats.avg ?? 0).toFixed(1)) : null,
        reviewCount: stats ? stats.count : 0,
      };
    });

    // 6) Attach delivery + product ratings + currency from product’s org
    const productsWithDelivery = products.map((p) => {
      const meta = orgMetaMap.get(p.organization_id);
      const estCents = meta
        ? Math.round(meta.baseFare + meta.perKmRate * meta.distance_km)
        : null;

      const pr = productRatingsMap[p.id];
      return {
        ...p,
        delivery_fee: estCents,
        currency: meta ? meta.currency : null,
        avgRating: pr ? Number((pr.avg ?? 0).toFixed(1)) : null,
        reviewCount: pr ? pr.count : 0,
      };
    });

    return NextResponse.json({
      success: true,
      orgs: orgsWithRatings,
      tags: ["All", ...uniqueTags],
      products: productsWithDelivery,
    });
  } catch (err) {
    console.error("GET EXPLORE ERROR:", err);
    return NextResponse.json({ error: "Failed to get explore " }, { status: 500 });
  }
}

const getNearbyStores = async (lat, lng, radiusKm = 5) => {
  const orgs = await prisma.$queryRaw`
    SELECT *,
      (
        6371 * acos(
          cos(radians(${lat}))
          * cos(radians(address_lat))
          * cos(radians(address_long) - radians(${lng}))
          + sin(radians(${lat}))
          * sin(radians(address_lat))
        )
      ) AS distance_km
    FROM organizations
    WHERE address_lat IS NOT NULL
      AND address_long IS NOT NULL
      AND type = 'Food'
    HAVING distance_km < ${radiusKm}
    ORDER BY distance_km ASC
    LIMIT 50;
  `;
  return orgs;
};