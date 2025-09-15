// /app/api/stripe/setup-intent/route.js
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import prisma from "@/db/prisma";

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY, { apiVersion: '2024-06-20' });

function cors(res) {
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return res;
}

export async function OPTIONS() {
  return cors(new NextResponse(null, { status: 204 }));
}

export async function POST(req) {
  try {     
    const { items, amount, cartAmount, subCartAmount, subCartTaxAmount, deliveryAmount, tipAmount, dealCommissionAmount, serviceFeeAmount, currency, customerId, destinationAccountId, pickup, promoId, promoApplied, promoDiscount } = await req.json();

    const pp = await prisma.paymentProcessor.findUnique({
      where: {
        organization_id_name: {
          organization_id: Number(destinationAccountId),
          name: "VorstoPay",
        },
      }
    })

    const connectedAccount = pp.accountId

    const org = await prisma.organization.findUnique({
      where: {
        id: Number(destinationAccountId)
      }
    })

    const customer = await ensureCustomer(customerId);

    const nonDealItems = items.filter(r => !r.isDeal);

    // Subtotal for non-deal items only
    const nonDealSub = nonDealItems.reduce((sum, r) => sum + lineSubCents(r), 0);

    // Commission applies only to non-deal items
    const commissionFee = Math.round((nonDealSub * (pickup? 5 : org.ship_org_info.merchant_commission_rate)) / 100);

    let appFee = commissionFee + deliveryAmount + tipAmount + dealCommissionAmount + serviceFeeAmount;

    if (promoApplied && promoDiscount > 0) {
      appFee = Math.max(0, appFee - promoDiscount);
    }

    const pi = await stripe.paymentIntents.create({
      amount: amount,
      payment_method_types: ["card"],
      currency,
      customer: customer.id,
      transfer_data: { destination: connectedAccount },
      application_fee_amount: appFee,
      on_behalf_of: connectedAccount,
    });

    return cors(NextResponse.json(pi));

  } catch (e) {
    console.log(e);
    return cors(NextResponse.json({ error: e.message }, { status: 500 }));
  }
}

async function ensureCustomer(userId) {
  // store mapping (userId -> stripeCustomerId) in your DB; here we create a quick alias:
  // Example only—replace with your real persistence.
  let existing = null;
  existing = await prisma.customer.findUnique({
    where: { id: userId }
  })
  if (existing.stripe_id) return { id: existing.stripe_id };
  
  const c = await stripe.customers.create({ name: existing.name, metadata: { app_user_id: userId } });

  await prisma.customer.update({
    where: { id: userId },
    data: {
      stripe_id: c.id
    }
  })
  return c;
}

function lineSubCents(r) {
  const ignoreWeight = r.organizationType === 'Food';
  const isWeight = !ignoreWeight && r.price_unit !== 'unit';

  const price = Number(r.price_cents ?? 0);
  const qty = isWeight? Number(r.quantity / r.step) : Number(r.quantity ?? 1); // guard
  return Math.round(price * qty);
}