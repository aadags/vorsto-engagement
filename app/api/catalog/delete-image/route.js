"use server";
import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import cloudinary from '@/cloudinary/config';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia', // Use the correct API version
});


export async function POST(req) {
  try {
    const organizationId = Number(
      req.cookies.get("organizationId")?.value ?? 0
    );

    const body = await req.json();
    
    const { id, cloud_id } = body;

    const result = await cloudinary.uploader.destroy(cloud_id);

    if(id !== "0") {
      await prisma.image.delete({
        where: {
          id
        },
      });
    }


    return NextResponse.json({
      status: true, result
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to save product" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}

export async function PUT() {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}
