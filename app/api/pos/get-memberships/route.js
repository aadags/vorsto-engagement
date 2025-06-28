import { NextResponse } from 'next/server';
import prisma from '@/db/prisma';

export async function POST(req) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'Missing organizationId' }, { status: 400 });
    }

    const plans = await prisma.membershipPlan.findMany({
      where: {
        is_active: true,
        organization_id: id,
      },
      select: {
        id: true,
        name: true,
        duration_days: true,
        price: true,
      },
      orderBy: {
        created_at: 'asc',
      },
    });

    return NextResponse.json(plans);
  } catch (err) {
    console.error('[POST /api/memberships]', err);
    return NextResponse.json({ error: 'Failed to fetch membership plans' }, { status: 500 });
  }
}
