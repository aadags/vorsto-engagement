import { NextResponse } from 'next/server';
import prisma from '@/db/prisma';

export async function POST(req) {
  const { contactId, cardCode } = await req.json();

  if (!contactId || !cardCode) {
    return NextResponse.json({ error: 'Missing contactId or cardCode' }, { status: 400 });
  }

  try {
    const result = await prisma.loyaltyAccount.updateMany({
      where: { contact_id: contactId },
      data: { card_code: cardCode },
    });

    return NextResponse.json({ success: true, updated: result.count });
  } catch (err) {
    console.error('Error updating card code', err);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
