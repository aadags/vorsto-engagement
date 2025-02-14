"use server";
import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const organizationId = Number(req.cookies.get("organizationId").value) ?? 0;
    const userId = Number(req.cookies.get("userId").value) ?? 0;

    const body = await req.json();

    const org = await prisma.organization.findFirst({
      where: {
        id: organizationId
      }
    });

    const user = await prisma.user.findFirst({
      where: {
        id: userId
      }
    });


    // Configure the email transport
    const transporter = nodemailer.createTransport({
      host: "smtp.zoho.com",
      port: 587,
      secure: false, // true for port 465, false for other ports
      auth: {
        user: "mailmaster@vorsto.io",
        pass: "Password77%%",
      },
    });

    // Email content
    const mailOptions = {
      from: `${user.name} <mailmaster@vorsto.io>`,
      to: "ayoola@vorsto.io", // Recipient's email
      subject: "Voice AI Request",
      text: `${user.name} with email ${user.email} of organization ${org.uid} has requested for voice ai.`,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: "Email sent" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to send email" },
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
