// app/api/payment/stripe-info/route.js

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import Stripe from "stripe";
import prisma from "@/db/prisma";

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY, {
  apiVersion: "2024-12-18.acacia", // Use the correct API version
});
export const dynamic = "force-dynamic";

async function getCookieData() {
  const cookieData = cookies().get("organizationId");
  return cookieData ? cookieData.value : null;
}

export async function GET() {
  try {
    const organizationId = Number(await getCookieData()) || 0;

    const pp = await prisma.paymentProcessor.findFirstOrThrow({
      where: { name: "VorstoPay", organization_id: organizationId },
    });

    const stripeAccountId = pp.accountId; // Replace with actual field name if different

    const account = await stripe.accounts.retrieve(stripeAccountId);

    const data = {
      country: account.country,
      currency: account.default_currency,
      status: account.charges_enabled && account.details_submitted ? "active" : "pending",
    };

    return NextResponse.json(data);

  } catch (error) {
    console.error("Stripe Info Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
