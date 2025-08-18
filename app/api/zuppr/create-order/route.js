import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import faktory from "faktory-worker";
import Stripe from "stripe";
import { sendBusinessOrderReceivedNotification } from "@/services/whatsapp";

export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia',
});

export async function POST(req) {
  try {
    const { items, amount, cartAmount, subCartAmount, subCartTaxAmount, deliveryAmount, deliverySubAmount, deliveryTaxAmount, tipAmount, customerId, orgId, intentId } = await req.json();

    const org = await prisma.organization.findFirst({
      where: { id: Number(orgId) },
    });

    const customer = await prisma.customer.findUnique({
      where: {
        id: customerId
      },
      include: {
        contacts: {
          where: {
            organization_id: orgId
          }
        }
      }
    });

    let contact = customer.contacts.length > 0? customer.contacts[0] : null;

    if (!contact) {
      contact = await prisma.contact.create({
        data: {
          name: customer.firstname + " " + customer.lastname,
          email: customer.email,
          phone: customer.phone,
          organization_id: org.id,
        },
      });
    }

    const shippingCommission = Math.round((subCartAmount * org.ship_org_info.merchant_commission_rate) / 100)

    const order = await prisma.order.create({
      data: {
        contact_id: contact.id,
        total_price: cartAmount,
        sub_total_price: subCartAmount,
        tax_total: subCartTaxAmount,
        address: customer.address,
        note: customer.note,
        shipping_commission: shippingCommission,
        shipping_price: deliveryAmount,
        shipping_tip: tipAmount,
        status: "Pending",
        channel: 'Zuppr',
        transactionId: intentId,
        organization_id: orgId,
        order_items: {
          create: items.map((r) => ({
            inventory_id: r.inventory_id,
            status: 'Pending',
            quantity: Number(r.quantity),
            price: lineSubCents(r),               // line subtotal (cents, before tax)
            tax: lineTaxCents(r),                 // tax (cents)
            price_unit: (r.price_unit || 'unit'), // keep what you stored in cart
          }))
        },
      },
      include: {
        order_items: true,
      },
    });

    // 🔽 Deplete inventory and ingredients
    for (const item of order.order_items) {
      const qtyToDecrement = item.quantity;
      
      const inventory = await prisma.inventory.findUnique({
        where: { id: item.inventory_id },
        select: {
          id: true,
          price_unit: true,
          quantity: true,
          weight_available: true,
        },
      });

      // 🔁 Deplete ingredient stock if food org
      if (org.type === "Food") {
        const ingredientUsages = await prisma.ingredientUsage.findMany({
          where: { inventory_id: inventory.id },
          include: { ingredient: true },
        });

        for (const usage of ingredientUsages) {
          const ingredient = usage.ingredient;

          if (ingredient.unit_type === "unit") {
            await prisma.ingredient.update({
              where: { id: ingredient.id },
              data: {
                quantity: ingredient.quantity - (usage.usage_quantity ?? 0) * qtyToDecrement,
              },
            });
          } else {
            await prisma.ingredient.update({
              where: { id: ingredient.id },
              data: {
                weight_available: ingredient.weight_available - (usage.usage_weight ?? 0) * qtyToDecrement,
              },
            });
          }
        }
      } else {
        const isWeight = inventory.price_unit !== "unit";

        const inventoryUpdate = isWeight
          ? { weight_available: inventory.weight_available - qtyToDecrement }
          : { quantity: inventory.quantity - qtyToDecrement };

        await prisma.inventory.update({
          where: { id: inventory.id },
          data: inventoryUpdate,
        });

      }
    }


    
    // 📲 Notify business
    if (org.contact_number && org.contact_number !== "" && org.ship_org_info.merchant_commission_rate > 20) {
      await sendBusinessOrderReceivedNotification(org.contact_number, org.name, order.id);
    }

    await fetch(`${process.env.SHIPPING_API}/api/create-shipping`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ companyId: org.ship_org_id, customer, pickupUid: order.id, totalCost: deliveryAmount, fare: deliverySubAmount, tax: deliveryTaxAmount, tip: tipAmount }),
    });

    const client = await faktory.connect({ url: process.env.FAKTORY_URL || "" });

    await client.push({
      jobtype: "SendOrderNotification",
      args: [{ order, contact, org }],
      queue: "default",
      at: new Date(Date.now()),
    });

    await client.close();

    return NextResponse.json(order);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Order creation failed" }, { status: 500 });
  }
}

function lineSubCents(r) {
  const price = Number(r.price_cents ?? 0);
  const qty = Number(r.quantity ?? 1); // guard
  return Math.round(price * qty);
}

function lineTaxCents(r) {
  const taxVal = Number(r.tax ?? 0);
  const qty = Math.max(1, Number(r.quantity ?? 1));
  const type = String(r.tax_type ?? 'flat').toLowerCase();

  // normalize variations like "flatfee"
  const taxType = type === 'flatfee' ? 'flat' : type;

  if (taxType === 'percentage') {
    // taxVal is e.g. 12 for 12%
    return Math.round((lineSubCents(r) * taxVal) / 100);
  }
  // flat => taxVal is cents per unit
  return Math.round(taxVal * qty);
}
