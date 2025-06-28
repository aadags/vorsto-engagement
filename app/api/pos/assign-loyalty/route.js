import { NextResponse } from 'next/server';
import prisma from '@/db/prisma';

export async function POST(req) {
  try {
    const { name, email, barcode, membershipPlanId, id } = await req.json();

    if (!name || !email || !barcode) {
      return NextResponse.json({ error: 'Missing name, email, or barcode' }, { status: 400 });
    }

    // 1. Find or create contact
    let contact = await prisma.contact.findFirst({ where: { email } });

    if (!contact) {
      contact = await prisma.contact.create({
        data: {
          name,
          email,
          phone: "",
          organization_id: id, // You can make this dynamic
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

    // 3. Handle membership plan logic
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

    // 4. Upsert loyalty account
    const loyaltyAccount = await prisma.loyaltyAccount.upsert({
      where: {
        contact_id: contact.id,
      },
      create: {
        contact_id: contact.id,
        loyalty_program_id: loyaltyProgram.id,
        barcode,
        points: 0,
        membership_plan_id: membershipPlanIdToUse,
        membership_expires: membershipExpires,
      },
      update: {
        barcode,
        membership_plan_id: membershipPlanIdToUse,
        membership_expires: membershipExpires,
      },
      include: {
        contact: true,
        membership_plan: true,
        loyalty_program: true,
      },
    });

    return NextResponse.json({
      success: true,
      loyaltyAccount,
    });

  } catch (err) {
    console.error('[assign-loyalty]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
