// app/api/verify-code/route.ts
"use server";

import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "@/jwt/jwt"; 

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
    const { refreshToken } = await req.json();

    const payload = verifyRefreshToken(refreshToken);
    if (!payload) {
      return NextResponse.json({ error: "Invalid refresh token" }, { status: 401 });
    }

    // Re-issue new access token
    const newAccessToken = signAccessToken({ sub: payload.sub });
    const newRefreshToken = signRefreshToken({ sub: payload.sub });

    return NextResponse.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch (e) {
    return NextResponse.json({ error: "Refresh failed" }, { status: 500 });
  }
}
