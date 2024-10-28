"use server";
import { NextResponse } from 'next/server';
import faktory from "faktory-worker"

export async function POST(req) {

  try {

    const { event, data } = await req.json();

    // Handle the event
    switch (event) {
      case 'subscription.disable':
        handleSubscriptionDeleted(data);
        break;

      // Handle other event types if needed

      default:
        console.log(`Unhandled event type ${event}`);
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


async function handleSubscriptionDeleted(data) {

  const client = await faktory.connect({
    url: process.env.FAKTORY_URL  || ""
  });
  
  await client.push({
    jobtype: 'SubscriptionDeletedPaystack',
    args: [{ data }],
    queue: 'default', // or specify another queue
    at: new Date(Date.now() + 120000) // 2 minutes delay
  });

  await client.close();
  
}