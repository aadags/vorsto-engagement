"use server";
import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import { auth, createUserWithEmailAndPassword } from "@/firebaseConfig/FirebaseClient";

export async function POST(req) {
  try {
    const organizationId = Number(
      req.cookies.get("organizationId")?.value ?? 0
    );

    const body = await req.json();
    const { name, email, password, role } = body;

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        role_id: role == 0 ? null : Number(role),
        organization_id: organizationId,
      },
    });
    return NextResponse.json({ message: "Saved User" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to save conversation" },
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
