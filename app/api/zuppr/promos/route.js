import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import { verifyAccessToken } from "@/jwt/jwt"; // your jwt.js helpers

export async function GET(req) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyAccessToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const userId = decoded.sub; // ensure you store sub when issuing JWT

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
      include: {
        usages: {
          where: { customer_id: userId },
        },
      },
    });

    // Filter out promos that user exceeded usage
    const validPromos = promos.filter(p => {
      if (p.max_uses_per_user && p.usages.length >= p.max_uses_per_user) {
        return false;
      }
      return true;
    });

    return NextResponse.json(validPromos);
  } catch (err) {
    console.error("Failed to fetch promos:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
