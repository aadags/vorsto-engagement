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
    const { ip } = body;
    const cookieData = await getCookieData()
    const userId = Number(cookieData) ?? 0;

    const whitelist = await prisma.whitelist.create({
      data: {
        ip_address: ip,
        user_id: userId,
      },
    });

    return NextResponse.json({ message: 'ip added successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to add ip' }, { status: 500 });
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
