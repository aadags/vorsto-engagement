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

    const payments = await prisma.paymentProcessor.findMany({
      where: { organization_id: orgId },
    });

    return NextResponse.json(payments);

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch plans" },
      { status: 500 }
    );
  }
}
