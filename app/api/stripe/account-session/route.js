import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import { cookies } from "next/headers";
import Stripe from "stripe";

export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY, {
  apiVersion: "2024-12-18.acacia", // Use the correct API version
});

async function getCookieData() {
  const cookieData = cookies().get("organizationId");
  return cookieData ? cookieData.value : null;
}

export async function POST(req) {
  try {
    const cookieData = await getCookieData();
    const organizationId = Number(cookieData) ?? 0;

    const body = await req.json();
    const { account } = body;

    const accountSession = await stripe.accountSessions.create({
      account,
      components: {
        account_onboarding: { enabled: true },
        notification_banner: { enabled: true },
        payments: { enabled: true },
        balances: {
          enabled: true,
          features: {
            edit_payout_schedule: false,
            instant_payouts: false,
            standard_payouts: false,
            external_account_collection: true,
          },
        },
      },
    });

    await prisma.organization.update({
      where: { id: organizationId },
      data: {
        onboarding: true,
      },
    });

    return NextResponse.json({ client_secret: accountSession.client_secret });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create session" },
      { status: 500 }
    );
  }
}
