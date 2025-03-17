"use server";
import { NextResponse } from "next/server";
import prisma from "@/db/prisma";

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, uid } = body;

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
