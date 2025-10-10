import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import { formatInTimeZone } from "date-fns-tz";
import formatCurrency from "@/utils/formatCurrency";

export const dynamic = "force-dynamic";

// ---------------- Helpers ---------------- //

function isDealActive(deal, now, timezone = "America/Vancouver") {
  if (!deal.isActive) return false;

  const dayName = formatInTimeZone(now, timezone, "EEE");
  const timeNow = formatInTimeZone(now, timezone, "HH:mm");

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
    if (todayRule.timeStart && todayRule.timeEnd)
      return timeNow >= todayRule.timeStart && timeNow <= todayRule.timeEnd;
    return true;
  }

  return false;
}

function toCents(value) {
  if (value == null) return null;
  return Math.round(value * 100);
}

function applyDiscounts(basePriceCents, deals, currency, override = null) {
  if (!deals || deals.length === 0)
    return {
      basePrice: basePriceCents,
      finalPrice: basePriceCents,
      appliedDeal: null,
      appliedOverride: null,
    };

  let bestPrice = basePriceCents;
  let bestDeal = null;
  let bestOverride = null;

  deals.forEach((d) => {
    const overrideData = override || {};
    const effCustomPrice =
      overrideData.customPrice != null ? toCents(overrideData.customPrice) : null;
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

  return {
    basePrice: basePriceCents,
    finalPrice: bestPrice,
    appliedDeal: bestDeal,
    appliedOverride: bestOverride,
  };
}

function getDealTag(deal, currency, override = null) {
  if (!deal) return null;

  const effType = override?.discountType ?? deal.discountType;
  const effValue = override?.discountValue ?? deal.discountValue;
  const effCustomPrice = override?.customPrice ?? null;

  if (effCustomPrice != null)
    return `Now ${(toCents(effCustomPrice) / 100).toFixed(2)} ${currency}`;
  if (effType === "PERCENTAGE") return `${effValue}% Off`;
  if (effType === "FIXED")
    return `Save ${formatCurrency(toCents(effValue), currency)}`;
  if (effType === "FLAT_PRICE")
    return `Now ${formatCurrency(toCents(effValue), currency)}`;
  return deal.title;
}

function getMinPriceFromInventories(inventories) {
  if (!inventories || inventories.length === 0) return null;
  const prices = inventories.map((inv) => inv.finalPrice ?? inv.price ?? Infinity);
  return Math.min(...prices);
}

// ---------------- Main Handler ---------------- //

export async function GET(req) {
  try {
    const hostname = req.nextUrl.searchParams.get("hostname");
    const limitParam = req.nextUrl.searchParams.get("limit");
    const categoryId = req.nextUrl.searchParams.get("categoryId");
    const getAll = req.nextUrl.searchParams.get("all") === "true";

    const org = await prisma.organization.findFirst({
      where: { subdomain: hostname },
    });

    if (!org) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    }

    const where = {
      active: true,
      display: true,
      organization_id: org.id,
      ...(categoryId && { category_id: categoryId }),
    };

    const products = await prisma.product.findMany({
      where,
      include: {
        inventories: {
          where: { active: true },
          include: {
            ingredientUsages: {
              include: { ingredient: true },
            },
          },
        },
        category: true,
        images: true,
      },
      ...(getAll ? {} : { take: Number(limitParam) || 10 }),
    });

    // ✅ For FOOD organizations, skip quantity limits (keep open)
    if (org.type !== "Food") {
      for (const product of products) {
        for (const inv of product.inventories) {
          const possibleCounts = inv.ingredientUsages.map((usage) => {
            const { ingredient } = usage;
            const unitType = ingredient.unit_type;

            if (unitType === "unit" || unitType === "ml") {
              const qtyPerPlate = usage.usage_quantity ?? 0;
              return qtyPerPlate > 0
                ? Math.floor(ingredient.quantity / qtyPerPlate)
                : Infinity;
            }

            const weightPerPlate = usage.usage_weight ?? 0;
            return weightPerPlate > 0
              ? Math.floor(ingredient.weight_available / weightPerPlate)
              : Infinity;
          });

          inv.quantity = possibleCounts.length ? Math.min(...possibleCounts) : 0;
        }
      }
    }

    // ---------------- Deals Integration ---------------- //

    const allDeals = await prisma.deal.findMany({
      where: { organization_id: org.id, isActive: true },
      include: { products: true, inventories: true },
    });

    const now = new Date();
    const timezone = org.timezone || "America/Vancouver";
    const validDeals = allDeals.filter((d) => isDealActive(d, now, timezone));

    // Map final deals and pricing
    const enrichedProducts = products.map((p) => {
      const prodDeals = validDeals.filter((d) =>
        d.products.some((dp) => dp.productId === p.id)
      );

      const inventories = p.inventories.map((inv) => {
        const invDeals = validDeals.filter((d) =>
          d.inventories.some((di) => di.inventoryId === inv.id)
        );
        const invOverride = invDeals
          .map((d) => d.inventories.find((di) => di.inventoryId === inv.id))
          .find(Boolean);

        const { basePrice, finalPrice, appliedDeal, appliedOverride } =
          applyDiscounts(inv.price ?? 0, invDeals, org.currency, invOverride);

        return {
          ...inv,
          basePrice,
          finalPrice,
          appliedDeal,
          dealTag: appliedDeal
            ? getDealTag(appliedDeal, org.currency, appliedOverride)
            : null,
        };
      });

      let basePrice = null;
      let displayPrice = null;
      let appliedDeal = null;
      let dealTag = null;

      if (prodDeals.length > 0) {
        basePrice = p.price ?? getMinPriceFromInventories(inventories);
        const prodOverride = prodDeals
          .map((d) => d.products.find((dp) => dp.productId === p.id))
          .find(Boolean);
        const { finalPrice, appliedDeal: pd, appliedOverride: po } =
          applyDiscounts(basePrice, prodDeals, org.currency, prodOverride);
        displayPrice = finalPrice;
        appliedDeal = pd;
        dealTag = pd ? getDealTag(pd, org.currency, po) : null;
      } else {
        basePrice = getMinPriceFromInventories(inventories);
        displayPrice = basePrice;
      }

      return {
        ...p,
        inventories,
        deals: prodDeals,
        basePrice,
        displayPrice,
        appliedDeal,
        dealTag,
      };
    });

    return NextResponse.json({ success: true, products: enrichedProducts });
  } catch (error) {
    console.error("GET PRODUCTS ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
