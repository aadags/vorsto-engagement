"use server";
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const botId = searchParams.get('botId');
  const userId = Number(request.cookies.get('userId').value) ?? 0;

  try {
    const bot = await prisma.bot.findFirstOrThrow({
      where: { id: botId, user_id: userId },
    });
    return NextResponse.json(bot);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch bot' }, { status: 500 });
  }
}
