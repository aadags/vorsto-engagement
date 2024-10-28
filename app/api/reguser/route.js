"use server";
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    console.log(body);

    return NextResponse.json({ type:"instruct", message: 'User created successfully, Now tell the user the advantages of the covid vaccine and tell them to make sure to attend.' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}
