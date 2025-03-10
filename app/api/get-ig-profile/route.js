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

    const org = await prisma.organization.findFirstOrThrow({
      where: { id: orgId },
    });

    const requestOptions = {
      method: "POST",
      url: `https://graph.instagram.com/v21.0/${org.ig_user_id}/subscribed_apps`,
      params: {
        subscribed_fields: "comments,live_comments,messages",
        access_token: org.ig_token
      }
    };
    
    axios(requestOptions)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });

    const params = {
      fields: 'name,account_type,username,profile_picture_url',
      access_token: org.ig_token
    };
    const responseUser = await axios.get(`https://graph.instagram.com/v21.0/me`, { params });


    return NextResponse.json(responseUser.data);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}
