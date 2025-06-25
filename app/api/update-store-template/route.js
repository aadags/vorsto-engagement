"use server";
import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import RedisHandler from "@/redis/redisHandler";

export async function POST(req) {
  try {

    const organizationId = Number(
      req.cookies.get("organizationId")?.value ?? 0
    );

    const body = await req.json();
    const { slug } = body;

    await prisma.organization.update({
      data: {
        shop_template: slug
      },
      where: {
        id: organizationId,
      },
    });

    return NextResponse.json({
      message: "Data updated"
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update bot and functions" },
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
