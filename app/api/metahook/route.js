"use server";
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import faktory from "faktory-worker"

const prisma = new PrismaClient();
export async function POST(req) {

  try {

    const body = await req.json();

    console.log({body});

    return NextResponse.json({ received: true }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to receive' }, { status: 500 });
  }
}