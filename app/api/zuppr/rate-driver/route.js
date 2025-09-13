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

    const response = await fetch(`${process.env.SHIPPING_API}/api/rate-driver`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating, comment, orderId }),
    });

    await response.json();
  

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Order rating error", err);
    return NextResponse.json(
      { success: false, error: "Failed to submit order rating" },
      { status: 500 }
    );
  }
}