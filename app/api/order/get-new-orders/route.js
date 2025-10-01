import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

async function getCookieData() {
  const cookieData = cookies().get("organizationId");
  return cookieData ? cookieData.value : null;
}

export async function GET(req) {
  try {
    const cookieData = await getCookieData();
    const organizationId = Number(cookieData) ?? 0;

    const orders = await prisma.order.findMany({
      where: {
        organization_id: organizationId,
        status: {
          notIn: ["In transit", "Cancelled", "Delivered"],
        },
        channel: {
          not: "in_person",
        },
      },
      include: {
        order_items: {
          include: {
            inventory: {
              include: {
                product: {
                  include:{
                    images: true
                  }
                }
              }
            }
          }
        },
        contact: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });
    

    return NextResponse.json(orders);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
