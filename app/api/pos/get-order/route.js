// app/api/orders/route.ts
import { NextResponse } from "next/server";
import prisma from "@/db/prisma";

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      id,
      orderId
    } = body;

    const order = await prisma.order.findFirst({
      where: { id: orderId,
        organization_id: id 
      },
      include: {
        order_items: {
          include: {
            inventory: {
              include: {
                product: {
                  include:{
                    images: true
                  }
                }
              }
            }
          }
        },
        contact: true
      }
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error("Order fetch error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
