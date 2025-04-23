import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";


export async function GET(req) {
  try {

    const subdomain = req.nextUrl.searchParams.get("subdomain");
    const uuid = req.nextUrl.searchParams.get("uuid");

    const org = await prisma.organization.findFirst({
      where: { subdomain },
    });

    const cart = await prisma.cart.findFirst({
      where: {
        uuid, organization_id: org.id
      },
      include: {
        cart_items: true
      }
    })

    return NextResponse.json({ cart });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch org" },
      { status: 500 }
    );
  }
}
