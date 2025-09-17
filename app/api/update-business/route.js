"use server";
import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import localeCurrency from 'locale-currency';

export async function POST(req) {
  try {
    const organizationId = Number(
      req.cookies.get("organizationId")?.value ?? 0
    );

    const org = await prisma.organization.findFirstOrThrow({
      where: { id: organizationId },
    });

    const body = await req.json();

    console.log({ body })
    
    const { name,
      dba,
      number,
      type,
      address,
      lat,
      lng,
      country,
      tagline,
      phone,
      commission,
      subdomain,
      tags,
      init = false,
      email } = body;

    const currency = localeCurrency.getCurrency(country.toUpperCase()) || 'USD';

    if(init){

      await prisma.organization.update({
        where:{
          id: org.id
        }, 
        data: {
          name,
          number,
          type,
          address,
          address_lat: `${lat}`,
          address_long: `${lng}`, 
          dba,
          tagline,
          contact_number: phone,
          contact_email: email,
          country,
          currency,
          tags,
          onboarding: true,
          subdomain: `${subdomain}.vorsto.shop`
        }
      })

      const response = await fetch(`${process.env.SHIPPING_API}/api/create-company`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: org.ship_org_id || "new", name, address, lat, lng, commission: Number(commission), currency }),
      });
      const data = await response.json();
      
      await prisma.organization.update({
        where:{
          id: org.id
        }, 
        data: {
          ship_org_id: data.company.id,
          ship_org_info: data.company,
          min_order: type==="Food"? 15 : 0
        }
      })

    } else {
      await prisma.organization.update({
        where:{
          id: org.id
        }, 
        data: {
          name,
          tagline,
          contact_number: phone,
          contact_email: email
        }
      })
    }
    
    return NextResponse.json({
      status: true
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to save business" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}

export async function PUT() {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}
