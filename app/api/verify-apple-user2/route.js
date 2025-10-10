"use server";
import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import faktory from "faktory-worker"

export async function POST(req) {
  try {
    const body = await req.json();
    let { name, email, uid } = body;

    if (email) {
      await prisma.appleLog.upsert({
        where: { apple_id: uid },
        update: {
          email,
          name: (name?.givenName && name?.familyName)
            ? `${name.givenName} ${name.familyName}`
            : undefined,
        },
        create: {
          apple_id: uid,
          email,
          name: (name?.givenName && name?.familyName)
            ? `${name.givenName} ${name.familyName}`
            : null,
        },
      });
    }

    // If no email, try to pull from AppleLog
    if (!email) {
      const savedLog = await prisma.appleLog.findUnique({
        where: { apple_id: uid },
      });
      if (savedLog?.email) {
        email = savedLog.email;
      }
    }

    let user = await prisma.user.findUnique({
      where: { apple_id: uid, is_deleted: false },
    });

    
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    let code = 0;


    if(!user.is_validated)
    {
      code = Math.floor(10000 + Math.random() * 90000).toString();
      const client = await faktory.connect({
        url: process.env.FAKTORY_URL  || ""
      });
      
      await client.push({
        jobtype: 'SendEmail',
        args: [{ email: user.email, code }],
        queue: 'default', // or specify another queue
        at: new Date(Date.now())
      });
    
      await client.close();
    }

    const response = NextResponse.json({
      message: "User verified successfully",
      data: user
    });
    response.cookies.set("userId", user.id, {
      maxAge: 365 * 24 * 60 * 60, // 1 year
      path: "/",
      httpOnly: true, // Make the cookie inaccessible to JavaScript
    });

    response.cookies.set("organizationId", user.organization_id, {
      maxAge: 365 * 24 * 60 * 60, // 1 year
      path: "/",
      httpOnly: true, // Make the cookie inaccessible to JavaScript
    });

    if(code > 0){
      response.cookies.set("code", code, {
        maxAge: 15 * 60, // 15 minutes
        path: "/",
        httpOnly: true, // Make the cookie inaccessible to JavaScript
      });
    }

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "There is no account by this user" },
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
