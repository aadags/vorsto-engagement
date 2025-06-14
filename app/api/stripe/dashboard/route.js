import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import { cookies } from "next/headers";
import Stripe from 'stripe';

export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia', // Use the correct API version
});

async function getCookieData() {
  const cookieData = cookies().get("organizationId");
  return cookieData ? cookieData.value : null;
}

export async function GET() {
  try {
    const cookieData = await getCookieData();
    const organizationId = Number(cookieData) ?? 0;

    let org = await prisma.organization.findFirst({
      where: { id: organizationId },
    });

    const paymentProcessor = await prisma.paymentProcessor.findFirstOrThrow({
      where: { name: "VorstoPay", organization_id: org.id },
    });

    const balance = await stripe.balance.retrieve({
      stripeAccount: paymentProcessor.accountId,
    })
    const transactions = await stripe.charges.list({ limit: 10 }, {
      stripeAccount: paymentProcessor.accountId,
    })
    const payouts = await stripe.payouts.list({ limit: 10 }, {
      stripeAccount: paymentProcessor.accountId,
    })

    return NextResponse.json({
      balance: balance.available[0]?.amount || 0,
      transactions: transactions.data,
      payouts: payouts.data,
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create accounts" },
      { status: 500 }
    );
  }
}
