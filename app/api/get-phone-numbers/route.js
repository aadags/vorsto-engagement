import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import twilio from "twilio";


export const dynamic = "force-dynamic";

async function getCookieData() {
  const cookieData = cookies().get("organizationId");
  return cookieData ? cookieData.value : null;
}

export async function GET(req) {
  try {
   
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = twilio(accountSid, authToken);

    const code = req.nextUrl.searchParams.get("code");
    const state = req.nextUrl.searchParams.get("state");
    const page = parseInt(req.nextUrl.searchParams.get("page")); // Default to page 1 if not provided
    const pageSize = parseInt(req.nextUrl.searchParams.get("per_page"));

    const locals = (state && state != "")? await client.availablePhoneNumbers(code).local.list({
      pageSize,
      page: page - 1,
      inRegion:  state
    }) : 
    await client.availablePhoneNumbers(code).local.list({
      pageSize,
      page: page - 1,
    });

    return NextResponse.json(locals);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch convos" },
      { status: 500 }
    );
  }
}
