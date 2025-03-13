import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import twilio from "twilio";
import prisma from "@/db/prisma";


export const dynamic = "force-dynamic";

async function getCookieData() {
  const cookieData = cookies().get("organizationId");
  return cookieData ? cookieData.value : null;
}

export async function GET(req) {
  try {

    const cookieData = await getCookieData();
    const orgId = Number(cookieData) ?? 0;

    const page = parseInt(req.nextUrl.searchParams.get("page")); // Default to page 1 if not provided
    const pageSize = parseInt(req.nextUrl.searchParams.get("per_page"));

    const bots = await prisma.bot.findMany({
      where: { organization_id: orgId },
      orderBy: { created_at: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    const total = await prisma.bot.count({
      where: { organization_id: orgId },
    });
   

    return NextResponse.json({ data: bots, count: total });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch plans" },
      { status: 500 }
    );
  }
}
