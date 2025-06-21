// app/api/loyalty/setup/route.ts
import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import { cookies } from "next/headers";

export async function POST(req) {
  try {
    const data = await req.json();
    const cookie = cookies().get("organizationId");
    const organizationId = Number(cookie?.value ?? 0);

    const { loyaltyProgram, membershipPlans } = data;

    // === Upsert LoyaltyProgram ===
    if (loyaltyProgram) {
      await prisma.loyaltyProgram.upsert({
        where: {
          organization_id_name: {
            organization_id: organizationId,
            name: loyaltyProgram.name,
          },
        },
        update: {
          point_rate: loyaltyProgram.point_rate,
          redeem_rate: loyaltyProgram.redeem_rate,
        },
        create: {
          name: loyaltyProgram.name,
          point_rate: loyaltyProgram.point_rate,
          redeem_rate: loyaltyProgram.redeem_rate,
          organization_id: organizationId,
        },
      });
    }

    // === Loop through MembershipPlans ===
    if (membershipPlans && Array.isArray(membershipPlans)) {
      for (const plan of membershipPlans) {
        const data = {
          name: plan.name,
          price: parseInt(plan.price) * 100,
          duration_days: parseInt(plan.duration_days),
          benefits: plan.benefits,
          discount_percent: parseFloat(plan.discount_percent ?? 0),
          cashback_percent: parseFloat(plan.cashback_percent ?? 0),
          organization_id: organizationId,
        };

        if (plan.id) {
          await prisma.membershipPlan.update({
            where: { id: plan.id },
            data,
          });
        } else {
          await prisma.membershipPlan.create({ data });
        }
      }
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
