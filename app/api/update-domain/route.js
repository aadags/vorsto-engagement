"use server";
import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import { Vercel } from '@vercel/sdk';

export async function POST(req) {
  try {

    const vercel = new Vercel({
      bearerToken: process.env.VERCEL_TOKEN,
    });
    
    const organizationId = Number(
      req.cookies.get("organizationId")?.value ?? 0
    );

    const org = await prisma.organization.findFirstOrThrow({
      where: { id: organizationId },
    });

    const { domain } = await req.json();
      
    await prisma.organization.update({
        where:{
          id: org.id
        }, 
        data: {
          domain
        }
    })

    try {
      // Add a new domain
      const addDomainResponse = await vercel.projects.addProjectDomain({
        idOrName: 'vorsto-multishop', //The project name used in the deployment URL
        requestBody: {
          name: domain,
        },
      });
  
      console.log(`Domain added: ${addDomainResponse.name}`);
      console.log('Domain Details:', JSON.stringify(addDomainResponse, null, 2));
    } catch (error) {
      console.error(error);
    }
    
    return NextResponse.json({
      status: true
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to save business" },
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
