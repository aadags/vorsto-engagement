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
    const { id, name, email, phone, pictureUrl } = await req.json();
    if (!id) {
      return NextResponse.json(
        { error: "id is required" },
        { status: 400 }
      );
    }

    const customer = await prisma.customer.update({
      where: { id },
      data: {
        name,
        email,
        phone,
        image: pictureUrl || null
      }
    });

    return NextResponse.json({
      success: true,
      customer,
    });
  } catch (err) {
    console.error("UPDATE USER ERROR:", err);
    return NextResponse.json(
      { error: "Failed to verify code" },
      { status: 500 }
    );
  }
}
