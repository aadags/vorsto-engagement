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
    const { url, label } = body;
    const cookieData = await getCookieData()
    const userId = Number(cookieData) ?? 0;

    const ak = await prisma.datasource.create({
      data: {
        job: label,
        path: url,
        user_id: userId,
      },
    });

    return NextResponse.json({ message: 'source added successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to add source' }, { status: 500 });
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
