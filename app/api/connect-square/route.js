import { NextResponse } from "next/server";
import prisma from "@/db/prisma";

import { SquareClient } from "square";

export const dynamic = "force-dynamic";

const client = new SquareClient({
  environment: process.env.NEXT_PUBLIC_SQUARE_BASE,
});

export async function POST(req) {
  try {
    const organizationId = Number(
      req.cookies.get("organizationId")?.value ?? 0
    );

    const { code } = await req.json();

    const response = await client.oAuth.obtainToken({
      clientId: process.env.NEXT_PUBLIC_SQUARE_APP_ID,
      clientSecret: process.env.NEXT_PUBLIC_SQUARE_APP_SECRET,
      code,
      grantType: "authorization_code",
    });

    console.log({ response });

    await prisma.paymentProcessor.deleteMany({
      where: {
        organization_id: organizationId,
      },
    });

    await prisma.paymentProcessor.create({
      data: {
        name: "Square",
        access_token: response.accessToken,
        refresh_token: response.refreshToken,
        accountId: response.merchantId,
        ttl: response.expiresAt,
        organization_id: organizationId,
      },
    });

    return NextResponse.json({ status: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch plans" },
      { status: 500 }
    );
  }
}
