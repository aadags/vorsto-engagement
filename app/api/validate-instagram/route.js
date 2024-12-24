"use server";
import { NextResponse } from "next/server";
import axios from "axios";
import prisma from "@/db/prisma";
import faktory from "faktory-worker";

export async function POST(req) {
  try {
    const orgId = Number(req.cookies.get("organizationId").value) ?? 0;
    const body = await req.json();
    const { code } = body;

    const formData = new URLSearchParams();
    formData.append("client_id", process.env.INSTAGRAM_CLIENT_ID);
    formData.append("client_secret", process.env.INSTAGRAM_CLIENT_SECRET);
    formData.append("grant_type", "authorization_code");
    formData.append("redirect_uri", "https://engage.vorsto.io/channel/instagram");
    formData.append("code", code);
  
    const response = await axios.post(
      "https://api.instagram.com/oauth/access_token",
      formData.toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    console.log(response.data);

    const { access_token } = response.data;

    const responseToken = await axios.get(
      `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${process.env.INSTAGRAM_CLIENT_SECRET}&access_token=${access_token}`
    );

    const { access_token: llt, expires_in } = responseToken.data;

    const params = {
      fields: 'user_id,username',
      access_token: llt
    };
    const responseUser = await axios.get(`https://graph.instagram.com/v21.0/me`, { params });

    const userId = responseUser.data.user_id;

    const ttr = expires_in - 259200;

    const org = await prisma.organization.update({
      data: {
        ig_token: llt,
        ig_user_id: String(userId),
      },
      where: {
        id: orgId,
      },
    });

    const client = await faktory.connect({
      url: process.env.FAKTORY_URL  || ""
    });
    
    await client.push({
      jobtype: 'RenewInstagramToken',
      args: [{ userId }],
      queue: 'default', // or specify another queue
      at: new Date(Date.now() + ttr) 
    });
  
    await client.close();

    return NextResponse.json({
      message: "IG Account connecyed successfully"
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
