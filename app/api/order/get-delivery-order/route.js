import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";


export async function GET(req) {
  try {

    const id = req.nextUrl.searchParams.get("id");

    const order = await prisma.order.findFirst({
      where: { shipping_id: id 
      },
      include: {
        order_items: {
          include: {
            inventory: {
              include: {
                product: true
              }
            }
          }
        },
        contact: {
          include: {
            customer: true
          }
        }
      }
    });

    return NextResponse.json({ ...order });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}
