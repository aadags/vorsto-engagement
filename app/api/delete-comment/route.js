"use server";
import { NextResponse } from "next/server";
import prisma from "@/db/prisma";

export async function POST(req) {
  try {
    const organizationId = Number(req.cookies.get("organizationId").value) ?? 0;
    const userId = Number(req.cookies.get("userId").value) ?? 0;

    const body = await req.json();
    const { commentId } = body;

    const cmt = await prisma.comment.delete({
      where: {
        id: commentId,
        user_id: userId,
        organization_id: organizationId
      }
    });
    return NextResponse.json({ message: "Comment Deleted" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete comment" },
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
