import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import { cookies } from "next/headers";
import Stripe from 'stripe';

export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia',
});

async function getCookieData() {
  const cookieData = cookies().get("organizationId");
  return cookieData ? cookieData.value : null;
}

export async function GET(req) {
  try {
    const cookieData = await getCookieData();
    const organizationId = Number(cookieData) ?? 0;

    // Check if account already exists
    const existingProcessor = await prisma.paymentProcessor.findFirst({
      where: {
        organization_id: organizationId,
        name: "VorstoPay",
      },
    });

    const org = await prisma.organization.findFirst({
      where: {
        id: organizationId,
      },
    });

    let accountId;

    if (existingProcessor?.accountId) {
      accountId = existingProcessor.accountId;
    } else {
      // Create new Stripe account
      const account = await stripe.accounts.create({ type: 'standard', country: org.country });
      accountId = account.id;

      // Remove existing processors just in case (clean-up)
      await prisma.paymentProcessor.deleteMany({
        where: { organization_id: organizationId },
      });

      // Save new processor
      await prisma.paymentProcessor.create({
        data: {
          name: "VorstoPay",
          accountId,
          organization_id: organizationId,
        },
      });
    }

    // Create onboarding link
    const { url } = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${process.env.NEXT_PUBLIC_APP_URL}/integration/payments`,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/integration/payments`,
      type: 'account_onboarding',
    });

    return NextResponse.json({ url });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to handle Stripe account" }, { status: 500 });
  }
}
