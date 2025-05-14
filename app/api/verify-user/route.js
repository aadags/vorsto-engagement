"use server";
import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import faktory from "faktory-worker"

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, uid } = body;

    let user = await prisma.user.findUnique({
      where: { email: email },
    });

    let org = await prisma.organization.findUnique({
      where: { uid: uid },
    });


    if (!user) {

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

    const oscode = Number(req.cookies.get("code")?.value ?? 0);

    let code = 0;


    // if(oscode == 0)
    // {
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
    // }

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
