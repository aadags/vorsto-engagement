import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";


export async function POST(req) {
  try {

    const body = await req.json();
    const { uuid, org_id, cart } = body;

    const org = await prisma.organization.findFirstOrThrow({
      where: { id: org_id },
    });
    
    let existingCart = await prisma.cart.findFirst({
      where: {
        uuid, organization_id: org.id
      }
    })

    if(!existingCart)
    {
      existingCart = await prisma.cart.create({
        data: {
          uuid,
          organization_id: org.id,
        }
      });
    }

    await prisma.cartItem.deleteMany({
      where: {
        cart_id: existingCart.id
      }
    })

    await prisma.cartItem.createMany({
      data: cart.map(item => ({
        inventory_id: item.inventory_id,
        cart_id: existingCart.id,
        quantity: item.quantity,
      })),
    });
    


    return NextResponse.json({ status: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch org" },
      { status: 500 }
    );
  }
}
