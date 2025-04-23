import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";


export async function POST(req) {
  try {

    const body = await req.json();
    const { inventory_id, quantity, email, phone, subdomain, uuid } = body;

    const org = await prisma.organization.findFirst({
      where: { subdomain },
    });
    
    const whereClause = {
      organization_id: org.id,
    };
    
    if (email) {
      whereClause.email = email;
    }
    if (phone) {
      whereClause.phone = phone;
    }
    let contact = await prisma.contact.findFirst({
      where: whereClause,
    });

    if (!email && !phone) {
      contact = null;
    }

    let cart = await prisma.cart.findFirst({
      where: {
        uuid, organization_id: org.id
      }
    })

    if(!cart)
    {
      cart = await prisma.cart.create({
        data: {
          uuid,
          contact_id: contact?.id || null,
          organization_id: org.id,
        }
      });
    }

    await prisma.cartItem.create({
      data: {
        inventory_id,
        cart_id: cart.id,
        quantity
      }
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
