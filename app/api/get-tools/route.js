"use server";
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const botId = searchParams.get('botId');

  try {
    
    const tools = await prisma.tool.findMany({
      where: { bot_id: botId },
    });

    const toolsWithParsedParameters = tools.map(tool => ({
      ...tool,
      parameters: tool.parameters ? JSON.parse(tool.parameters) : null,
    }));

    return NextResponse.json(toolsWithParsedParameters);

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch bot' }, { status: 500 });
  }
}
