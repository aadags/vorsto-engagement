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

    const METABASE_SITE_URL = "http://137.184.227.109:3000";
    const METABASE_SECRET_KEY =
      "295f08b1c8cba99d9e61268d93ecc915739a0fad0435f2a8c420776d51fcc306";

    const payload = {
      resource: { dashboard: 2 },
      params: {
        organization: [organizationId],
      },
      exp: Math.round(Date.now() / 1000) + 10 * 60, // 10 minute expiration
    };
    const token = jwt.sign(payload, METABASE_SECRET_KEY);

    const iframeUrl =
      METABASE_SITE_URL +
      "/embed/dashboard/" +
      token +
      "#background=false&bordered=false&titled=false";

    return NextResponse.json({ iframeUrl });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch convos" },
      { status: 500 }
    );
  }
}
