import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import { cookies } from "next/headers";
import { SquareClient } from "square";
import Stripe from "stripe";
import { randomUUID } from "crypto";

export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY, {
  apiVersion: "2023-08-16",
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

    const order = await prisma.order.findFirst({
      where: { id, organization_id: organizationId },
      include: { order_items: true },
    });

    const org = await prisma.organization.findFirst({
      where: { id: organizationId },
    });

    await prisma.order.update({
      where: { id },
      data: { status: "Cancelled" },
    });

    for (const item of order.order_items) {
      await prisma.orderItem.update({
        where: { id: item.id },
        data: { status: "Cancelled" },
      });

      await prisma.inventory.update({
        where: { id: item.inventory_id },
        data: { quantity: { increment: item.quantity } },
      });
    }

    const total =
      order.sub_total_price +
      order.tax_total +
      order.shipping_price +
      order.deal_commission +
      order.shipping_tip;

    // const channelFee = org.channel_fee / 100;
    // const appFee = Math.ceil(
    //   channelFee * order.sub_total_price +
    //     order.shipping_price +
    //     order.shipping_commission +
    //     order.shipping_tip
    // );

    const pp = await prisma.paymentProcessor.findFirstOrThrow({
      where: { organization_id: organizationId },
    });

    // if (pp.name === "Square") {
    //   const client = new SquareClient({
    //     token: pp.access_token,
    //     environment: process.env.NEXT_PUBLIC_SQUARE_BASE,
    //   });

    //   await client.refunds.refundPayment({
    //     idempotencyKey: randomUUID(),
    //     paymentId: order.transactionId,
    //     amountMoney: {
    //       amount: BigInt(total),
    //       currency: org.currency.toUpperCase(),
    //     },
    //     appFeeMoney: {
    //       amount: BigInt(appFee),
    //       currency: org.currency.toUpperCase(),
    //     },
    //     reason: "Cancel & refund at customer request.",
    //   });

    // } else 
    if (pp.name === "VorstoPay") {
      // Stripe refund flow
      await stripe.refunds.create({
        payment_intent: order.transactionId,
        amount: total,
        refund_application_fee: true,
        reverse_transfer: true,  
      });
    }

    return NextResponse.json({ status: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to process refund" }, { status: 500 });
  }
}
