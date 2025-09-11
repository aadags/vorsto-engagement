// app/api/verify-code/route.ts
"use server";

import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import { Prisma } from "@prisma/client";

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
    const { userId, deviceToken } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "All fields are required" },
        { status: 400 }
      );
    }

    // If no conflicts, update
    await prisma.customer.update({
      where: { id: userId },
      data: {
        device_token: deviceToken,
      },
    });

    return NextResponse.json({
      success: true
    });

  } catch (err) {
    console.log(err)
    return NextResponse.json(
      { success: false, error: "Failed to update user device token" },
      { status: 500 }
    );
  }
}
