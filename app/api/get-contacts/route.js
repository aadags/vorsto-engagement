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

    const contacts = await prisma.conversation.findMany({
      distinct: ['name', 'email', 'phone', 'username'], // Ensure uniqueness based on these fields
      select: {
        name: true,
        email: true,
        phone: true,
        username: true,
      },
      where: { organization_id: organizationId },
      orderBy: { created_at: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    const total = prisma.conversation.count({
      distinct: ['name', 'email', 'phone', 'username'],
      where: { organization_id: organizationId },
    });

    return NextResponse.json({ data: contacts, count: total });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch convos" },
      { status: 500 }
    );
  }
}
