import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

async function getCookieData() {
  const cookieData = cookies().get("organizationId");
  return cookieData ? cookieData.value : null;
}

export async function GET(req) {
  try {

    const cookieData = await getCookieData();
    const organizationId = Number(cookieData) ?? 0;

    const id = req.nextUrl.searchParams.get("id");

    const category = await prisma.category.findFirst({
      where: { id,
        organization_id: organizationId 
      }
    });

    return NextResponse.json({ ...category });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}
