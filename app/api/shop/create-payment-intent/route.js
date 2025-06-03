import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import { SquareClient } from "square";
import faktory from "faktory-worker";
import Stripe from "stripe";
import { sendBusinessOrderReceivedNotification } from "@/services/whatsapp";

export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia', // Use the correct API version
});


export async function POST(req) {
  try {

    const { uuid, token, customer, idempotencyKey, mid, channel } = await req.json();

    const org = await prisma.organization.findFirst({
      where: { id: mid }
    });

    let contact = await prisma.contact.findUnique({
      where: {
        organization_id_email: {
          organization_id: org.id,
          email: customer.email,
        },
      },
    });
    
    if (!contact) {
      contact = await prisma.contact.create({
        data: {
          name: customer.firstname + " " + customer.lastname,
          email: customer.email,
          phone: customer.phone,
          organization_id: org.id,
        },
      });
    }

    const cart = await prisma.cart.findFirst({
      where: {
        uuid
      },
      include: {
        cart_items: {
          include: {
            inventory: {
              include: {
                product: true
              }
            }
          }
        }
      }
    });

    const orderItems = cart.cart_items
    const shipping = JSON.parse(cart.shipping_info);
    
    const { subtotal, taxTotal } = orderItems.reduce(
      (acc, item) => {
        const base = item.inventory.price * item.quantity;
        const tax = item.inventory.product.tax_type === "flatfee"
          ? item.inventory.product.tax
          : (base * item.inventory.product.tax) / 100;
    
        acc.subtotal += base;
        acc.taxTotal += tax;
    
        return acc;
      },
      { subtotal: 0, taxTotal: 0 }
    );
    
    
    const total = Math.ceil(subtotal + taxTotal + shipping.total + shipping.tip)

    const channelFee = org.channel_fee / 100;
    const shippingCommission = shipping.merchant_commission_rate > 0? subtotal * (shipping.merchant_commission_rate / 100) : 0;
    const appFee = Math.ceil((channelFee * subtotal) + shipping.total + shippingCommission + shipping.tip);

    
    const pp = await prisma.paymentProcessor.findFirstOrThrow({
      where: { name: "VorstoPay", organization_id: org.id },
    });

    const payload = {
      amount: total, // Amount in cents
      currency: org.currency,
      payment_method: token,
      application_fee_amount: appFee, // Amount in cents
      metadata: {
        idempotencyKey: idempotencyKey
      },
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never' // 👈 This disables redirect-based methods
      }
    };

    const intent = await stripe.paymentIntents.create(payload, {
      stripeAccount: pp.accountId 
    });

    return NextResponse.json({ clientSecret: intent.client_secret, stripeAccountId: pp.accountId, intentId: intent.id });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch org" },
      { status: 500 }
    );
  }
}
