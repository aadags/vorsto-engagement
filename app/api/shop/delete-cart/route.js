import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";


export async function POST(req) {
  try {

    const body = await req.json();
    const { inventory_id, subdomain, uuid } = body;

    const org = await prisma.organization.findFirst({
      where: { subdomain },
    });
    
    let cart = await prisma.cart.findFirst({
      where: {
        uuid, organization_id: org.id
      }
    })

    await prisma.cartItem.delete({
      where: {
        inventory_id,
        cart_id: cart.id
      }
    });


    return NextResponse.json({ status: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete cart" },
      { status: 500 }
    );
  }
}
