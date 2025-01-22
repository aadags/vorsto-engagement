import { NextResponse } from "next/server";
import prisma from "@/db/prisma";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const entries = Object.fromEntries(formData.entries());
    const to = entries.To;

    console.log({ entries });

    const callSid = entries.CallSid;
    const callStatus = entries.CallStatus; // Status like "completed", "failed", etc.

    const org = await prisma.organization.findFirst({
      where: {
        call_center_number: to
      }
    });

    // Update call status in the database
    await prisma.call.update({
      where: { conferenceId: callSid, organization_id: org.id },
      data: { status: callStatus },
    });

    console.log(`Call ${callSid} updated with status: ${callStatus}`);
    return NextResponse.json({ message: "Call status updated" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update call status" }, { status: 500 });
  }
}
