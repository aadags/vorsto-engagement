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
    const id = req.nextUrl.searchParams.get("formId");
    const cookieData = await getCookieData();
    const organizationId = Number(cookieData) ?? 0;


    const form = await prisma.form.findFirst({
      where: { id, organization_id: organizationId }
    });
    return NextResponse.json({ form });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch form" },
      { status: 500 }
    );
  }
}
