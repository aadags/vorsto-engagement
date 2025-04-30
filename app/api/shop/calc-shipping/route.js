import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";


export async function POST(req) {
  try {

    const body = await req.json();
    const { customer, cartId } = body;

    const cart = await prisma.cart.findFirst({
      where: {
        uuid: cartId
      }
    })

    const org = await prisma.organization.findFirst({
      where: {
        id: cart.organization_id
      }
    })

    console.log({
      org
    })
    

    const response = await fetch(`${process.env.SHIPPING_API}/api/get-shipping-rate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ companyId: org.ship_org_id, pickupUid: cartId,  customer }),
    });
    const data = await response.json();
    
    if(data && data.id){
      await prisma.cart.update({
        where: {
          uuid: cartId
        }, 
        data: {
          shipping_info: JSON.stringify(data)
        }
      })


      return NextResponse.json(data);
    } else {
      return NextResponse.json(
        { error: "Failed to fetch shipping" },
        { status: 422 }
      );
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch shipping" },
      { status: 500 }
    );
  }
}
