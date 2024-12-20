"use server";
import { NextResponse } from "next/server";
import axios from "axios";
import prisma from "@/db/prisma";
import faktory from "faktory-worker";

export async function POST(req) {
  try {
    const body = await req.json();
    let { user_id } = body;

    const org = await prisma.organization.findFirst({
      where: {
        ig_user_id: user_id,
      },
    });

    const responseToken = await axios.get(
      `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${org.ig_token}`
    );

    const { access_token: llt, expires_in } = responseToken.data;

    const ttr = expires_in - 259200;

    await prisma.organization.update({
      data: {
        ig_token: llt,
      },
      where: {
        id: org.id,
      },
    });

    const client = await faktory.connect({
      url: process.env.FAKTORY_URL || "",
    });

    await client.push({
      jobtype: "RenewInstagramToken",
      args: [{ user_id }],
      queue: "default", // or specify another queue
      at: new Date(Date.now() + ttr),
    });

    await client.close();

    return NextResponse.json({
      message: "IG Account connecyed successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create IG Account" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}

export async function PUT() {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}
