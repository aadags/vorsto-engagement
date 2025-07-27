// /app/api/offline-order/route.ts
import { NextResponse } from "next/server";
import prisma from "@/db/prisma";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const {
      items,
      total,        // finalTotal (discount already applied)
      sub_total,    // rawTotal before discount
      discount,
      method,
      cash,
      card,
      loyaltyId,    // payment.loyalty.id
      id,
      date,         // ISO string
    } = await req.json();

    // 1. Recompute subtotal & taxTotal for accuracy
    const { subtotal, taxTotal } = items.reduce(
      (acc, item) => {
        console.log({item})
        const isWeight = item.selectedInventory.price_unit !== "unit";
        const step     = isWeight ? item.selectedInventory.weight_step : 1;
        const qty      = item.quantity;
        const price    = item.selectedInventory.price;

        const base = isWeight
          ? (qty / step) * price
          : qty * price;

        const tax = item.tax_type === "flatfee"
          ? item.tax
          : (base * item.tax) / 100;

        acc.subtotal += base;
        acc.taxTotal  += tax;
        return acc;
      },
      { subtotal: 0, taxTotal: 0 }
    );

    // 2. Fetch loyalty account & config (if any)
    let loyaltyAccount = null;
    let pointsEarned = 0;
    if (loyaltyId) {
      loyaltyAccount = await prisma.loyaltyAccount.findUnique({
        where: { id: loyaltyId },
        include: {
          loyalty_program: true,   // has point_rate (dollars per point)
          membership_plan: true,   // has cashback_percent
        },
      });

      if (loyaltyAccount?.loyalty_program?.point_rate) {
        // 1 point per $point_rate
        pointsEarned += Math.floor((total /100) / loyaltyAccount.loyalty_program.point_rate);
      }
      if (loyaltyAccount?.membership_plan?.cashback_percent) {
        // e.g. 5% cashback => 0.05 * total in dollars
        const cb = Math.floor((total / 100) * (loyaltyAccount.membership_plan.cashback_percent) / 100);
        pointsEarned += Math.floor(cb / loyaltyAccount.loyalty_program.point_rate);
      }
    }

    // 3. Create order + items + loyalty transaction in one go
    const order = await prisma.order.create({
      data: {
        organization_id: id,
        contact_id: loyaltyAccount?.contact_id || null,
        sub_total_price: subtotal,
        tax_total:       taxTotal,
        total_price:     total,
        channel:         "in_person",
        status:          "Paid",
        note:            `Offline POS • ${method} • ${date}`,
        order_items: {
          create: items.map(item => {
            const isWeight = item.selectedInventory.price_unit !== "unit";
            const step     = isWeight ? item.selectedInventory.weight_step : 1;
            const qty      = item.quantity;
            const price    = item.selectedInventory.price;
            const base = isWeight ? (qty / step) * price : qty * price;
            const tax  = item.tax_type === "flatfee"
              ? item.tax
              : (base * item.tax) / 100;

            return {
              inventory_id: item.selectedInventory.id,
              quantity:     qty,
              price:        base,
              tax:          tax,
              price_unit:   item.selectedInventory.price_unit,
              status:       "Paid",
            };
          })
        },
        loyalty_transactions: pointsEarned > 0
          ? {
              create: {
                loyalty_account_id: loyaltyId,
                type:       "earn",
                amount:     pointsEarned,
                description:`Earned via POS (${method})`,
              }
            }
          : undefined,
      },
    });

    if(pointsEarned > 0) {
      await prisma.loyaltyAccount.update({
        where: { id: loyaltyId },
        data: {
          points: {
            increment: pointsEarned
          }
        }
      })
    }

    const org = await prisma.organization.findFirst({
      where: {
        id: id
      }
    });
    
    
    for (const item of items){ 
      const qtyToDecrement = item.quantity;
      if (org.type === "Food") {
        const ingredientUsages = await prisma.ingredientUsage.findMany({
          where: { inventory_id: item.selectedInventory.id },
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
        const isWeight = item.selectedInventory.price_unit !== "unit";
        const decrement = item.quantity;

        const updateData = isWeight
          ? { weight_available: item.selectedInventory.weight_available - decrement }
          : { quantity: item.quantity - decrement };

        await prisma.inventory.update({
          where: { id: item.selectedInventory.id },
          data: updateData,
        });
    
      }
    }

    

    return NextResponse.json({ order });
  } catch (error) {
    console.error("Offline order failed:", error);
    return NextResponse.json(
      { error: "Unable to save offline order" },
      { status: 500 }
    );
  }
}
