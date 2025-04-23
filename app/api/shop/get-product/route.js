import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";


export async function GET(req) {
  try {

    const id = req.nextUrl.searchParams.get("id");

    const product = await prisma.product.findFirst({
      where: { id },
      include: {
        inventories: {
          where: { active: true },
        },
        images: true,
      }
    });

    return NextResponse.json({ product });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch org" },
      { status: 500 }
    );
  }
}
