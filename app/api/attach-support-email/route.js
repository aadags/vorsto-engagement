"use server";
import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import { AESCrypto } from "@/services/aes";
import { ImapFetcher } from "@/services/imap";
import faktory from "faktory-worker";

export async function POST(req) {
  try {
    const organizationId = Number(
      req.cookies.get("organizationId")?.value ?? 0
    );

    const body = await req.json();
    const { email, password, server } = body;

    const imapConfig = {
      imap: {
        user: email,
        password: password,
        host: server,
        port: 993,
        tls: true,
        authTimeout: 3000,
        tlsOptions: { rejectUnauthorized: false },
      },
    };

    const emailFetcher = new ImapFetcher(imapConfig);

    await emailFetcher.connect();

    const textToEncrypt = JSON.stringify({ email, password, server });
    const aesCrypto = new AESCrypto(process.env.AESKEY || "");
    const { encryptedData, iv } = aesCrypto.encrypt(textToEncrypt);

    await prisma.organization.update({
      data: {
        support_email: email,
        support_email_connection: JSON.stringify({
          id: encryptedData,
          data: iv,
        }),
      },
      where: {
        id: organizationId,
      },
    });

    const client = await faktory.connect({
      url: process.env.FAKTORY_URL || "",
    });

    await client.push({
      jobtype: "PollEmail",
      args: [{ email }],
      queue: "default", // or specify another queue
      at: new Date(Date.now() + 60000), // 2 minutes delay
    });

    await client.close();

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
