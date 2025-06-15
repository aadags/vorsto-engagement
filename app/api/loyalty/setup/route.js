// app/api/loyalty/setup/route.ts
import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import { cookies } from "next/headers";

export async function POST(req) {
  try {
    const data = await req.json();
    const cookie = cookies().get("organizationId");
    const organizationId = Number(cookie?.value ?? 0);

    const { loyaltyProgram, membershipPlan } = data;

    if (loyaltyProgram) {
      await prisma.loyaltyProgram.create({
        data: {
          name: loyaltyProgram.name,
          point_rate: loyaltyProgram.point_rate,
          redeem_rate: loyaltyProgram.redeem_rate,
          organization_id: organizationId,
        },
      });
    }

    if (membershipPlan) {
      await prisma.membershipPlan.create({
        data: {
          name: membershipPlan.name,
          price: membershipPlan.price * 100,
          duration_days: membershipPlan.duration_days,
          benefits: membershipPlan.benefits,
          organization_id: organizationId,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Loyalty setup failed:", error);
    return NextResponse.json({ error: "Failed to setup loyalty" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const cookie = cookies().get("organizationId");
    const organizationId = Number(cookie?.value ?? 0);

    const loyaltyProgram = await prisma.loyaltyProgram.findFirst({
      where: { organization_id: organizationId },
    });

    const membershipPlans = await prisma.membershipPlan.findMany({
      where: { organization_id: organizationId },
    });

    return NextResponse.json({
      loyaltyProgram,
      membershipPlans,
    });
  } catch (error) {
    console.error("Failed to load loyalty data:", error);
    return NextResponse.json({ error: "Failed to load data" }, { status: 500 });
  }
}
