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
    const { uuid, customer, mid, channel, intentId } = await req.json();

    const org = await prisma.organization.findFirst({
      where: { id: mid },
    });

    let contact = await prisma.contact.findUnique({
      where: {
        organization_id_email: {
          organization_id: org.id,
          email: customer.email,
        },
      },
    });

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

    const cart = await prisma.cart.findFirst({
      where: { uuid },
      include: {
        cart_items: {
          include: {
            inventory: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });

    const orderItems = cart.cart_items;
    const shipping = JSON.parse(cart.shipping_info);

    const { subtotal, taxTotal } = orderItems.reduce(
      (acc, item) => {
        const isWeight = item.inventory.price_unit !== "unit";
        const step = isWeight ? item.inventory.weight_step : 1;
        const qty = item.quantity;
        const price = item.inventory.price;

        const base = isWeight ? (qty / step) * price : qty * price;
        const tax =
          item.inventory.product.tax_type === "flatfee"
            ? item.inventory.product.tax
            : (base * item.inventory.product.tax) / 100;

        acc.subtotal += base;
        acc.taxTotal += tax;
        return acc;
      },
      { subtotal: 0, taxTotal: 0 }
    );

    const total = Math.ceil(subtotal + taxTotal + shipping.total + shipping.tip);
    const channelFee = org.channel_fee / 100;
    const shippingCommission =
      shipping.merchant_commission_rate > 0
        ? subtotal * (shipping.merchant_commission_rate / 100)
        : 0;
    const appFee = Math.ceil(channelFee * subtotal + shipping.total + shippingCommission + shipping.tip);

    await fetch(`${process.env.SHIPPING_API}/api/update-commission`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        companyId: org.ship_org_id,
        deliveryId: shipping.id,
        shippingCommission,
        customer,
      }),
    });

    const order = await prisma.order.create({
      data: {
        contact_id: contact.id,
        total_price: total,
        sub_total_price: subtotal,
        tax_total: taxTotal,
        address: customer.address,
        note: customer.note,
        shipping_commission: shippingCommission,
        shipping_price: shipping.total,
        shipping_tip: shipping.tip,
        shipping_id: shipping.id,
        status: "Pending",
        channel,
        transactionId: intentId,
        organization_id: mid,
        order_items: {
          create: orderItems.map((item) => {
            const isWeight = item.inventory.price_unit !== "unit";
            const step = isWeight ? item.inventory.weight_step : 1;
            const qty = item.quantity;
            const price = item.inventory.price;

            const base = isWeight ? (qty / step) * price : qty * price;
            const tax =
              item.inventory.product.tax_type === "flatfee"
                ? item.inventory.product.tax
                : (base * item.inventory.product.tax) / 100;

            return {
              inventory_id: item.inventory_id,
              status: "Pending",
              quantity: qty,
              price: Math.round(base),
              tax: Math.round(tax),
              price_unit: item.inventory.price_unit || "unit",
            };
          }),
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

    // 🧹 Clean up cart
    await prisma.$transaction(async (tx) => {
      await tx.cartItem.deleteMany({ where: { cart_id: cart.id } });
      await tx.cart.delete({ where: { id: cart.id } });
    });

    // 📲 Notify business
    if (org.contact_number && org.contact_number !== "") {
      await sendBusinessOrderReceivedNotification(org.contact_number, org.name, order.id);
    }

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
