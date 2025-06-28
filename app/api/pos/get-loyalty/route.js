import { NextResponse } from "next/server";
import prisma from "@/db/prisma";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const body = await req.json();
    const { identifier } = body;

    if (!identifier) {
      return NextResponse.json({ message: "Identifier is required" }, { status: 400 });
    }

    const account = await prisma.loyaltyAccount.findFirst({
      where: {
        OR: [
          { contact: { phone: identifier } },
          { card_code: identifier }
        ]
      },
      include: {
        contact: true,
        loyalty_program: true,
        membership_plan: true
      }
    });

    if (!account) {
      return NextResponse.json({ message: "Loyalty account not found" }, { status: 404 });
    }

    return NextResponse.json({ account });
  } catch (error) {
    console.error("Loyalty lookup error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
