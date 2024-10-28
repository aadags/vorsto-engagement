import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers'
const prisma = new PrismaClient();
import faktory from "faktory-worker"

async function getCookieData() {
  const cookieData = cookies().get('userId');
  return cookieData ? cookieData.value : null;
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { ref, type } = body;
    const cookieData = await getCookieData()
    const userId = Number(cookieData) ?? 0;

    const user = await prisma.user.findFirst({
      where: { id: userId }
    });

    const trx = await prisma.paystack.findFirst({
      where: {
        reference: ref,
      },
    });

    if(!trx){
      const response = await fetch(`https://api.paystack.co/transaction/verify/${ref}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_PAYSTACK_API_KEY}`,
        }
      });

      if (response.ok) {
        const { data } = await response.json();

        if(type==="premium" || type==="enterprise"){

          if(data.status==="success"){

              await prisma.paystack.create(
                {
                  data: {
                    reference: ref
                  }
                }
              );

              await prisma.user.update({
                where: { id: userId },
                data: {
                  stripe_id: data.customer.customer_code,
                  plan: data.plan_object.plan_code,
                  plan_status: "active",
                },
              });

              const client = await faktory.connect({ url: process.env.FAKTORY_URL ?? "" });
              await client.push({
                jobtype: 'BalanceUpdate',
                args: [{ stripeId: data.customer.customer_code, plan: data.plan_object.plan_code }],
                queue: 'default', // or specify another queue
                at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 2 minutes delay
              });

              await client.close();

          }

        } else {

          if(data.status==="success"){

            await prisma.paystack.create(
              {
                data: {
                  reference: ref
                }
              }
            );

            if(type==="tokens")
            {

              const base = 1000000;
              const qty = data.amount / 1000000;

              await prisma.user.update({
                where: { id: userId },
                data: {
                  gpt_token: user.gpt_token + (qty * base),
                },
              });
          
            } else if(type==="ipaddress")
            {

              const qty = data.amount / 500000;

              await prisma.user.update({
                where: { id: userId },
                data: {
                  whitelist_ext: user.whitelist_ext + qty,
                },
              });
          
            }

          }
        }
        
      } 
    }

    return NextResponse.json({ message: 'payment verified successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to verify payment' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
}

export async function PUT() {
  return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
}
