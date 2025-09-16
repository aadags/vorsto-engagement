// app/api/verify-code/route.ts
"use server";

import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import { signAccessToken, signRefreshToken } from "@/jwt/jwt";  

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
    let { email, googleId, name } = await req.json();

    console.log({ email, googleId, name })

    if (!googleId) {
      return NextResponse.json({ error: "Google user id is required" }, { status: 400 });
    }

    // Upsert using appleId as the stable identifier
    let existing = await prisma.customer.findFirst({
      where: {
        OR: [
          { google_id: googleId },
          { email: email ?? undefined },
        ],
      },
    });
    
    let customer;
    if (existing) {
      customer = await prisma.customer.update({
        where: { id: existing.id },
        data: {
          google_id: googleId,
        },
      });
    } else {
      customer = await prisma.customer.create({
        data: {
          google_id: googleId,
          email: email ?? null,
          name: name ?? null,
        },
      });
    }

    const accessToken = signAccessToken({ sub: customer.id });
    const refreshToken = signRefreshToken({ sub: customer.id });

    return NextResponse.json({
      success: true,
      accessToken,
      refreshToken,
      customer
    });
  } catch (err) {
    console.error("google auth error", err);
    return NextResponse.json(
      { error: "Failed to authorize" },
      { status: 500 }
    );
  }
}