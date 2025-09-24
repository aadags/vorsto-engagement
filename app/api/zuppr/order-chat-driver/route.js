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
      orderId, message, senderType, chat_id
    } = await req.json();

    if (!orderId || !message || !senderType) {
      console.log({orderId, message, senderType})
      return cors(NextResponse.json({ error: "Invalid payload" }, { status: 400 }));
    }

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      console.log({order})
      return cors(NextResponse.json({ error: "Order not found" }, { status: 404 }));
    }

    const customer = await prisma.customer.findUnique({ where: { id: chat_id } });
    if (!customer) {
      console.log({customer})
      return cors(NextResponse.json({ error: "Customer not found" }, { status: 404 }));
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

    const body = {
      to: customer.device_token,
      title: `You have a new message!`,
      body: `You have a new message!`,
    };

    fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    .then(response => response.json())
    .then(result => {
      console.log({result})
    })
    .catch(error => {
      console.error('Error sending push notification:', error);
    });

    return cors(NextResponse.json({ success: true, chat_log: updated.chat_log }));
  } catch (err) {
    console.error("Chat API error:", err);
    return cors(NextResponse.json({ error: "Failed to save message" }, { status: 500 }));
  }
}
