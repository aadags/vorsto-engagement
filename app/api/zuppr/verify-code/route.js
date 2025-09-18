// app/api/verify-code/route.ts
"use server";

import { NextResponse } from "next/server";
import Redis from "ioredis";
import prisma from "@/db/prisma";
import { signAccessToken, signRefreshToken } from "@/jwt/jwt"; 

const redis = new Redis(process.env.REDIS);

// optional: keep the master code in env for security
const MASTER_CODE = process.env.MASTER_CODE || "627837";

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
    const { phone, code } = await req.json();
    if (!phone || !code) {
      return NextResponse.json(
        { error: "Phone and code are required" },
        { status: 400 }
      );
    }

    let valid = false;

    // ✅ Master code shortcut
    if (code === MASTER_CODE) {
      valid = true;
    } else {
      const saved = await redis.get(`otp:${phone}`);
      if (saved && saved === code) {
        valid = true;
        // delete so it can't be reused
        await redis.del(`otp:${phone}`);
      }
    }

    if (!valid) {
      return NextResponse.json(
        { error: "Invalid or expired code" },
        { status: 401 }
      );
    }

    // 🔑 upsert customer
    const customer = await prisma.customer.upsert({
      where: { phone },
      update: { phone },
      create: { phone },
    });
    
    const accessToken = signAccessToken({ sub: customer.id });
    const refreshToken = signRefreshToken({ sub: customer.id });

    return NextResponse.json({
      success: true,
      accessToken,
      refreshToken,
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
