import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import faktory from "faktory-worker";
import { Pridi } from "next/font/google";

export const dynamic = "force-dynamic";


export async function POST(req) {
  try {

    const { shippingId, status } = await req.json();

    let orderStatus = "breached"

    if(status == 2)
    {
      orderStatus = "In transit"
    }

    if(status == 1)
    {
      orderStatus = "Delivered"
    }

    await prisma.order.update({
      where: {
        shipping_id: shippingId
      },
      data: {
        status: orderStatus
      }
    });

    const order = await prisma.order.findFirst({
      where: {
        shipping_id: shippingId
      },
      include: {
        contact: true,
        organization: true
      }
    });

    const client = await faktory.connect({
      url: process.env.FAKTORY_URL  || ""
    });
    
    await client.push({
      jobtype: 'SendOrderUpdateNotification',
      args: [{ order }],
      queue: 'default', // or specify another queue
      at: new Date(Date.now())
    });
  
    await client.close();

    if(status == 1)
    {
      const client2 = await faktory.connect({
        url: process.env.FAKTORY_URL  || ""
      });
      
      await client2.push({
        jobtype: 'SendOrderReview',
        args: [{ order }],
        queue: 'default', // or specify another queue
        at: new Date(Date.now() + 2 * 60 * 60 * 1000)
      });
    
      await client2.close();
  
    }

    return NextResponse.json(
      { message: "Order updated" },
      { status: 200 }
    );


  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}
