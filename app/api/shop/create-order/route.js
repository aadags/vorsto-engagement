import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import { SquareClient } from "square";

export const dynamic = "force-dynamic";


export async function POST(req) {
  try {

    const { uuid, token, shipping, customer, idempotencyKey, mid } = await req.json();

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

    const subtotal = orderItems.reduce((sum, item) => sum + item.inventory.price * item.quantity, 0);

    const total = subtotal + shipping.total

    
    const pp = await prisma.paymentProcessor.findFirstOrThrow({
      where: { name: "Square", organization_id: org.id },
    });

    const client = new SquareClient({
      token: pp.access_token,
      environment: process.env.NEXT_PUBLIC_SQUARE_BASE,
    });

    let channelFee = 0.02;

    //check org plan n set channel fees apprppriately.

    const appFee = (channelFee * subtotal) + shipping.total

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
    
    const { payment } = await client.payments.create(payload);

    console.log({payment})

    if(payment.status === "COMPLETED")
    {
      const order = await prisma.order.create({
        data: {
          contact_id: contact.id,
          total_price: total,
          shipping_price: shipping.total,
          status: "Pending",
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
          where: { cartId: cart.id }
        });
      
        await tx.cart.delete({
          where: { id: cart.id }
        });
      });

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
