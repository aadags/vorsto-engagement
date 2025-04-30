import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";


export async function POST(req) {
  try {

    const body = await req.json();
    const { tip, cartId } = body;

    const cart = await prisma.cart.findFirst({
      where: {
        uuid: cartId
      }
    })

    const si = JSON.parse(cart.shipping_info);

    const response = await fetch(`${process.env.SHIPPING_API}/api/update-tip`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ companyId: "ywy3HAHDHW32", deliveryId: si.id, tip }),
    });
    const data = await response.json();

    await prisma.cart.update({
      where: {
        id: cart.id
      }, 
      data: {
        shipping_info: JSON.stringify({ ...si, tip: tip })
      }
    })

    return NextResponse.json({ status: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch org" },
      { status: 500 }
    );
  }
}
