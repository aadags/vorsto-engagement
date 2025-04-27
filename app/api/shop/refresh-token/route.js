import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import { cookies } from "next/headers";
import { SquareClient } from "square";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {

    const subdomain = req.nextUrl.searchParams.get("subdomain");

    const org = await prisma.organization.findFirst({
      where: { subdomain },
      include: {
        payment_processors: true
      }
    });
    
    const pp = await prisma.paymentProcessor.findFirstOrThrow({
      where: { name: "Square", organization_id: org.id },
    });

    const ttlDate = new Date(pp.ttl);
    const now = new Date();

    const diffInMs = now.getTime() - ttlDate.getTime();
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    if (diffInDays > 23) {
      return NextResponse.json({ status: "renewal skipped"});
    }

    const client = new SquareClient({
      token: pp.access_token,
      environment: process.env.NEXT_PUBLIC_SQUARE_BASE,
    });

    const response = await client.oAuth.obtainToken({
      clientId: process.env.NEXT_PUBLIC_SQUARE_APP_ID,
      clientSecret: process.env.NEXT_PUBLIC_SQUARE_APP_SECRET,
      refreshToken: pp.refresh_token,
      grantType: "refresh_token",
    });

    await prisma.paymentProcessor.update({
      where:{
        id: pp.id
      },
      data: {
        access_token: response.accessToken,
        refresh_token: response.refreshToken,
        ttl: response.expiresAt,
      },
    });

    // Return all active locations
    return NextResponse.json(response);

  } catch (error) {
    console.error('Server Error:', error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
