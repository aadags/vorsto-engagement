"use server";
import { NextResponse } from "next/server";
import prisma from "@/db/prisma";

export async function GET(request) {
  const orgId = Number(request.cookies.get("organizationId")?.value ?? 0);

  try {
    let bot = await prisma.bot.findFirst({
      where: { organization_id: orgId },
    });

    if (!bot) {
      bot = await prisma.bot.create({
        data: {
          name: "Customer Engagement Bot",
          system_bio: "",
          model: "vorsto-xa-2",
          organization_id: orgId,
        },
      });
    }

    return NextResponse.json(bot);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch bot" }, { status: 500 });
  }
}
