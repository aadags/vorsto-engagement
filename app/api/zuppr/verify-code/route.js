// app/api/verify-code/route.ts
"use server";

import { NextResponse } from "next/server";
import Redis from "ioredis";
import prisma from "@/db/prisma";

const redis = new Redis(process.env.REDIS);

export async function OPTIONS() {
  // Preflight handler
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
    const { phone, code } = await req.json();
    if (!phone || !code) {
      return NextResponse.json(
        { error: "Phone and code are required" },
        { status: 400 }
      );
    }

    const saved = await redis.get(`otp:${phone}`);
    if (saved !== code) {
      return NextResponse.json(
        { error: "Invalid or expired code" },
        { status: 401 }
      );
    }

    // delete so it can't be reused
    await redis.del(`otp:${phone}`);

    // TODO: look up or create your user in DB, issue a JWT/session cookie, etc.
    // e.g. const token = await createSessionFor(phone);

    const customer = await prisma.customer.upsert({
      where: { phone }, // if id is null or undefined, it won't match anything
      update: {
        phone
      },
      create: {
        phone,
      },
    });

    return NextResponse.json({
      success: true,
      customer,
    });
  } catch (err) {
    console.error("VERIFY-CODE ERROR:", err);
    return NextResponse.json(
      { error: "Failed to verify code" },
      { status: 500 }
    );
  }
}
