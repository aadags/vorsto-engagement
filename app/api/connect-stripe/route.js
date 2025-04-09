import { NextResponse } from "next/server";
import Stripe from 'stripe';
import prisma from "@/db/prisma";

export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia', // Use the correct API version
});

export async function POST(req) {
  try {

    const organizationId = Number(req.cookies.get("organizationId").value) ?? 0;

    const { code } = await req.json();

    const response = await stripe.oauth.token({
      grant_type: "authorization_code",
      code: code,
    });

    await prisma.paymentProcessor.deleteMany({
      where: {
        organization_id: organizationId
      }
    });

    await prisma.paymentProcessor.create({
      data: { 
        name: "Stripe",
        access_token: response.access_token, 
        refresh_token: response.refresh_token, 
        public_token: response.stripe_publishable_key,
        accountId: response.stripe_user_id,
        organization_id: organizationId 
      },
    });
   
    return NextResponse.json({ status: true });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch plans" },
      { status: 500 }
    );
  }
}
