import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import { cookies } from "next/headers";
import axios from 'axios';
import { jwt } from 'twilio';

const { ClientCapability } = jwt;

export const dynamic = "force-dynamic";

async function getCookieData() {
  const cookieData = cookies().get("userId");
  return cookieData ? cookieData.value : null;
}

export async function GET(req) {
  try {
    const cookieData = await getCookieData();
    const userId = Number(cookieData) ?? 0;

    const capability = new ClientCapability({
      accountSid: process.env.TWILIO_ACCOUNT_SID,
      authToken: process.env.TWILIO_AUTH_TOKEN,
    });
  
    capability.addScope(new ClientCapability.IncomingClientScope(userId));
  
    const token = capability.toJwt();

    return NextResponse.json({ token, userId });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}
