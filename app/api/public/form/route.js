import { NextResponse } from "next/server";
import prisma from "@/db/prisma";

export const dynamic = "force-dynamic";

const setCorsHeaders = (response) => {
  response.headers.set("Access-Control-Allow-Origin", "*"); // Allow all origins (change as needed)
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return response;
};

export async function GET(req) {
  try {
    const id = req.nextUrl.searchParams.get("formId");

    const form = await prisma.form.findFirst({
      where: { id },
      include: {
        organization: true
      }
    });

    let response = NextResponse.json({ form });
    return setCorsHeaders(response);
  } catch (error) {
    console.error(error);
    let errorResponse = NextResponse.json(
      { error: "Failed to fetch form" },
      { status: 500 }
    );
    return setCorsHeaders(errorResponse);
  }
}

export async function POST(req) {
  try {
    const body = await req.json(); // Parse the JSON body
    const { form } = body; // Extract the 'form' field

    if (!form) {
      return NextResponse.json(
        { error: "'form' field is required" },
        { status: 400 }
      );
    }

    const id = req.nextUrl.searchParams.get("formId");

    // Here, you can process the form, for example, saving it to the database
    const newForm = await prisma.formResponse.create({
      data: {
        data: form,
        form_id: id
      },
    });

    let response = NextResponse.json({ newForm });
    return setCorsHeaders(response);
  } catch (error) {
    console.error(error);
    let errorResponse = NextResponse.json(
      { error: "Failed to process form" },
      { status: 500 }
    );
    return setCorsHeaders(errorResponse);
  }
}

// Handle CORS preflight requests
export function OPTIONS() {
  return setCorsHeaders(new NextResponse(null, { status: 204 }));
}
