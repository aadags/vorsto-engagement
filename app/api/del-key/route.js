import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers'
import RedisHandler from '@/redis/redisHandler';

const prisma = new PrismaClient();

async function getCookieData() {
  const cookieData = cookies().get('userId');
  return cookieData ? cookieData.value : null;
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { id, code } = body;
    const cookieData = await getCookieData()
    const userId = Number(cookieData) ?? 0;

    const bot = await prisma.key.delete({
      where: { id, user_id: userId },
    });

    const redisHandler = new RedisHandler(code);
    await redisHandler.invalidateCacheValue(); 

    return NextResponse.json({ message: 'key deleted successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete key' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
}

export async function PUT() {
  return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
}
