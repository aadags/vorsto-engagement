"use server";
import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import faktory from "faktory-worker";

export async function POST(req) {
  try {
    const body = await req.json();

    console.log({ body });

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to receive" }, { status: 500 });
  }
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  console.log(mode, token, challenge);

  if (mode === "subscribe" && token === "vorsto2024-11-12") {
    console.log("Webhook verified successfully!");
    return new NextResponse(challenge, { status: 200 });
  } else {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
}
