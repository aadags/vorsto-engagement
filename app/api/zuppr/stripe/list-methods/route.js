// /app/api/stripe/setup-intent/route.js
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import prisma from "@/db/prisma";

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY, { apiVersion: '2024-06-20' });

function cors(res) {
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return res;
}

export async function OPTIONS() {
  return cors(new NextResponse(null, { status: 204 }));
}

export async function GET(req) {
  try {
    const customerId = req.nextUrl.searchParams.get('customerId');
    const customer = await ensureCustomer(customerId);
    const list = await stripe.paymentMethods.list({ customer: customer.id, type: 'card' });
    console.log({list})
    const paymentMethods = list.data.map(pm => ({
      id: pm.id,
      brand: pm.card?.brand ?? 'card',
      last4: pm.card?.last4 ?? '0000',
      exp_month: pm.card?.exp_month ?? 0,
      exp_year: pm.card?.exp_year ?? 0,
    }));
    return cors(NextResponse.json({ success: true, paymentMethods }));
  } catch (e) {
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
