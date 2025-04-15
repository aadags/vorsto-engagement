"use server";
import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import faktory from "faktory-worker"

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, uid, recaptchaToken } = body;

    // Verify reCAPTCHA token with Google
    const recaptchaResponse = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: "6LcBq9QqAAAAANdgElkWhBLQhlkPLGWCrU31TUn2", // Your secret key from Google
        response: recaptchaToken,
      }),
    });

    const recaptchaData = await recaptchaResponse.json();
    if (!recaptchaData.success) {
      return NextResponse.json({ message: "reCAPTCHA verification failed" }, { status: 500 });
    }

    let user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {

      let org = await prisma.organization.findUnique({
        where: { uid: uid },
      });

      if(!org) {

        org = await prisma.organization.create({
          data: {
            name: 'My Company',
            uid,
          },
        });

      }

      user = await prisma.user.create({
        data: {
          name,
          email,
          organization_id: org.id,
        },
      });
    }

    const code = Math.floor(10000 + Math.random() * 90000).toString();

    if(!user.is_validated)
    {
      const client = await faktory.connect({
        url: process.env.FAKTORY_URL  || ""
      });
      
      await client.push({
        jobtype: 'SendEmail',
        args: [{ name: user.name, email: user.email, code }],
        queue: 'default', // or specify another queue
        at: new Date(Date.now()) // 2 minutes delay
      });
    
      await client.close();
    }

    const response = NextResponse.json({
      message: "User verified successfully",
      data: user,
    });
    response.cookies.set("userId", user.id, {
      maxAge: 365 * 24 * 60 * 60, // 1 day
      path: "/",
      httpOnly: true, // Make the cookie inaccessible to JavaScript
    });

    response.cookies.set("organizationId", user.organization_id, {
      maxAge: 365 * 24 * 60 * 60, // 1 day
      path: "/",
      httpOnly: true, // Make the cookie inaccessible to JavaScript
    });

    response.cookies.set("code", code, {
      maxAge: 15 * 60, // 5 minutes
      path: "/",
      httpOnly: true, // Make the cookie inaccessible to JavaScript
    });

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}

export async function PUT() {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}
