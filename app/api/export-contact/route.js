import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import { cookies } from "next/headers";
import { utils, write } from "xlsx";

export const dynamic = "force-dynamic";

async function getCookieData() {
  const cookieData = cookies().get("organizationId");
  return cookieData ? cookieData.value : null;
}

export async function GET(req) {
  try {
    const cookieData = await getCookieData();
    const organizationId = Number(cookieData) ?? 0;

    const contacts = await prisma.conversation.findMany({
      distinct: ["name", "email", "phone", "username"], // Ensure uniqueness based on these fields
      select: {
        name: true,
        email: true,
        phone: true,
        username: true,
      },
      where: { organization_id: organizationId },
      orderBy: { created_at: "desc" },
    });

    // Convert data into worksheet format
    const worksheet = utils.json_to_sheet(contacts);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Data");

    // Generate the workbook as a binary buffer
    const buffer = write(workbook, { type: "buffer", bookType: "xlsx" });

    // Create a Response object with the buffer and appropriate headers
    return new Response(buffer, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": 'attachment; filename="contacts.xlsx"',
      },
    });
  } catch (error) {
    console.error("Error exporting data:", error);
    return NextResponse.json(
      { error: "Failed to fetch and export conversations" },
      { status: 500 }
    );
  }
}
