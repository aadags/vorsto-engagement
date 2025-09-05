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
    const { id, name, email, phone, pictureUrl } = await req.json();

    if (!id || !name || !email || !phone) {
      return NextResponse.json(
        { success: false, error: "All fields are required" },
        { status: 400 }
      );
    }

    // Check for duplicate email
    const emailExists = await prisma.customer.findFirst({
      where: { email, NOT: { id } },
    });
    if (emailExists) {
      return NextResponse.json(
        { success: false, error: "This email is already in use" },
        { status: 400 }
      );
    }

    // Check for duplicate phone
    const phoneExists = await prisma.customer.findFirst({
      where: { phone, NOT: { id } },
    });
    if (phoneExists) {
      return NextResponse.json(
        { success: false, error: "This phone number is already in use" },
        { status: 400 }
      );
    }

    // If no conflicts, update
    const customer = await prisma.customer.update({
      where: { id },
      data: {
        name,
        email,
        phone,
        image: pictureUrl || null,
      },
    });

    return NextResponse.json({
      success: true,
      customer,
    });
  } catch (err) {
    console.error("UPDATE USER ERROR:", err);

    // Handle Prisma unique constraint error as a fallback
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      const target = (err.meta?.target || []);
      if (target.includes("email")) {
        return NextResponse.json(
          { success: false, error: "This email is already in use" },
          { status: 400 }
        );
      }
      if (target.includes("phone")) {
        return NextResponse.json(
          { success: false, error: "This phone number is already in use" },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { success: false, error: "Failed to update user" },
      { status: 500 }
    );
  }
}
