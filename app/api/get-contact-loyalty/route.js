import { NextResponse } from 'next/server';
import prisma from '@/db/prisma';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const contactId = searchParams.get('contactId');

    if (!contactId) {
      return NextResponse.json({ error: 'Missing contactId' }, { status: 400 });
    }

    // Fetch contact + org ID
    const contact = await prisma.contact.findUnique({
      where: { id: contactId },
      include: { organization: true },
    });

    if (!contact) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
    }

    // Fetch or create a loyalty account
    let account = await prisma.loyaltyAccount.findFirst({
      where: { contact_id: contactId },
      include: {
        membership_plan: true,
      },
    });

    if (!account) {
      const program = await prisma.loyaltyProgram.findFirst({
        where: {
          organization_id: contact.organization_id,
          is_active: true,
        },
        orderBy: { created_at: 'asc' }, // fallback to first created
      });

      account = await prisma.loyaltyAccount.create({
        data: {
          contact_id: contactId,
          loyalty_program_id: program?.id ?? null,
        },
        include: { membership_plan: true },
      });
    }

    return NextResponse.json({
      planName: account.membership_plan?.name ?? null,
      points: account.points,
      card_code: account.card_code
    });
  } catch (err) {
    console.error('[get-contact-loyalty]', err);
    return NextResponse.json({ error: 'Failed to fetch or create loyalty account' }, { status: 500 });
  }
}
