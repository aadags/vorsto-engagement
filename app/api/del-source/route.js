import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers'

const prisma = new PrismaClient();

async function getCookieData() {
  const cookieData = cookies().get('userId');
  return cookieData ? cookieData.value : null;
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { id } = body;
    const cookieData = await getCookieData()
    const userId = Number(cookieData) ?? 0;

    const bot = await prisma.datasource.delete({
      where: { id, user_id: userId },
    });

    return NextResponse.json({ message: 'source deleted successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete source' }, { status: 500 });
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
