import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";


export async function POST(req) {
  try {

    const body = await req.json();
    const { barcode, id } = body;

    const inventory = await prisma.inventory.findFirst({
      where: { barcode, active: true },
    });

    const product = await prisma.product.findFirst({
      where: { organization_id: id, id: inventory.product_id },
    });

    return NextResponse.json({ inventory, product });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch org" },
      { status: 500 }
    );
  }
}
