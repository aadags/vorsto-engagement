import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import { cookies } from "next/headers";
import { subDays, startOfDay } from 'date-fns';

export const dynamic = "force-dynamic";

async function getCookieData() {
  const cookieData = cookies().get("organizationId");
  return cookieData ? cookieData.value : null;
}

export async function GET(req) {
  try {
    const cookieData = await getCookieData();
    const organizationId = Number(cookieData) ?? 0;

    const today = new Date();
    const startDate = subDays(startOfDay(today), 9); // Start from 10 days ago, including today

    const results = await prisma.conversation.groupBy({
      by: ['created_at'],
      where: {
        created_at: {
          gte: startDate,
        },
        organization_id: organizationId
      },
      _count: {
        id: true,
      },
      orderBy: {
        created_at: 'asc',
      },
    });

    const results2 = await prisma.conversation.groupBy({
      by: ['created_at'],
      where: {
        created_at: {
          gte: startDate,
        },
        organization_id: organizationId,
        is_lead: true
      },
      _count: {
        id: true,
      },
      orderBy: {
        created_at: 'asc',
      },
    });

    const closed = await prisma.conversation.groupBy({
      by: ['updated_at'],
      where: {
        updated_at: {
          gte: startDate,
        },
        organization_id: organizationId,
        is_end: true
      },
      _count: {
        id: true,
      },
      orderBy: {
        updated_at: 'asc',
      },
    });

    const ongoing = await prisma.conversation.groupBy({
      by: ['updated_at'],
      where: {
        updated_at: {
          gte: startDate,
        },
        organization_id: organizationId,
        is_end: false
      },
      _count: {
        id: true,
      },
      orderBy: {
        updated_at: 'asc',
      },
    });

    // Initialize an array for the last 10 days, with all counts set to 0
    const countsByDay = Array.from({ length: 10 }, (_, i) => {
      const day = subDays(today, 9 - i).toISOString().split('T')[0];
      return { day, count: 0 };
    });

    const countsByDay2 = Array.from({ length: 10 }, (_, i) => {
      const day = subDays(today, 9 - i).toISOString().split('T')[0];
      return { day, count: 0 };
    });

    const countsByDay3 = Array.from({ length: 10 }, (_, i) => {
      const day = subDays(today, 9 - i).toISOString().split('T')[0];
      return { day, count: 0 };
    });

    const countsByDay4 = Array.from({ length: 10 }, (_, i) => {
      const day = subDays(today, 9 - i).toISOString().split('T')[0];
      return { day, count: 0 };
    });

    // Populate the counts for each day based on query results
    results.forEach(result => {
      const day = result.created_at.toISOString().split('T')[0];
      const dayIndex = countsByDay.findIndex(d => d.day === day);
      if (dayIndex > -1) {
        countsByDay[dayIndex].count = result._count.id;
      }
    });

    results2.forEach(result => {
      const day = result.created_at.toISOString().split('T')[0];
      const dayIndex = countsByDay2.findIndex(d => d.day === day);
      if (dayIndex > -1) {
        countsByDay2[dayIndex].count = result._count.id;
      }
    });

    closed.forEach(result => {
      const day = result.updated_at.toISOString().split('T')[0];
      const dayIndex = countsByDay3.findIndex(d => d.day === day);
      if (dayIndex > -1) {
        countsByDay3[dayIndex].count = result._count.id;
      }
    });

    ongoing.forEach(result => {
      const day = result.updated_at.toISOString().split('T')[0];
      const dayIndex = countsByDay4.findIndex(d => d.day === day);
      if (dayIndex > -1) {
        countsByDay4[dayIndex].count = result._count.id;
      }
    });

    // Extract only the counts
    const arr = countsByDay.map(d => d.count);
    const arr2 = countsByDay2.map(d => d.count);
    const arr3 = countsByDay3.map(d => d.count);
    const arr4 = countsByDay4.map(d => d.count);

    return NextResponse.json({ allConv: arr, leads: arr2, closed: arr3, ongoing: arr4 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch convos" },
      { status: 500 }
    );
  }
}
