import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import { cookies } from "next/headers";
import Stripe from 'stripe';
import { SquareClient, SquareEnvironment } from "square";

export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia', // Use the correct API version
});

async function getCookieData() {
  const cookieData = cookies().get("organizationId"); 
  return cookieData ? cookieData.value : null;
}

export async function GET(req) {
  try {
    const cookieData = await getCookieData();
    const organizationId = Number(cookieData) ?? 0;

    const id = req.nextUrl.searchParams.get("id"); 

    let payment = {};

    const paymentProcessor = await prisma.paymentProcessor.findFirst({
        where: {
          organization_id: Number(organizationId)
        }
    });

    if(paymentProcessor.name === "Square")
    {
      const client = new SquareClient({
        environment: process.env.NEXT_PUBLIC_SQUARE_BASE,
        token: paymentProcessor.access_token,
      });

      payment = await client.payments.get({
        paymentId: id,
      });
      
      const safeStringify = (obj) => JSON.stringify(obj, (_k, v) => (typeof v === 'bigint' ? Number(v) : v));
      payment = JSON.parse(safeStringify(payment));
    }

    if(paymentProcessor.name === "VorstoPay")
    {
      const intent = await stripe.paymentIntents.retrieve(id, {
        stripeAccount: paymentProcessor.accountId,
      });

      payment = intent;
      
    }

    

    return NextResponse.json(payment.payment);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch payments" },
      { status: 500 }
    );
  }
}
