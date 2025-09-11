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

    if (!user) {
      return NextResponse.json({ error: "Apple user id is required" }, { status: 400 });
    }

    // // Check if relay email → set to null
    // if (isAppleRelayEmail(email)) {
    //   email = null;
    // }

    // If email exists → keep a safekeep in AppleLog
    if (email) {
      await prisma.appleLog.upsert({
        where: { apple_id: user },
        update: {
          email,
          name: (name?.givenName && name?.familyName)
            ? `${name.givenName} ${name.familyName}`
            : undefined,
        },
        create: {
          apple_id: user,
          email,
          name: (name?.givenName && name?.familyName)
            ? `${name.givenName} ${name.familyName}`
            : null,
        },
      });
    }

    // If no email, try to pull from AppleLog
    if (!email) {
      const savedLog = await prisma.appleLog.findUnique({
        where: { apple_id: user },
      });
      if (savedLog?.email) {
        email = savedLog.email;
      }
    }



    // Check customer by apple_id OR email
    let existing = await prisma.customer.findFirst({
      where: {
        OR: [
          { apple_id: user },
          email ? { email } : undefined,
        ].filter(Boolean),
      },
    });

    let customer;
    if (existing) {
      customer = await prisma.customer.update({
        where: { id: existing.id },
        data: {
          apple_id: user,
          email: email ?? existing.email, // keep existing if still null
          name: existing.name ?? (name?.givenName && name?.familyName
            ? `${name.givenName} ${name.familyName}`
            : null),
        },
      });
    } else {
      customer = await prisma.customer.create({
        data: {
          apple_id: user,
          email: email ?? null,
          name: (name?.givenName && name?.familyName)
            ? `${name.givenName} ${name.familyName}`
            : null,
        },
      });
    }

    return NextResponse.json({ success: true, customer });
  } catch (err) {
    console.error("Apple auth error", err);
    return NextResponse.json({ error: "Failed to authorize" }, { status: 500 });
  }
}


function isAppleRelayEmail(email) {
  return email?.toLowerCase().endsWith("@privaterelay.appleid.com");
}
