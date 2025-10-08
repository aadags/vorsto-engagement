import { NextResponse } from "next/server";
import jwt from "jsonwebtoken"; // decode Apple ID token

export async function POST(req) {
  const data = await req.formData();
  console.log({ data })
  const id_token = data.get("id_token");
  const user = jwt.decode(id_token);

  // Example: use Firebase sign-in with custom token
  // or link to your user database
  const { email, sub: appleId } = user;

  return NextResponse.json({ email, appleId });
}
