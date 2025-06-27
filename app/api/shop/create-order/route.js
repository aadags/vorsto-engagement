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

    const { uuid, customer, mid, channel, intentId } = await req.json();

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
        const isWeight = item.inventory.price_unit !== "unit";
        const step = isWeight ? item.inventory.weight_step : 1;
        const qty = item.quantity; // this holds either unit or weight directly
        const price = item.inventory.price;
    
        const base = isWeight
          ? (qty / step) * price  // price is per weight_step
          : qty * price;          // normal unit price
    
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

    const response = await fetch(`${process.env.SHIPPING_API}/api/update-commission`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ companyId: org.ship_org_id, deliveryId: shipping.id, shippingCommission, customer }),
    });
    const data = await response.json();

      const order = await prisma.order.create({
        data: {
          contact_id: contact.id,
          total_price: total,
          sub_total_price: subtotal,
          tax_total: taxTotal,
          address: customer.address,
          note: customer.note,
          shipping_commission: shippingCommission,
          shipping_price: shipping.total,
          shipping_tip: shipping.tip,
          shipping_id: shipping.id,
          status: "Pending",
          channel,
          transactionId: intentId,
          organization_id: mid,
          order_items: {
            create: orderItems.map(item => {
              const isWeight = item.inventory.price_unit !== "unit";
              const step = isWeight ? item.inventory.weight_step : 1;
              const qty = item.quantity;
              const price = item.inventory.price;
          
              const base = isWeight
                ? (qty / step) * price
                : qty * price;
          
              const tax = item.inventory.product.tax_type === "flatfee"
                ? item.inventory.product.tax
                : (base * item.inventory.product.tax) / 100;
          
              return {
                inventory_id: item.inventory_id,
                status: "Pending",
                quantity: qty,
                price: Math.round(base), // round to ensure it's an integer if needed
                tax: Math.round(tax),
                price_unit: item.inventory.price_unit || "unit",
              };
            })
          }
        },
        include: {
          order_items: true,
        },
      });

      await prisma.$transaction(async (tx) => {
        
        await tx.cartItem.deleteMany({
          where: { cart_id: cart.id }
        });
      
        await tx.cart.delete({
          where: { id: cart.id }
        });
      });

      //send whatsapp notification
      if(org.contact_number && org.contact_number !== ""){
        await sendBusinessOrderReceivedNotification(org.contact_number, org.name, order.id);
      }

      const client = await faktory.connect({
        url: process.env.FAKTORY_URL  || ""
      });
      
      await client.push({
        jobtype: 'SendOrderNotification',
        args: [{ order, contact, org }],
        queue: 'default', // or specify another queue
        at: new Date(Date.now())
      });
    
      await client.close();

      return NextResponse.json(order);

    


  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch org" },
      { status: 500 }
    );
  }
}
