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
    const {
      orderId, message, senderType
    } = await req.json();

    if (!orderId || !message || !senderType) {
      return cors(NextResponse.json({ error: "Invalid payload" }, { status: 400 }));
    }

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      return cors(NextResponse.json({ error: "Order not found" }, { status: 404 }));
    }

    // append to existing chat log
    const prevLog = (order.chat_log) || [];
    const newMessage = {
      senderType,
      message,
      timestamp: new Date().toISOString(),
    };

    const updated = await prisma.order.update({
      where: { id: orderId },
      data: { chat_log: [...prevLog, newMessage] },
    });

    const response = await fetch(`${process.env.SHIPPING_API}/api/new-chat-notification`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shippingId: order.shipping_id }),
    });

    await response.json();

    return cors(NextResponse.json({ success: true, chat_log: updated.chat_log }));
  } catch (err) {
    console.error("Chat API error:", err);
    return cors(NextResponse.json({ error: "Failed to save message" }, { status: 500 }));
  }
}
