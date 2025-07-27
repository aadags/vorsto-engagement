import { NextResponse } from "next/server";
import prisma from "@/db/prisma";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const body = await req.json();
    const { id } = body;

    const terminals = await prisma.terminal.findMany({
      where: {
        organization_id: id
      }
    });

    return NextResponse.json({ terminals });
  } catch (error) {
    console.error("Loyalty lookup error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
