import { NextResponse } from 'next/server';
import prisma from '@/db/prisma';

export async function POST(req) {
  try {
    const { name, email, barcode, membershipPlanId, id: organizationId } = await req.json();

    if (!name || !email || !barcode || !organizationId) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    // 1. Find or create contact
    let contact = await prisma.contact.findFirst({
      where: { email },
    });

    const isNewContact = !contact;

    if (!contact) {
      contact = await prisma.contact.create({
        data: {
          name,
          email,
          phone: '',
          organization_id: organizationId,
        },
      });
    }

    // 2. Get active loyalty program
    const loyaltyProgram = await prisma.loyaltyProgram.findFirst({
      where: {
        organization_id: contact.organization_id,
        is_active: true,
      },
    });

    if (!loyaltyProgram) {
      return NextResponse.json({ error: 'No active loyalty program found.' }, { status: 404 });
    }

    // 3. Determine applicable membership plan
    let selectedPlan = null;

    if (membershipPlanId) {
      selectedPlan = await prisma.membershipPlan.findFirst({
        where: {
          id: membershipPlanId,
          organization_id: contact.organization_id,
          is_active: true,
        },
      });

      if (!selectedPlan) {
        return NextResponse.json({ error: 'Invalid or inactive membership plan.' }, { status: 400 });
      }
    } else {
      selectedPlan = await prisma.membershipPlan.findFirst({
        where: {
          organization_id: contact.organization_id,
          is_active: true,
        },
        orderBy: { created_at: 'asc' },
      });
    }

    const membershipPlanIdToUse = selectedPlan?.id ?? null;
    const membershipExpires = selectedPlan
      ? new Date(Date.now() + selectedPlan.duration_days * 86400000)
      : null;

    // 4. Find existing loyalty account (if any)
    const existingAccount = await prisma.loyaltyAccount.findFirst({
      where: { contact_id: contact.id },
    });

    let loyaltyAccount;

    if (existingAccount) {
      // Update barcode + membership info
      loyaltyAccount = await prisma.loyaltyAccount.update({
        where: { id: existingAccount.id },
        data: {
          card_code: barcode,
          membership_plan_id: membershipPlanIdToUse,
          membership_expires: membershipExpires,
        },
        include: {
          contact: true,
          membership_plan: true,
          loyalty_program: true,
        },
      });
    } else {
      // Create new loyalty account
      loyaltyAccount = await prisma.loyaltyAccount.create({
        data: {
          contact_id: contact.id,
          loyalty_program_id: loyaltyProgram.id,
          card_code: barcode,
          points: 0,
          membership_plan_id: membershipPlanIdToUse,
          membership_expires: membershipExpires,
        },
        include: {
          contact: true,
          membership_plan: true,
          loyalty_program: true,
        },
      });
    }

    return NextResponse.json({
      success: true,
      newContact: isNewContact,
      loyaltyAccount,
    });

  } catch (err) {
    console.error('[assign-loyalty]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
