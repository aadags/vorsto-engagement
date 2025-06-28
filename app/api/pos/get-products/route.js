import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";


export async function POST(req) {
  try {

    const body = await req.json();
    const { id , categoryId} = body;


    const products = await prisma.product.findMany({
      where: { organization_id: id, category_id: categoryId, active: true },
      include:{
        inventories: {
          where: { active: true },
        },
      }
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch org" },
      { status: 500 }
    );
  }
}
