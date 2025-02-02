import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export const dynamic = "force-dynamic";

async function getCookieData() {
  const cookieData = cookies().get("organizationId");
  return cookieData ? cookieData.value : null;
}

async function getUserCookieData() {
  const cookieData = cookies().get("userId");
  return cookieData ? cookieData.value : null;
}

export async function GET(req) {
  try {
    const cookieData = await getCookieData();
    const organizationId = Number(cookieData) ?? 0;
    
    const cookieUserData = await getUserCookieData();
    const userId = Number(cookieUserData) ?? 0;

    const ticketId = req.nextUrl.searchParams.get("ticketId");

    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId, organization_id: organizationId },
      include: {
        user: true,
      }
    });

    const comments = await prisma.comment.findMany({
      where: { ticket_id: ticketId, organization_id: organizationId },
    });

    return NextResponse.json({ ticket, comments, userId });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch convos" },
      { status: 500 }
    );
  }
}
