"use server";
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const body = await req.json();
    const { email } = body;

    let user = await prisma.user.findUnique({
      where: { email: email },
    });

    const response = NextResponse.json({ message: 'User verified successfully', data: user });
    response.cookies.set('userId', user.id, {
      maxAge: 365 * 24 * 60 * 60, // 1 day
      path: '/',
      httpOnly: true, // Make the cookie inaccessible to JavaScript
    });

    return response;

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
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
