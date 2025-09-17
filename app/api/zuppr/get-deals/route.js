"use server";

import { NextResponse } from "next/server";
import prisma from "@/db/prisma";

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
    const { lat, lng, radiusKm = 16 } = await req.json();
    if (lat == null || lng == null) {
      return NextResponse.json({ error: "Lat and Lng are required" }, { status: 400 });
    }

    // 1) Nearby orgs
    const orgs = await getNearbyStores(lat, lng, radiusKm);
    const orgIds = orgs.map((o) => o.id);
    if (orgIds.length === 0) {
      return NextResponse.json({ success: true, deals: [] });
    }

    // 2) Fetch deals for these orgs
    let deals = await prisma.deal.findMany({
      where: {
        organization_id: { in: orgIds },
        isActive: true,
      },
      include: {
        products: { include: { product: { select: { id: true, name: true, image: true } } } },
        inventories: { include: { inventory: { select: { id: true, name: true } } } },
        organization: { select: { id: true, name: true, promo_image: true, currency: true } },
      },
    });

    const now = new Date();

    // 3) Filter only expired ones OUT
    deals = deals.filter((d) => {
      if (!d.isActive) return false;

      if (d.type === "ONE_OFF") {
        // ✅ include future deals, exclude ended
        if (d.endDate && now > new Date(d.endDate)) return false;
        return true;
      }

      if (d.type === "RECURRING") {
        // ✅ always include recurring deals
        return true;
      }

      return false;
    });

    // 4) Format response
    const formatted = deals.map((d) => ({
      id: d.id,
      title: d.title,
      description: d.description,
      type: d.type,
      startDate: d.startDate,
      endDate: d.endDate,
      recurrence: d.recurrenceRule,
      discountType: d.discountType,
      discountValue: d.discountValue,
      imageUrl: d.imageUrl,
      isActive: d.isActive,
      store: d.organization,
      products: d.products.map((p) => ({
        id: p.product.id,
        name: p.product.name,
        image: p.product.image,
        customPrice: p.customPrice,
        discountType: p.discountType,
        discountValue: p.discountValue,
      })),
      inventories: d.inventories.map((inv) => ({
        id: inv.inventory.id,
        name: inv.inventory.name,
        customPrice: inv.customPrice,
        discountType: inv.discountType,
        discountValue: inv.discountValue,
      })),
    }));

    // 5) Sort → show current deals first, then upcoming
    const sorted = formatted.sort((a, b) => {
      const now = new Date();
      const aStart = a.startDate ? new Date(a.startDate) : null;
      const bStart = b.startDate ? new Date(b.startDate) : null;

      // active ones first
      const aActive = !aStart || aStart <= now;
      const bActive = !bStart || bStart <= now;
      if (aActive && !bActive) return -1;
      if (!aActive && bActive) return 1;

      // if both upcoming, sort by soonest start
      if (!aActive && !bActive && aStart && bStart) {
        return aStart.getTime() - bStart.getTime();
      }
      return 0;
    });

    return NextResponse.json({ success: true, deals: sorted });
  } catch (err) {
    console.error("GET DEALS ERROR:", err);
    return NextResponse.json({ error: "Failed to get deals" }, { status: 500 });
  }
}

const getNearbyStores = async (lat, lng, radiusKm) => {
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
      AND zuppr_active = true
    HAVING distance_km < ${radiusKm}
    ORDER BY distance_km ASC
    LIMIT 50;
  `;
  return orgs;
};