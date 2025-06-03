import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import { cookies } from "next/headers";
import Stripe from 'stripe';
import { SquareClient, SquareEnvironment } from "square";
import { CompositionHookListInstance } from "twilio/lib/rest/video/v1/compositionHook";


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

    const cursor = req.nextUrl.searchParams.get("cursor"); // Default to page 1 if not provided
    const pageSize = parseInt(req.nextUrl.searchParams.get("per_page")) || 10;
    const fromDateStr = req.nextUrl.searchParams.get("from");
    const toDateStr = req.nextUrl.searchParams.get("to");

    const fromDate = new Date(fromDateStr);
    const [year, month, day] = toDateStr.split("-").map(Number);
    const toDateUTC = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));

    const fromDateISO = fromDate.toISOString(); // Start of from-date
    const toDateISO = toDateUTC.toISOString();

    let payments = [];

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

      if(cursor && cursor != "null"&& cursor != "undefined"){
        
        payments = await client.payments.list({
            limit: Number(pageSize),
            cursor: cursor,
            beginTime: fromDateISO,
            endTime: toDateISO
        });

      } else {

        payments = await client.payments.list({
          limit: Number(pageSize),
          beginTime: fromDateISO,
          endTime: toDateISO
        });

      }
      const safeStringify = (obj) => JSON.stringify(obj, (_k, v) => (typeof v === 'bigint' ? Number(v) : v));
      payments = JSON.parse(safeStringify(payments));
      
    }

    if (paymentProcessor.name === "Stripe") {
      const stripeAccountId = paymentProcessor.access_token; // this should be the connected account ID (i.e., Stripe Connect ID)
    
      let params = {
        limit: Number(pageSize),
        created: {
          gte: Math.floor(new Date(fromDateISO).getTime() / 1000),
          lte: Math.floor(new Date(toDateISO).getTime() / 1000),
        },
      };
    
      if (cursor && cursor !== "null" && cursor !== "undefined") {
        params.starting_after = cursor;
      }
    
      // Fetch charges for the connected account
      let charges = await stripe.charges.list(params, {
        stripeAccount: stripeAccountId,
      });
    
      payments = charges
    }

    

    return NextResponse.json(payments.response);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch payments" },
      { status: 500 }
    );
  }
}
