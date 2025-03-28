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
        support_email: null,
        support_email_connection: null,
      },
      where: {
        id: orgId,
      },
    });

    return NextResponse.json({
      message: "Support email disconnected successfully"
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to dis email Account" },
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
