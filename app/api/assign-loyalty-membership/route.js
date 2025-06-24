import { NextResponse } from 'next/server';
import prisma from '@/db/prisma';

export async function POST(req) {
  try {
    const { contactId, membershipPlanId } = await req.json();

    if (!contactId || !membershipPlanId) {
      return NextResponse.json({ error: 'Missing contactId or membershipPlanId' }, { status: 400 });
    }

    const contact = await prisma.contact.findUnique({
      where: { id: contactId },
      include: { organization: true },
    });

    if (!contact) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
    }

    const plan = await prisma.membershipPlan.findFirst({
      where: {
        id: membershipPlanId,
        organization_id: contact.organization_id,
        is_active: true,
      },
    });

    if (!plan) {
      return NextResponse.json({ error: 'Membership plan not found or inactive' }, { status: 404 });
    }

    const loyaltyProgram = await prisma.loyaltyProgram.findFirst({
      where: {
        organization_id: contact.organization_id,
        is_active: true,
      },
    });

    if (!loyaltyProgram) {
      return NextResponse.json({ error: 'No active loyalty program for organization' }, { status: 404 });
    }

    const expiresAt = new Date(Date.now() + plan.duration_days * 86400000);

    // Check if loyalty account already exists
    const existingAccount = await prisma.loyaltyAccount.findFirst({
      where: {
        contact_id: contact.id,
      },
    });

    let account;

    if (existingAccount) {
      // Update existing account with membership plan
      account = await prisma.loyaltyAccount.update({
        where: { id: existingAccount.id },
        data: {
          membership_plan_id: plan.id,
          membership_expires: expiresAt,
          loyalty_program_id: loyaltyProgram.id, // ensure it's set
        },
        include: { membership_plan: true },
      });
    } else {
      // Create new loyalty account
      account = await prisma.loyaltyAccount.create({
        data: {
          contact_id: contact.id,
          membership_plan_id: plan.id,
          loyalty_program_id: loyaltyProgram.id,
          membership_expires: expiresAt,
          points: 0,
        },
        include: { membership_plan: true },
      });
    }

    return NextResponse.json({
      planName: account.membership_plan?.name,
      points: account.points,
    });

  } catch (err) {
    console.error('[assign-loyalty-membership]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
