"use server";
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const body = await req.json();
    const { conversationId } = body;

    const orgId = Number(req.cookies.get('organizationId').value) ?? 0;
    const userId = Number(req.cookies.get('userId').value) ?? 0;

    const chat = await prisma.conversation.findFirst({
      where: { id: conversationId, organization_id: orgId },
    });

    const user = await prisma.user.findFirst({
      where: { id: userId, organization_id: orgId },
    });

    return NextResponse.json({ ...chat, user });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update bot and functions' }, { status: 500 });
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
