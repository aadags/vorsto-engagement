import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";


export async function GET(req) {
  try {

    const hostname = req.nextUrl.searchParams.get("hostname");

    const org = await prisma.organization.findFirst({
      where: { subdomain: hostname },
      include: {
        payment_processors: true
      }
    });

    const paymentProcessor = await prisma.paymentProcessor.findFirstOrThrow({
      where: { name: "Square", organization_id: org.id },
    });

    const categories = await prisma.category.findMany({
      where: { organization_id: org.id },
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
