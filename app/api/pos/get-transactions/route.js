// app/api/orders/route.ts
import { NextResponse } from "next/server";
import prisma from "@/db/prisma";

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      startDate,
      endDate,
      page = 1,
      pageSize = 20,
      id
    } = body;

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: "startDate and endDate are required" },
        { status: 400 }
      );
    }

    const start = new Date(`${startDate}T00:00:00`);
    const end = new Date(`${endDate}T23:59:59.999`);
    const skip = (page - 1) * pageSize;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: {
          organization_id: id,
          channel: "in_person",
          created_at: {
            gte: start,
            lte: end,
          },
        },
        orderBy: { created_at: "desc" },
        skip,
        take: pageSize,
        include: {
          order_items: {
            include: {
              inventory: true,
            },
          },
        },
      }),
      prisma.order.count({
        where: {
          created_at: {
            gte: start,
            lte: end,
          },
        },
      }),
    ]);

    return NextResponse.json({
      data: orders,
      page,
      totalPages: Math.ceil(total / pageSize),
      total,
    });
  } catch (error) {
    console.error("Order fetch error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
