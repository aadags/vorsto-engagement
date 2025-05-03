"use server";
import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import Stripe from 'stripe';

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia', // Use the correct API version
});


export async function POST(req) {
  try {
    const organizationId = Number(
      req.cookies.get("organizationId")?.value ?? 0
    );

    const org = await prisma.organization.findFirst({
      where: { id: organizationId },
    });

    const body = await req.json();
    
    const { id, name, description, category, isNewCategory, newCategoryDescription, image, tax, taxType, outofstock, varieties } = body;

    let cat = { id: category };

    if(isNewCategory) {

      cat = await prisma.category.create({
        data: {
          name: category,
          description: newCategoryDescription,
          organization_id: org.id
        }
      });

    }

    const product = await prisma.product.update({
      where: {
        id, organization_id: org.id
      },
      data: {
        name,
        description,
        category_id: cat.id,
        tax: Number(tax),
        tax_type: taxType,
        outofstock
      }
    });

    for (const variety of varieties) {

      if(!variety.id)
      {
        await prisma.inventory.create({
          data: {
            name: variety.name,
            quantity: variety.quantity,
            price: variety.price * 100,
            product_id: product.id
          },
        });

      } else {

        const existing = await prisma.inventory.findFirst({
          where: {
            id: variety.id, product_id: id
          }
        })

        if(existing.price !==  variety.price * 100) {

          await prisma.inventory.update({
            where: {
              id: variety.id
            },
            data: {
              name: variety.name,
              quantity: variety.quantity,
              price: variety.price * 100
            },
          });

        } else {

          await prisma.inventory.update({
            where: {
              id: variety.id
            },
            data: {
              name: variety.name,
              quantity: variety.quantity,
            },
          });
        }
      }
    }

    for (const [index, img] of image.entries()) {
      await prisma.image.create({
        data: {
          product_id: product.id,
          url: img.secure_url,
          cloud_id: img.public_id,
        },
      });
    }
    
    return NextResponse.json({
      product
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
