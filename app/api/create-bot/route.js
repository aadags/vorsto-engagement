"use server";
import { NextResponse } from "next/server";
import prisma from "@/db/prisma";

export async function POST(req) {
  try {
    const body = await req.json();
    const organizationId = Number(
      req.cookies.get("organizationId")?.value ?? 0
    );

    const {
      name,
      humanTakeOver,
      systemBio,
      model,
      outputType,
      outputParameter,
      functions,
    } = body;

    const bot = await prisma.bot.create({
      data: {
        name,
        system_bio: systemBio,
        human_takeover: humanTakeOver,
        model,
        output_type: outputType,
        output_parameters: JSON.stringify(outputParameter),
        organization_id: organizationId,
      },
    });

    for (const func of functions) {
      const { name, description, api, parameterConfig } = func;

      await prisma.tool.create({
        data: {
          name,
          description,
          api,
          parameters: JSON.stringify(parameterConfig),
          bot_id: bot.id, // Associate the tool with the updated bot
        },
      });
    }

    // const redisHandler = new RedisHandler(id);
    // await redisHandler.invalidateCacheValue();

    return NextResponse.json({
      message: "Bot and tools created functions",
      data: bot,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create bot and functions" },
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
