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

export async function POST(req) {
  try {
    const cookieData = await getCookieData();
    const organizationId = Number(cookieData) ?? 0;

    const body = await req.json();
    const { country } = body;

    let org = await prisma.organization.findFirst({
      where: { id: organizationId },
    });

    if(!org.stripe_account_id)
    {
      const account = await stripe.accounts.create({
        type: "custom",
        controller: {
          stripe_dashboard: {
            type: "none",
          },
          fees: {
            payer: "application"
          },
        },
        capabilities: {
          card_payments: {requested: true},
          transfers: {requested: true},
          affirm_payments: { requested: true },
          klarna_payments: { requested: true },
          afterpay_clearpay_payments: { requested: true },
        },

        settings: {
          payouts: {
            schedule: {
              interval: "daily",
              delay_days: 2
            },
            debit_negative_balances: true
          }
        },
        country,
      });

      org = await prisma.organization.update({
        where: {
          id: organizationId
        },
        data: {
          stripe_account_id: account.id
        }
      });
    }

    return NextResponse.json({ account: org.stripe_account_id });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create accounts" },
      { status: 500 }
    );
  }
}
