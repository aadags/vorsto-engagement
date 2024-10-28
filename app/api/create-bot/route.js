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
    const { name, systemBio } = body;
    const cookieData = await getCookieData()
    const userId = Number(cookieData) ?? 0;

    const bot = await prisma.bot.create({
      data: {
        name,
        system_bio: systemBio,
        model: "vorsto-xa-2",
        user_id: userId,
      },
    });

    return NextResponse.json({ message: 'Bot created successfully', data: bot });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create bot' }, { status: 500 });
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
