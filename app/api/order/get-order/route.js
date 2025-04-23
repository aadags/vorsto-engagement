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

    const id = req.nextUrl.searchParams.get("id");

    const order = await prisma.order.findFirst({
      where: { id,
        organization_id: organizationId 
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
        }
      }
    });

    const org = await prisma.organization.findFirst({
      where: { id: organizationId },
    });


    return NextResponse.json({ ...order, org });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}
