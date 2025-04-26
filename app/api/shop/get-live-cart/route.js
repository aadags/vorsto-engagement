import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";


export async function GET(req) {
  try {

    const uuid = req.nextUrl.searchParams.get("uuid");

    const cart = await prisma.cart.findFirst({
      where: {
        uuid
      },
      include: {
        cart_items: {
          include: {
            inventory: {
              include: {
                product: {
                  include: {
                    images: true
                  }
                }
              }
            }
          }
        }
      }
    })

    return NextResponse.json({ cart });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch org" },
      { status: 500 }
    );
  }
}
