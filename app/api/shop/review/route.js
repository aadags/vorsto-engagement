import { NextResponse } from "next/server";
import prisma from "@/db/prisma";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const body = await req.json();

    if (!Array.isArray(body)) {
      return NextResponse.json({ error: "Invalid request format" }, { status: 400 });
    }

    const order = await prisma.order.update({
      where: { id: body[0].orderId },
      data: { reviewed: true },
    });

    for (const review of body) {
      const { orderId, productId, rating, message, contactId } = review;

      if (!orderId || !productId || !rating || !message) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
      }
1
      await prisma.review.upsert({
        where: {
          order_id_product_id: {
            order_id: orderId,
            product_id: productId,
          },
        },
        create: {
          order_id: orderId,
          product_id: productId,
          rating,
          message,
          contact_id: contactId || null,
          organization_id: order.organization_id || null,
        },
        update: {
          rating,
          message,
          updated_at: new Date(),
        },
      });
    }

    return NextResponse.json({ status: true });
  } catch (error) {
    console.error("Review submission error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
