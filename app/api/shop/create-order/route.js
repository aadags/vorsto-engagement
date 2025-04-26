import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";


export async function POST(req) {
  try {

    const { uuid, paymentIntent, shipping_price, customer, organization_id } = await req.json();

    // await prisma.cartItem.create({
    //   data: {
    //     inventory_id,
    //     cart_id: cart.id,
    //     quantity
    //   }
    // });

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
  
    const order = await prisma.order.create({
      data: {
        total_price: paymentIntent.amount - shipping_price,
        shipping_price,
        status: "Pending",
        transactionId: paymentIntent.id,
        organization_id: organization_id,
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


    return NextResponse.json(order);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch org" },
      { status: 500 }
    );
  }
}
