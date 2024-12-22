"use server";
import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import axios from 'axios';

export async function POST(req) {
  try {
    const organizationId = Number(req.cookies.get("organizationId").value) ?? 0;

    const body = await req.json();
    const { code } = body;

    const response = await axios.get('https://graph.facebook.com/v21.0/oauth/access_token', {
      params: {
        client_id: `${process.env.META_CLIENT_ID}`,
        client_secret: `${process.env.META_CLIENT_SECRET}`,
        code: code,
      },
    });

    const bot = await prisma.organization.update({
      data: {
        wa_token: response.data.access_token
      },
      where: {
        id: organizationId,
      },
    });
    
    return NextResponse.json({ message: "org updated" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to save conversation" },
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
