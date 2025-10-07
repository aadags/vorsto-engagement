"use server";

import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import formatCurrency from "@/utils/formatCurrency";
import { formatInTimeZone } from "date-fns-tz";


function cors(res) {
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return res;
}

// ---------------- Helpers ---------------- //

function isDealActive(deal, now, timezone = "America/Vancouver") {
  if (!deal.isActive) return false;

  // Get current day and time in merchant's timezone
  const dayName = formatInTimeZone(now, timezone, "EEE"); // e.g. Mon, Tue, Wed
  const timeNow = formatInTimeZone(now, timezone, "HH:mm"); // e.g. 14:35

  if (deal.type === "ONE_OFF") {
    const start = deal.startDate ? new Date(deal.startDate) : null;
    const end = deal.endDate ? new Date(deal.endDate) : null;
    if (start && now < start) return false;
    if (end && now > end) return false;
    return true;
  }

  if (deal.type === "RECURRING" && Array.isArray(deal.recurrenceRule)) {
    const todayRule = deal.recurrenceRule.find(
      (r) => r.day.startsWith(dayName) && r.enabled
    );
    if (!todayRule) return false;

    if (todayRule.timeStart && todayRule.timeEnd) {
      return timeNow >= todayRule.timeStart && timeNow <= todayRule.timeEnd;
    }
    return true;
  }

  return false;
}

function toCents(value) {
  if (value == null) return null;
  return Math.round(value * 100);
}

function applyDiscounts(basePriceCents, deals, currency, override = null) {
  if (!deals || deals.length === 0) {
    return { basePrice: basePriceCents, finalPrice: basePriceCents, appliedDeal: null, appliedOverride: null };
  }

  let bestPrice = basePriceCents;
  let bestDeal = null;
  let bestOverride = null;

  deals.forEach((d) => {
    const overrideData = override || {};
    const effCustomPrice = overrideData.customPrice != null ? toCents(overrideData.customPrice) : null;
    const effType = overrideData.discountType ?? d.discountType;
    const effValue = overrideData.discountValue ?? d.discountValue;

    let newPrice = basePriceCents;

    if (effCustomPrice != null) {
      newPrice = effCustomPrice;
    } else if (effType === "PERCENTAGE") {
      newPrice = basePriceCents - Math.round((basePriceCents * effValue) / 100);
    } else if (effType === "FIXED") {
      newPrice = basePriceCents - toCents(effValue);
    } else if (effType === "FLAT_PRICE") {
      newPrice = toCents(effValue);
    }

    if (newPrice < bestPrice) {
      bestPrice = newPrice;
      bestDeal = d;
      bestOverride = overrideData;
    }
  });

  if (bestPrice < 0) bestPrice = 0;

  return { basePrice: basePriceCents, finalPrice: bestPrice, appliedDeal: bestDeal, appliedOverride: bestOverride };
}

function getMinPriceFromInventories(inventories) {
  if (!inventories || inventories.length === 0) return null;
  const prices = inventories.map((inv) => inv.finalPrice ?? inv.price ?? Infinity);
  return Math.min(...prices);
}

function getDealFromInventories(inventories) {
  if (!inventories || inventories.length === 0) return null;

  let sdealTag = null;
  let minInv = null;
  let minPrice = Infinity;

  for (const inv of inventories) {
    const price = inv.finalPrice ?? inv.price ?? Infinity;
    sdealTag = inv.dealTag? inv.dealTag+" on selected options" : sdealTag;
    if (price < minPrice) {
      minPrice = price;
      minInv = inv;
    }
  }

  const inInv = minInv ? { ...minInv, sdealTag } : null

  return inInv;
}

function getDealTag(deal, currency, override = null) {
  if (!deal) return null;

  const effType = override?.discountType ?? deal.discountType;
  const effValue = override?.discountValue ?? deal.discountValue;
  const effCustomPrice = override?.customPrice ?? null;

  if (effCustomPrice != null) {
    return `Now ${(toCents(effCustomPrice) / 100).toFixed(2)} ${currency}`;
  }
  if (effType === "PERCENTAGE") return `${effValue}% Off`;
  if (effType === "FIXED") return `Save ${formatCurrency(toCents(effValue), currency)}`;
  if (effType === "FLAT_PRICE") return `Now ${formatCurrency(toCents(effValue), currency)}`;
  return deal.title;
}

// ---------------- Handlers ---------------- //

export async function OPTIONS() {
  return cors(new NextResponse(null, { status: 204 }));
}

export async function GET(req, { params }) {
  try {
    const orgId = Number(params.id);
    if (!Number.isFinite(orgId)) {
      return cors(NextResponse.json({ error: "Invalid id" }, { status: 400 }));
    }

    // 1) Org + products/inventories
    const org = await prisma.organization.findUnique({
      where: { id: orgId },
      include: {
        products: {
          where: { active: true, display: true },
          include: {
            category: true,
            comboRules: true,
            comboItems: { include: { inventory: true } },
            inventories: { where: { active: true } },
          },
        },
      },
    });
    if (!org) {
      return cors(NextResponse.json({ error: "Store not found" }, { status: 404 }));
    }

    // 2) Org-level ratings
    const orgAgg = await prisma.review.aggregate({
      where: { organization_id: orgId },
      _avg: { rating: true },
      _count: { _all: true },
    });
    const orgAverageRating =
      orgAgg._avg.rating != null ? Number(orgAgg._avg.rating.toFixed(2)) : null;
    const orgReviewCount = orgAgg._count._all || 0;

    // 3) Product ratings
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
          avgRating: g._avg.rating != null ? Number(g._avg.rating.toFixed(2)) : null,
          reviewCount: g._count._all || 0,
        };
        return acc;
      }, {});
    }

    // 4) Deals
    const allDeals = await prisma.deal.findMany({
      where: { organization_id: orgId, isActive: true },
      include: { products: true, inventories: true },
    });

    const now = new Date();
    const validDeals = allDeals.filter((d) => isDealActive(d, now, org.timezone || "America/Vancouver"));

    // 5) Map products
    const products = org.products.map((p) => {
      const prodDeals = validDeals.filter((d) =>
        d.products.some((dp) => dp.productId === p.id)
      );

      // Inventories
      const inventories = p.inventories.map((inv) => {
        const invDeals = validDeals.filter((d) =>
          d.inventories.some((di) => di.inventoryId === inv.id)
        );

        const invOverride = invDeals
          .map((d) => d.inventories.find((di) => di.inventoryId === inv.id))
          .find((o) => o);

        const { basePrice, finalPrice, appliedDeal, appliedOverride } = applyDiscounts(
          inv.price ?? 0,
          invDeals,
          org.currency,
          invOverride
        );

        return {
          ...inv,
          basePrice,
          finalPrice,
          appliedDeal,
          dealTag: appliedDeal ? getDealTag(appliedDeal, org.currency, appliedOverride) : null,
          dealTags: invDeals
            .map((d) => {
              const override = d.inventories.find((di) => di.inventoryId === inv.id);
              return getDealTag(d, org.currency, override);
            })
            .filter(Boolean),
        };
      });

      // Product-level price
      let basePrice = null;
      let displayPrice = null;
      let appliedDeal = null;
      let appliedOverride = null;
      let dealTag = null;

      if (p.type === "combo" && p.combo_price) {
        basePrice = p.combo_price;

        const prodOverride = prodDeals
          .map((d) => d.products.find((dp) => dp.productId === p.id))
          .find((o) => o);

        const { finalPrice, appliedDeal: comboDeal, appliedOverride: comboOverride } =
          applyDiscounts(p.combo_price, prodDeals, org.currency, prodOverride);

        displayPrice = finalPrice;
        appliedDeal = comboDeal;
        appliedOverride = comboOverride;
        dealTag = comboDeal ? getDealTag(comboDeal, org.currency, comboOverride) : null;
      } else {
        if (prodDeals.length > 0) {
          basePrice = p.price ?? getMinPriceFromInventories(inventories);

          const prodOverride = prodDeals
            .map((d) => d.products.find((dp) => dp.productId === p.id))
            .find((o) => o);

          const { finalPrice, appliedDeal: prodDeal, appliedOverride: prodOverrideUsed } =
            applyDiscounts(basePrice, prodDeals, org.currency, prodOverride);

          displayPrice = finalPrice;
          appliedDeal = prodDeal;
          appliedOverride = prodOverrideUsed;
          dealTag = prodDeal ? getDealTag(prodDeal, org.currency, prodOverrideUsed) : null;
        } else {
          const deal = getDealFromInventories(inventories);
          basePrice = deal.price;
          displayPrice = deal.finalPrice;
          dealTag = deal.dealTag || deal.sdealTag;
          appliedDeal = deal.appliedDeal;
          
        }
      }

      return {
        ...p,
        avgRating: perProduct[p.id]?.avgRating ?? null,
        reviewCount: perProduct[p.id]?.reviewCount ?? 0,
        deals: prodDeals,
        inventories,
        basePrice,
        displayPrice,
        appliedDeal,
        dealTag,
        dealTags: prodDeals
          .map((d) => {
            const override = d.products.find((dp) => dp.productId === p.id);
            return getDealTag(d, org.currency, override);
          })
          .filter(Boolean),
      };
    });

    // 6) Final payload
    const payload = {
      ...org,
      products,
      avgRating: orgAverageRating,
      reviewCount: orgReviewCount,
    };

    return cors(NextResponse.json({ success: true, data: payload }));
  } catch (err) {
    console.error("GET STORE ERROR:", err);
    return cors(NextResponse.json({ error: "Failed to fetch store" }, { status: 500 }));
  }
}