import { NextResponse } from "next/server";
import prisma from "@/db/prisma";

export async function GET(req) {
  try {
    
    // Load promos
    const promos = await prisma.promo.findMany({
      where: {
        active: true,
        OR: [
          { starts_at: null },
          { starts_at: { lte: new Date() } },
        ],
        OR: [
          { ends_at: null },
          { ends_at: { gte: new Date() } },
        ],
      },
      orderBy: { created_at: "desc" },
    });

    return NextResponse.json(promos);
  } catch (err) {
    console.error("Failed to fetch promos:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
