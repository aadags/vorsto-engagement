"use server";
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';
import faktory from "faktory-worker"

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20', // Use the correct API version
});

export async function POST(req) {

  try {
    const buf = Buffer.from(await req.arrayBuffer());
    const sig = req.headers.get('stripe-signature');

    let event;

    try {
      // Verify the webhook signature
      event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      console.error('Webhook signature verification failed.', err.message);
      return NextResponse.json({ error: 'Failed to receive:'+ err.message }, { status: 400 });
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        handleCustomerCreation(event.data.object);
        break;

      case 'customer.subscription.created':
        handleSubscriptionCreated(event.data.object);
        break;

      case 'customer.subscription.updated':
        handleSubscriptionUpdated(event.data.object);
        break;

      case 'customer.subscription.deleted':
        handleSubscriptionDeleted(event.data.object);
        break;

      // Handle other event types if needed

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to receive' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
}

export async function PUT() {
  return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
}


async function handleCustomerCreation(session) {

  console.log({...session});
  const id = session.client_reference_id;
    if(session.payment_status === "paid") {
      const customerId = session.customer;
      // Update the user in the database with the Stripe subscription details
      await prisma.organization.update({
        where: { id: Number(id) },
        data: {
          stripe_id: customerId,
        },
      });
    }
}

async function handleSubscriptionCreated(subscription) {

  console.log({ subscription });

  const client = await faktory.connect({
    url: process.env.FAKTORY_URL  || ""
  });

  await client.push({
    jobtype: 'EngageSubscriptionCreated',
    args: [{ subscription }],
    queue: 'default', // or specify another queue
    at: new Date(Date.now() + 5000) // 2 minutes delay
  });

  await client.close();

}

async function handleSubscriptionUpdated(subscription) {

  const client = await faktory.connect({
    url: process.env.FAKTORY_URL  || ""
  });
  
  await client.push({
    jobtype: 'EngageSubscriptionUpdated',
    args: [{ subscription }],
    queue: 'default', // or specify another queue
    at: new Date(Date.now() + 120000) // 2 minutes delay
  });

  await client.close();

}

async function handleSubscriptionDeleted(subscription) {

  const client = await faktory.connect({
    url: process.env.FAKTORY_URL  || ""
  });
  
  await client.push({
    jobtype: 'EngageSubscriptionDeleted',
    args: [{ subscription }],
    queue: 'default', // or specify another queue
    at: new Date(Date.now() + 120000) // 2 minutes delay
  });

  await client.close();
  
}