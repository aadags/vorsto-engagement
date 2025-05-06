import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import { SquareClient } from "square";
import faktory from "faktory-worker"

export const dynamic = "force-dynamic";


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
      where: { name: "Square", organization_id: org.id },
    });

    const client = new SquareClient({
      token: pp.access_token,
      environment: process.env.NEXT_PUBLIC_SQUARE_BASE,
    });

    const payload = {
      idempotencyKey: idempotencyKey,
      locationId: pp.location,
      sourceId: token,
      amountMoney: {
        amount: BigInt(total),
        currency: org.currency.toUpperCase(),
      },
      appFeeMoney: {
        amount: BigInt(appFee),
        currency: org.currency.toUpperCase(),
      },
    };

    const response = await fetch(`${process.env.SHIPPING_API}/api/update-commission`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ companyId: org.ship_org_id, deliveryId: shipping.id, shippingCommission }),
    });
    const data = await response.json();
    
    const { payment } = await client.payments.create(payload);

    if(payment.status === "COMPLETED")
    {
      const order = await prisma.order.create({
        data: {
          contact_id: contact.id,
          total_price: total,
          sub_total_price: subtotal,
          tax_total: taxTotal,
          address: customer.address,
          shipping_commission: shippingCommission,
          shipping_price: shipping.total,
          shipping_tip: shipping.tip,
          status: "Pending",
          channel,
          transactionId: payment.id,
          organization_id: mid,
          order_items: {
            create: orderItems.map(item => ({
              inventory_id: item.inventory_id,
              status: "Pending",
              quantity: item.quantity,
              price: item.inventory.price * item.quantity,
              tax: item.inventory.product.tax_type==="flatfee"? item.inventory.product.tax : ((item.inventory.price * item.quantity) * item.inventory.product.tax) / 100,
            })),
          },
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

    } else {

      await prisma.cart.update({
        where: {
          id: cart.id
        },
        data: {
          contact_id: contact.id
        }
      })

      return NextResponse.json(
        { error: "Payment error, try again" },
        { status: 422 }
      );
    }


  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch org" },
      { status: 500 }
    );
  }
}
