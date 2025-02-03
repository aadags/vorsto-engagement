import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export const dynamic = "force-dynamic";

async function getCookieData() {
  const cookieData = cookies().get("organizationId");
  return cookieData ? cookieData.value : null;
}

export async function GET(req) {
  try {
    const cookieData = await getCookieData();
    const organizationId = Number(cookieData) ?? 0;

    const { searchParams } = new URL(req.url);
    const contactId = searchParams.get('contactId');

    const METABASE_SITE_URL = "https://metabase.vorsto.io";
    const METABASE_SECRET_KEY = "d36207cfb10f32288abef0eeee7aa47b73c715b7257330eb21fedd7c2cec8090";

    const payload = {
      resource: { dashboard: 5 },
      params: {
        "contact": [contactId],
        "organization": [organizationId]
      },
      exp: Math.round(Date.now() / 1000) + 10 * 60, // 10 minute expiration
    };
    const token = jwt.sign(payload, METABASE_SECRET_KEY);

    const iframeUrl =
      METABASE_SITE_URL +
      "/embed/dashboard/" +
      token +
      "#background=false&bordered=false&titled=false";
    
    const contact = await prisma.contact.findFirst({
      where: {
        id: contactId,
        organization_id: organizationId
      }
    });

    return NextResponse.json({ name: contact.name, sentiment: contact.sentiment, iframeUrl });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch convos" },
      { status: 500 }
    );
  }
}
