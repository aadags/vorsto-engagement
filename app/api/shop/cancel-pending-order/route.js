import { NextResponse } from "next/server";
import prisma from "@/db/prisma";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const { id } = await req.json();

    const order = await prisma.order.findFirst({
      where: { id },
      include: { order_items: true },
    });

    await prisma.order.update({
      where: { id },
      data: { status: "Cancelled" },
    });

    for (const item of order.order_items) {
      await prisma.orderItem.update({
        where: { id: item.id },
        data: { status: "Cancelled" },
      });

      await prisma.inventory.update({
        where: { id: item.inventory_id },
        data: { quantity: { increment: item.quantity } },
      });
    }

    if(order.shipping_id){
      const response = await fetch(`${process.env.SHIPPING_API}/api/delivery-cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deliveryId: order.shipping_id }),
      });
      const data = await response.json();
    }

    return NextResponse.json({ status: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to process refund" }, { status: 500 });
  }
}
