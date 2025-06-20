import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";


export async function GET(req) {
  try {

    const hostname = req.nextUrl.searchParams.get("hostname");

    const org = await prisma.organization.findFirst({
      where: { subdomain: hostname }
    });

    const paymentProcessor = await prisma.paymentProcessor.findFirst({
      where: { name: "VorstoPay", organization_id: org.id },
    });

    const categories = await prisma.category.findMany({
      where: { organization_id: org.id, active: true },
      orderBy: {
        arrangement: 'asc',
      },
      include: {
        products: {
          take: 1, // limit to 1 product
        },
      },
    });

    return NextResponse.json({ org, categories, paymentProcessor });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch org" },
      { status: 500 }
    );
  }
}
