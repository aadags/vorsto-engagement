"use server";
import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import {
  sendEngagementTemplateMessage,
  sendTextMessage,
  sendCheckInTemplateMessage,
} from "@/services/whatsapp";
import { sendDirectMessage } from "@/services/instagram";
import faktory from "faktory-worker";

export async function POST(req) {
  try {
    const userId = Number(req.cookies.get("userId")?.value ?? 0);
    const orgId = Number(req.cookies.get("organizationId")?.value ?? 0);

    const body = await req.json();
    const { id, name, email, phone, channel, messages, newMessage } = body;

    const chat = await prisma.conversation.findFirst({
      where: { id: id, organization_id: orgId },
    });

    const org = await prisma.organization.findFirst({
      where: { id: orgId },
    });

    const user = await prisma.user.findUniqueOrThrow({
      where: { id: userId },
    });

    if (chat.channel === "whatsapp") {
      const { content } = newMessage;
      if (chat.user_id == null) {
        await sendEngagementTemplateMessage(
          phone,
          user.name,
          org.wa_phone_id,
          org.wa_token
        );
        await sendCheckInTemplateMessage(
          phone,
          content,
          org.wa_phone_id,
          org.wa_token
        );
      } else {
        const now = new Date(); // Current time in GMT
        const updatedAt = new Date(chat.updated_at); // Parse created_at to Date object

        // Calculate the difference in hours
        const differenceInHours = (now - updatedAt) / (1000 * 60 * 60); // Convert ms to hours

        if (differenceInHours < 24) {
          await sendTextMessage(phone, content, org.wa_phone_id, org.wa_token);
        } else {
          await sendCheckInTemplateMessage(
            phone,
            content,
            org.wa_phone_id,
            org.wa_token
          );
        }
      }
    }

    if (chat.channel === "instagram") {
      const { content } = newMessage;
      if (chat.user_id == null) {
        await sendDirectMessage(
          org.ig_user_id,
          org.ig_token,
          chat.meta_id,
          `Agent ${user.name} has joined your chat.`
        );
        await sendDirectMessage(
          org.ig_user_id,
          org.ig_token,
          chat.meta_id,
          content
        );
      } else {
        await sendDirectMessage(
          org.ig_user_id,
          org.ig_token,
          chat.meta_id,
          content
        );
      }
    }

    if (chat.channel === "email") {
      const { content } = newMessage;

      const client = await faktory.connect({
        url: process.env.FAKTORY_URL || "",
      });

      await client.push({
        jobtype: "SendConversationEmail",
        args: [
          {
            body: content,
            name: user.name || org.name,
            subject: "Re: " + chat.subject,
            to: chat.email,
            replyTo: org.support_email,
          },
        ],
        queue: "default", // or specify another queue
        at: new Date(Date.now()), // 2 minutes delay
      });

      await client.close();
    }

    const conv = await prisma.conversation.update({
      data: {
        body: JSON.stringify({ id, name, email, phone, channel, messages }),
        user_id: userId,
      },
      where: {
        id: id,
      },
    });

    return NextResponse.json({ message: "Saved Conversation" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update conversation" },
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
