import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

async function getCookieData() {
  const cookieData = cookies().get("organizationId");
  return cookieData ? cookieData.value : null;
}

export async function GET() {
  try {
    const cookieData = await getCookieData();
    const orgId = Number(cookieData) ?? 0;

    const org = await prisma.organization.update({
      data: {
        wa_phone_id: null,
        waba_id: null,
        wa_token: null
      },
      where: {
        id: orgId,
      },
    });

    return NextResponse.json({
      message: "WS Account disconnected successfully"
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to dis WS Account" },
      { status: 500 }
    );
  }
}

export async function POST() {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}

export async function PUT() {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}
