import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers'
const prisma = new PrismaClient();

 
export const dynamic = 'force-dynamic';

async function getCookieData() {
  const cookieData = cookies().get('userId');
  return cookieData ? cookieData.value : null;
}

export async function GET(req) {
  try {
    const cookieData = await getCookieData()
    const userId = Number(cookieData) ?? 0;

    const whitelists = await prisma.whitelist.findMany({
      where: { user_id: userId },
    });
    return NextResponse.json(whitelists);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch whitelists' }, { status: 500 });
  }
}
