import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";


export async function POST(req) {
  try {

    const body = await req.json();
    const { id } = body;

    const paymentProcessor = await prisma.paymentProcessor.findFirst({
      where: { name: "VorstoPay", organization_id: id },
    });

    const categories = await prisma.category.findMany({
      where: { organization_id: id, active: true },
      orderBy: {
        arrangement: 'asc',
      }
    });

    return NextResponse.json({ categories, paymentProcessor });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch org" },
      { status: 500 }
    );
  }
}
