// middleware.js
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET);

export async function middleware(req) {

    const { pathname } = req.nextUrl;

  // Skip auth for login/refresh endpoints
  if (pathname.startsWith("/api/zuppr/promos-guest") || pathname.startsWith("/api/zuppr/get-deals") || pathname.startsWith("/api/zuppr/apple-login") || pathname.startsWith("/api/zuppr/google-login") || pathname.startsWith("/api/zuppr/send-code") || pathname.startsWith("/api/zuppr/verify-code") || pathname.startsWith("/api/zuppr/refresh-token") ) {
    return NextResponse.next();
  }
  
  const token = req.headers.get("authorization")?.replace("Bearer ", "");

  if (!token) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const { payload } = await jwtVerify(token, secret);
    return NextResponse.next();
  } catch (err) {
    console.error("JWT error", err);
    return new Response("Unauthorized", { status: 401 });
  }
}

export const config = {
  matcher: ["/api/zuppr/:path*"],
};