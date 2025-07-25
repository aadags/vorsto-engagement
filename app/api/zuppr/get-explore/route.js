// app/api/verify-code/route.ts
"use server";

import { NextResponse } from "next/server";
import Redis from "ioredis";
import prisma from "@/db/prisma";

const redis = new Redis(process.env.REDIS);

export async function OPTIONS() {
  // Preflight handler
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",                   
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

export async function POST(req) {
  try {

    const { lat, lng } = await req.json();
    if (!lat || !lng) {
      return NextResponse.json(
        { error: "Lat and Lng are required" },
        { status: 400 }
      );
    }

    const orgs = await getNearbyStores(lat, lng, 15);
    const merged = orgs.flatMap(p => Array.isArray(p.tags) ? p.tags : []);
    const uniqueTags = Array.from(new Set(merged));

    

    return NextResponse.json({
      success: true,
      orgs,
      tags: uniqueTags
    });
  } catch (err) {
    console.error("GET EXPLORE ERROR:", err);
    return NextResponse.json(
      { error: "Failed to get explore " },
      { status: 500 }
    );
  }
}

const getNearbyStores = async (lat, lng, radiusKm = 5) => {
  const orgs = await prisma.$queryRaw`
    SELECT *, (
      6371 * acos(
        cos(radians(${lat}))
        * cos(radians(address_lat))
        * cos(radians(address_long) - radians(${lng}))
        + sin(radians(${lat}))
        * sin(radians(address_lat))
      )
    ) AS distance_km
    FROM organizations
    WHERE address_lat IS NOT NULL AND address_long IS NOT NULL
    HAVING distance_km < ${radiusKm}
    ORDER BY distance_km ASC
    LIMIT 50;
  `;

  return orgs;
};
