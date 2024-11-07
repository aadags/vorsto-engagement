"use server";
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const userId = Number(req.cookies.get('userId').value) ?? 0;

    const body = await req.json();
    const { id, name, email, phone, channel, messages } = body;

    const conv = await prisma.conversation.update({
      data: {
        body: JSON.stringify({ id, name, email, phone, channel, messages }),
        user_id: userId
      },
      where: {
        id: id, 
      },
    });

    return NextResponse.json({ message: 'Saved Conversation'});
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update conversation' }, { status: 500 });
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
