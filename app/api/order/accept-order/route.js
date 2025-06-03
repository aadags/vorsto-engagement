import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import { cookies } from "next/headers";
import faktory from "faktory-worker";

export const dynamic = "force-dynamic";

async function getCookieData() {
  const cookieData = cookies().get("organizationId");
  return cookieData ? cookieData.value : null;
}

export async function GET(req) {
  try {

    const cookieData = await getCookieData();
    const organizationId = Number(cookieData) ?? 0;

    const id = req.nextUrl.searchParams.get("id");

    const org = await prisma.organization.findFirst({
      where: {
        id: organizationId
      }
    });

    const order = await prisma.order.findFirst({
      where: { id,
        organization_id: organizationId 
      },
      include: {
        order_items: true,
        contact: true,
      }
    });

    await prisma.order.update({
      where: { id },
      data: {
        status: "Preparing"
      }
    });

    order.order_items.map(async (item) => {

      await prisma.orderItem.update({
        where: { id: item.id },
        data: {
          status: "Preparing"
        }
      });

    })

    const response = await fetch(`${process.env.SHIPPING_API}/api/delivery-init`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deliveryId: order.shipping_id }),
    });
    const data = await response.json();

    const client = await faktory.connect({
      url: process.env.FAKTORY_URL  || ""
    });
    
    await client.push({
      jobtype: 'SendAcceptOrderNotification',
      args: [{ org, order }],
      queue: 'default', // or specify another queue
      at: new Date(Date.now())
    });
  
    await client.close();


    return NextResponse.json({ status: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}
