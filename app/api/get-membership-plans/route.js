// /app/api/get-membership-plans/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/db/prisma';
import { cookies } from "next/headers";
export const dynamic = "force-dynamic";

async function getCookieData() {
  const cookieData = cookies().get("organizationId");
  return cookieData ? cookieData.value : null;
}

export async function GET(req) {
  const cookieData = await getCookieData();
  const orgId = Number(cookieData) ?? 0;

  const plans = await prisma.membershipPlan.findMany({
    where: {
      organization_id: orgId ,
      is_active: true,
    },
    orderBy: { price: 'asc' },
    select: {
      id: true,
      name: true,
      price: true,
    },
  });

  return NextResponse.json(plans);
}
