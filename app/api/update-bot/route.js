"use server";
import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import RedisHandler from "@/redis/redisHandler";

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      id,
      name,
      systemBio,
      model,
      hook,
      key,
      outputType,
      outputParameter,
      functions,
    } = body;

    const bot = await prisma.bot.update({
      data: {
        name,
        system_bio: systemBio,
        model,
        api_hook: hook,
        key,
        output_type: outputType,
        output_parameters: JSON.stringify(outputParameter),
      },
      where: {
        id: id,
      },
    });

    await prisma.tool.deleteMany({
      where: {
        bot_id: id,
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

    const redisHandler = new RedisHandler(id);
    await redisHandler.invalidateCacheValue();

    return NextResponse.json({
      message: "Bot and tools updated functions",
      data: bot,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update bot and functions" },
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
