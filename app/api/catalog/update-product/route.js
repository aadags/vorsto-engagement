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
    
    const { id, name, description, image, tax, taxType, stripeProductId, outofstock, varieties } = body;

    // 1. Create the product
    const stripeProduct = await stripe.products.update(stripeProductId, {
      name,
      description
    },
    {
      stripeAccount: org.stripe_account_id,
    });

    const product = await prisma.product.update({
      where: {
        id, organization_id: org.id
      },
      data: {
        name,
        description,
        tax,
        tax_type: taxType,
        outofstock
      }
    });

    for (const variety of varieties) {

      if(!variety.id)
      {
        const stripePrice = await stripe.prices.create(
          {
            product: stripeProduct.id,
            unit_amount: variety.price * 100,
            currency: org.currency,
          },
          {
            stripeAccount: org.stripe_account_id,
          }
        );

        await prisma.inventory.create({
          data: {
            name: variety.name,
            quantity: variety.quantity,
            price: variety.price * 100,
            stripePriceId: stripePrice.id,
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

          await stripe.prices.update(variety.stripePriceId, {
            active: false,
          },
          {
            stripeAccount: org.stripe_account_id,
          });

          const stripePrice = await stripe.prices.create(
            {
              product: stripeProduct.id,
              unit_amount: variety.price * 100,
              currency: org.currency,
            },
            {
              stripeAccount: org.stripe_account_id,
            }
          );

          await prisma.inventory.update({
            where: {
              id: variety.id
            },
            data: {
              name: variety.name,
              quantity: variety.quantity,
              price: variety.price * 100,
              stripePriceId: stripePrice.id
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
          default: index === 0, // Set first image as default
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
