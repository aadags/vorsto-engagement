// app/api/product/route.js  (or wherever your GET is)
import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

function getOrgIdFromCookie() {
  const c = cookies().get("organizationId");
  if (!c?.value) return null;
  const n = Number(c.value);
  return Number.isFinite(n) ? n : null;
}

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const organizationId = getOrgIdFromCookie();
    if (!organizationId) {
      return NextResponse.json({ error: "Missing organizationId cookie" }, { status: 400 });
    }

    const product = await prisma.product.findFirst({
      where: { id, organization_id: organizationId },
      include: {
        inventories: { where: { active: true } },
        comboItems: {
          include: { inventory: true },
          orderBy: { option_index: "asc" },
        },
        comboRules: {
          orderBy: { option_index: "asc" },
        },
        images: true,
        category: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // ---- Convert inventories (cents -> dollars)
    const inventories = (product.inventories || []).map((inv) => ({
      ...inv,
      price: (inv.price ?? 0) / 100,
    }));

    // ---- Build comboOptions by merging rules + items (grouped by option_index)
    // rulesMap: option_index -> { required, min, max, label }
    const rulesMap = {};
    (product.comboRules || []).forEach((r) => {
      rulesMap[r.option_index] = {
        required: !!r.required,
        min: r.min == null ? null : Number(r.min),
        max: r.max == null ? null : Number(r.max),
        label: r.label || null,
      };
    });

    // Group items by option_index
    const grouped = new Map();
    (product.comboItems || []).forEach((ci) => {
      const arr = grouped.get(ci.option_index) || [];
      arr.push(ci);
      grouped.set(ci.option_index, arr);
    });

    // Create an ordered array [0..N] of comboOptions
    const optionIndexes = Array.from(grouped.keys()).sort((a, b) => a - b);
    const comboOptions = optionIndexes.map((idx) => {
      const items = grouped.get(idx) || [];
      const rule = rulesMap[idx] || { required: false, min: null, max: null, label: null };

      return {
        option_index: idx,
        required: !!rule.required,
        min: rule.min,
        max: rule.max,
        label: rule.label,
        items: items.map((ci) => ({
          id: ci.id,
          inventory_id: ci.inventory_id,
          // expose name for admin/UI convenience
          inventory_name: ci.inventory?.name || null,
          // dollars for UI
          extra_price: (ci.extra_price ?? 0) / 100,
        })),
      };
    });

    // If there are rules for groups that currently have no items yet, include empty groups too
    Object.keys(rulesMap).forEach((k) => {
      const idx = Number(k);
      if (!grouped.has(idx)) {
        comboOptions.push({
          option_index: idx,
          required: !!rulesMap[idx].required,
          min: rulesMap[idx].min,
          max: rulesMap[idx].max,
          label: rulesMap[idx].label,
          items: [],
        });
      }
    });
    comboOptions.sort((a, b) => a.option_index - b.option_index);

    // Build response (don’t mutate prisma object)
    const payload = {
      ...product,
      inventories,
      comboOptions,           // merged, UI-ready
    };

    return NextResponse.json(payload);
  } catch (error) {
    console.error("GET PRODUCT ERROR:", error);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}
