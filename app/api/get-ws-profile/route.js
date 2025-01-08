import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import { cookies } from "next/headers";
import axios from 'axios';

export const dynamic = "force-dynamic";

async function getCookieData() {
  const cookieData = cookies().get("organizationId");
  return cookieData ? cookieData.value : null;
}

export async function GET(req) {
  try {
    const cookieData = await getCookieData();
    const orgId = Number(cookieData) ?? 0;

    const org = await prisma.organization.findFirst({
      where: { id: orgId },
    });

    const url = `https://graph.facebook.com/v21.0/${org.waba_id}`;
    const params = {
      fields: 'id,name,phone_numbers'
    };

    const headers = {
      Authorization: `Bearer ${org.wa_token}`
    };

    const response = await axios.get(url, { headers, params });


    return NextResponse.json(response.data);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}
