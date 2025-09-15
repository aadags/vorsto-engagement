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

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const customerId = searchParams.get("customerId");
  const status = searchParams.get("status");

  try {
    let contactIds = [];

    if (customerId) {
      const customer = await prisma.customer.findUnique({
        where: { id: customerId },
        include: { contacts: true },
      });

      if (!customer) {
        return cors(NextResponse.json({ error: "Customer not found" }, { status: 404 }));
      }

      contactIds = customer.contacts.map((c) => c.id);
    }

    // Step 1: Fetch orders with a broader filter
    const orders = await prisma.order.findMany({
      where: {
        ...{ contact_id: { in: contactIds } },
        ...(status === "Delivered" ? { status: "Delivered" } : {}),
        ...(status === "Cancelled" ? { status: "Cancelled" } : {}),
        // ⚠️ if status = "Pending", don’t filter here (we'll normalize later)
      },
      include: {
        organization: { select: { id: true, name: true, logo: true, currency: true } },
        promo_usages: true,
        order_items: {
          include: {
            inventory: { include: { product: { select: { name: true } } } },
          },
        },
      },
      orderBy: { created_at: "desc" },
    });

    // Step 2: Normalize statuses
    const allowedStatuses = ["Pending", "Delivered", "Cancelled"];
    let normalizedOrders = orders.map((o) => {
      const normalizedStatus = allowedStatuses.includes(o.status)
        ? o.status
        : "Pending"; // everything else → Pending
      return { ...o, status: normalizedStatus };
    });

    // Step 3: Apply filter again if user asked for Pending
    if (status === "Pending") {
      normalizedOrders = normalizedOrders.filter((o) => o.status === "Pending");
    }

    return cors(NextResponse.json(normalizedOrders));
  } catch (error) {
    console.error("Error fetching orders:", error);
    return cors(NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 }));
  }
}
