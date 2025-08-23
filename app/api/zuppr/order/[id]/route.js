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
    const orderId = params.id; // org ids are numeric (Review.organization_id Int?)
    if (!orderId) {
      return cors(NextResponse.json({ error: "Invalid id" }, { status: 400 }));
    }

    // 1) Store + active/display products
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        order_items: {
          include: {
            inventory: true
          }
        },
        organization: true
      },
    });

    const response = await fetch(`${process.env.SHIPPING_API}/api/get-delivery?id=${order.shipping_id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const { delivery } = await response.json(); 
    console.log({ delivery })
    return cors(NextResponse.json({ success: true, order, delivery }));
  } catch (err) {
    console.error("GET STORE ERROR:", err);
    return cors(
      NextResponse.json({ error: "Failed to fetch store" }, { status: 500 })
    );
  }
}
