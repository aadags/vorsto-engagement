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

    const page = parseInt(req.nextUrl.searchParams.get("page")); // Default to page 1 if not provided
    const pageSize = parseInt(req.nextUrl.searchParams.get("per_page"));

    const conversations = await prisma.conversation.findMany({
      where: { organization_id: organizationId, is_lead: true, user_id: null },
      orderBy: { created_at: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    const total = await prisma.conversation.count({
      where: { organization_id: organizationId, is_lead: true, user_id: null },
    });

    return NextResponse.json({ data: conversations, count: total });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch convos" },
      { status: 500 }
    );
  }
}
