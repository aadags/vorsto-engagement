"use server";
import { NextResponse } from "next/server";
import prisma from "@/db/prisma";

export async function POST(req) {
  try {
    const { product } = await req.json();
    const organizationId = Number(req.cookies.get("organizationId").value) ?? 0;

    const agent = await prisma.agent.create({
      data: {
        name: product.title,
        category: product.author_name,
        system_bio: product.desc.replace(/\bis\b/g, "you are"),
        human_takeover: true,
        model: "vorsto-xa-2",
        output_type: "text",
        output_parameters: JSON.stringify([]),
        organization_id: organizationId
      }
    });

    // for (const func of functions) {
    //   const { name, description, api, parameterConfig } = func;

    //   await prisma.tool.create({
    //     data: {
    //       name,
    //       description,
    //       api,
    //       parameters: JSON.stringify(parameterConfig),
    //       agent_id: bot.id, // Associate the tool with the updated bot
    //     },
    //   });
    // }

    return NextResponse.json({
      status: true,
      data: agent,
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
