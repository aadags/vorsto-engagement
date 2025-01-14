"use server";
import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import { AESCrypto } from "@/services/aes";

export async function POST(req) {
  try {
    const organizationId = Number(req.cookies.get("organizationId").value) ?? 0;

    const body = await req.json();
    const { email, password, server } = body;
    
    const textToEncrypt = JSON.stringify({ email, password, server });
    const aesCrypto = new AESCrypto(process.env.AESKEY || "");
    const { encryptedData, iv } = aesCrypto.encrypt(textToEncrypt);

    await prisma.organization.update({
      data: {
        support_email: email,
        support_email_connection: JSON.stringify({ id: encryptedData, data: iv })
      },
      where: {
        id: organizationId,
      },
    });

    
    return NextResponse.json({ message: "email attached" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to attach mail" },
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
