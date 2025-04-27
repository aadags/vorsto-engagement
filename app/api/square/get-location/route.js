import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import { cookies } from "next/headers";
import { SquareClient } from "square";

export const dynamic = "force-dynamic";

async function getCookieData() {
  const cookieData = cookies().get("organizationId");
  return cookieData ? cookieData.value : null;
}

export async function GET(req) {
  try {

    const cookieData = await getCookieData();
    const organizationId = Number(cookieData) ?? 0;

    const pp = await prisma.paymentProcessor.findFirstOrThrow({
      where: { name: "Square", organization_id: organizationId },
    });

    const client = new SquareClient({
      token: pp.access_token,
      environment: process.env.NEXT_PUBLIC_SQUARE_BASE,
    });
    const { location } = await client.locations.get({
      locationId: pp.location,
    });

    // Return all active locations
    return NextResponse.json(location);

  } catch (error) {
    console.error('Server Error:', error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
