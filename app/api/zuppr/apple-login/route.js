// app/api/verify-code/route.ts
"use server";

import { NextResponse } from "next/server";
import prisma from "@/db/prisma";

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

export async function POST(req) {
  try {
    let { email, user, name } = await req.json();

    console.log({ email, user, name })

    if (!user) {
      return NextResponse.json({ error: "Apple user id is required" }, { status: 400 });
    }

    // Check if relay email
    if(isAppleRelayEmail(email)){
      email = null;
    }

    let existing = await prisma.customer.findFirst({
      where: {
        OR: [
          { apple_id: user },
          { email: email ?? undefined },
        ]
      }
    });
    
    let customer;
    if (existing) {
      customer = await prisma.customer.update({
        where: { id: existing.id },
        data: {
          apple_id: user
        },
      });
    } else {
      customer = await prisma.customer.create({
        data: {
          apple_id: user,
          email: email ?? null,
          name: (name.givenName && name.familyName) 
            ? `${name.givenName} ${name.familyName}` 
            : null,
        },
      });
    }


    return NextResponse.json({
      success: true,
      customer
    });
  } catch (err) {
    console.error("Apple auth error", err);
    return NextResponse.json(
      { error: "Failed to authorize" },
      { status: 500 }
    );
  }
}

function isAppleRelayEmail(email) {
  return email?.toLowerCase().endsWith("@privaterelay.appleid.com");
}
