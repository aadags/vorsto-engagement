// app/api/stores/[id]/route.js
"use server";

import { NextResponse } from "next/server";
import prisma from "@/db/prisma";

function cors(res) {
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return res;
}

export async function OPTIONS() {
  return cors(new NextResponse(null, { status: 204 }));
}

export async function GET(req, { params }) {
  try {
    const orgId = Number(params.id); // org ids are numeric (Review.organization_id Int?)
    if (!Number.isFinite(orgId)) {
      return cors(NextResponse.json({ error: "Invalid id" }, { status: 400 }));
    }

    // 1) Store + active/display products
    const org = await prisma.organization.findUnique({
      where: { id: orgId },
      include: {
        payment_processors: true
      }
    });

    if (!org) {
      return cors(NextResponse.json({ error: "Store not found" }, { status: 404 }));
    }

    return cors(NextResponse.json(org));
  } catch (err) {
    console.error("GET STORE ERROR:", err);
    return cors(
      NextResponse.json({ error: "Failed to fetch store" }, { status: 500 })
    );
  }
}
