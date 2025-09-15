// app/api/promo/check/route.js
import { NextResponse } from "next/server";
import prisma from "@/db/prisma";

function cors(res) {
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return res;
}

export async function POST(req) {
  try {
    const { customerId, orgId, subtotalCents, deliveryCents } = await req.json();

    // Find active promos
    const promos = await prisma.promo.findMany({
      where: {
        active: true,
        OR: [
          { starts_at: null, ends_at: null },
          { starts_at: { lte: new Date() }, ends_at: { gte: new Date() } }
        ]
      }
    });

    for (const promo of promos) {
      // --- check org eligibility ---
      if (promo.orgs_json) {
        const orgs = JSON.parse(promo.orgs_json);
        if (Array.isArray(orgs) && orgs.length > 0 && !orgs.includes(orgId)) {
          continue;
        }
      }

      // --- check min order amount ---
      if (promo.min_order_cents && subtotalCents < promo.min_order_cents) {
        continue;
      }

      // --- check per-user usage ---
      if (promo.max_uses_per_user) {
        const usageCount = await prisma.promoUsage.count({
          where: { promo_id: promo.id, customer_id: customerId }
        });
        if (usageCount >= promo.max_uses_per_user) {
          continue;
        }
      }

      // --- calculate discount ---
      let discount = 0;
      let deliveryDiscount = 0;

      if (promo.type === "percent") {
        discount = Math.round((subtotalCents * promo.value) / 100);
      } else if (promo.type === "flat") {
        discount = promo.value;
      } else if (promo.type === "free_delivery") {
        deliveryDiscount = deliveryCents;
      }

      return cors(NextResponse.json({
        success: true,
        promo: {
          id: promo.id,
          code: promo.code,
          description: promo.description,
          discount,
          deliveryDiscount
        }
      }));
    }

    return cors(NextResponse.json({ success: false, promo: null }));
  } catch (err) {
    console.error("Promo check failed:", err);
    return cors(NextResponse.json({ success: false, error: "Promo check failed" }, { status: 500 }));
  }
}
