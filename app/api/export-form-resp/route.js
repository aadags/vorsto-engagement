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
    const formId = req.nextUrl.searchParams.get("formId");

    const formExist = await prisma.form.count({
      where: {
        id: formId,
        organization_id: organizationId
      }
    });

    if(formExist < 1)
    {
      return NextResponse.json(
        { error: "Failed to fetch and export results" },
        { status: 500 }
      );
    }

    const forms = await prisma.formResponse.findMany({
      where: { form_id: formId },
      orderBy: { created_at: 'desc' }
    });

    const parsedForms = forms.map(form => {
      const parsedData = JSON.parse(form.data);
    
      // Ensure all values are properly formatted
      Object.keys(parsedData).forEach(key => {
        if (Array.isArray(parsedData[key])) {
          parsedData[key] = parsedData[key].join(", "); // Convert array to string
        }
      });
    
      return parsedData;
    });

    // Convert data into worksheet format
    const worksheet = utils.json_to_sheet(parsedForms);
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
      { error: "Failed to fetch and export forms" },
      { status: 500 }
    );
  }
}
