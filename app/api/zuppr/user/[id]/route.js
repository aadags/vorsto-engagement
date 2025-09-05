"use server";

import { NextResponse } from "next/server";
import prisma from "@/db/prisma";

function cors(res) {
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return res;
}

// ---------------- Handlers ---------------- //

export async function OPTIONS() {
  return cors(new NextResponse(null, { status: 204 }));
}

export async function GET(req, { params }) {
  try {
    const customerId = params.id;
    if (!customerId) {
      return cors(NextResponse.json({ error: "Invalid id" }, { status: 400 }));
    }

    // 1) Org + products/inventories
    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
    });
    if (!customer) {
      return cors(NextResponse.json({ error: "Customer not found" }, { status: 404 }));
    }

    return cors(NextResponse.json({ success: true, customer }));
  } catch (err) {
    console.error("GET STORE ERROR:", err);
    return cors(NextResponse.json({ error: "Failed to fetch store" }, { status: 500 }));
  }
}