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
    const orgId = Number(cookieData) ?? 0;

    const org = await prisma.organization.findFirst({
      where: { id: orgId },
      include: {
        payment_processors: true
      }
    });

    const paymentProcessor = await prisma.paymentProcessor.findFirstOrThrow({
      where: { name: "VorstoPay", organization_id: org.id },
    });

    if(paymentProcessor){
      org.paymentProcessor = paymentProcessor
    }
  
    return NextResponse.json(org);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}
