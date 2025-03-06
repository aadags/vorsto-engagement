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
   
    const freePlans = await prisma.number.count({
      where: { organization_id: orgId, plan: "free" },
    });

    const org = await prisma.organization.findFirst({
      where: { id: orgId },
    });

    return NextResponse.json({
      free: freePlans,
      plan: org.plan,
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch plans" },
      { status: 500 }
    );
  }
}
