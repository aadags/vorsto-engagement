import { NextResponse } from "next/server";
import prisma from "@/db/prisma";

export async function POST(req) {
  try {
    const body = await req.json();
    const { rating, comment, orderId } = body;

    if (!rating) {
      return NextResponse.json(
        { success: false, error: "Rating is required" },
        { status: 400 }
      );
    }

    const order = await prisma.order.findFirst({
        where: {
          id: orderId
        },
    });

    const review = await prisma.review.create({
      data: {
        order_id: order.id,
        contact_id: order.contact_id,
        organization_id: order.organization_id,
        rating,
        message: comment || "",
      },
    });

    return NextResponse.json({ success: true, review });
  } catch (err) {
    console.error("Order rating error", err);
    return NextResponse.json(
      { success: false, error: "Failed to submit order rating" },
      { status: 500 }
    );
  }
}