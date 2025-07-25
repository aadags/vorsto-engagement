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
      init = false,
      email } = body;

    const currency = localeCurrency.getCurrency(country.toUpperCase()) || 'USD';

    await prisma.organization.update({
      where:{
        id: org.id
      }, 
      data: {
        name,
        number,
        type,
        address,
        address_lat: String(lat),
        address_long: String(lng), 
        dba,
        tagline,
        contact_number: phone,
        contact_email: email,
        country,
        currency,
        onboarding: true,
      }
    })

    if(init){

      const response = await fetch(`${process.env.SHIPPING_API}/api/create-company`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, address, lat, lng, commission: type==="Food"? 20 : 0, currency }),
      });
      const data = await response.json();
      
      await prisma.organization.update({
        where:{
          id: org.id
        }, 
        data: {
          ship_org_id: data.company.id,

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
