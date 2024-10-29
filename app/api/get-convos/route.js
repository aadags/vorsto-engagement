import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers'
const prisma = new PrismaClient();

 
export const dynamic = 'force-dynamic';

async function getCookieData() {
  const cookieData = cookies().get('organizationId');
  return cookieData ? cookieData.value : null;
}

export async function GET(req) {
  try {
    const cookieData = await getCookieData()
    const organizationId = Number(cookieData) ?? 0;

    const page = parseInt(req.nextUrl.searchParams.get('page')); // Default to page 1 if not provided
    const pageSize = parseInt(req.nextUrl.searchParams.get('per_page'));

    const conversations = await prisma.conversation.findMany({
      where: { organization_id: organizationId, is_lead: true },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    const total = prisma.conversation.count();

    return NextResponse.json({ data: conversations, count: total});
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch convos' }, { status: 500 });
  }
}
