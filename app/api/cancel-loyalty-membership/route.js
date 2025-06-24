// /app/api/cancel-loyalty-membership/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/db/prisma';

export async function POST(req) {
  const { contactId } = await req.json();
  if (!contactId) return NextResponse.json({ error: 'Missing contactId' }, { status: 400 });

  await prisma.loyaltyAccount.deleteMany({
    where: { contact_id: contactId },
  });

  return NextResponse.json({ success: true });
}
