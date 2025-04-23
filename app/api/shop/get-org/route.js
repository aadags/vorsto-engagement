import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";


export async function GET(req) {
  try {

    const subdomain = req.nextUrl.searchParams.get("subdomain");

    const org = await prisma.organization.findFirst({
      where: { subdomain },
    });

    const categories = await prisma.category.findMany({
      where: { organization_id: org.id },
    });

    return NextResponse.json({ org, categories });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch org" },
      { status: 500 }
    );
  }
}
